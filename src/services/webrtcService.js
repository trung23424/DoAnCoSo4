import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Cấu hình STUN Server công khai của Google (miễn phí, tốc độ cao)
 * Giúp thiết bị xuyên NAT/Firewall để thiết lập kết nối ngang hàng P2P
 */
export const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * 1. Khởi tạo MediaStream từ Camera & Micro thật của máy người dùng
 * @param {Object} options - { video: boolean, audio: boolean }
 * @returns {Promise<MediaStream>}
 */
export async function getLocalMediaStream(options = { video: true, audio: true }) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Trình duyệt của bạn không hỗ trợ WebRTC getUserMedia.');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: options.video
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          }
        : false,
      audio: options.audio
        ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : false,
    });
    return stream;
  } catch (err) {
    console.warn('Không thể truy cập camera/micro với cấu hình đầy đủ, thử fallback:', err);
    // Dự phòng trường hợp máy không có camera hoặc bị từ chối 1 trong 2 thiết bị
    if (options.video && options.audio) {
      try {
        return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      } catch (audioErr) {
        throw new Error('Vui lòng cấp quyền Microphone hoặc Camera để tham gia họp.');
      }
    }
    throw err;
  }
}

/**
 * 2. Lấy luồng chia sẻ màn hình (Screen Share)
 * @returns {Promise<MediaStream>}
 */
export async function getDisplayMediaStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error('Trình duyệt không hỗ trợ chia sẻ màn hình.');
  }
  return await navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: 'always',
    },
    audio: true,
  });
}

/**
 * 3. Kiểm tra xem phòng họp/cuộc gọi có tồn tại trên Firestore không
 * @param {string} callId
 * @returns {Promise<{ exists: boolean, data: any }>}
 */
export async function checkCallExists(callId) {
  if (!callId) return { exists: false, data: null };
  const callDocRef = doc(db, 'calls', callId);
  const snap = await getDoc(callDocRef);
  return {
    exists: snap.exists(),
    data: snap.exists() ? snap.data() : null,
  };
}

/**
 * 4. HOST FLOW: Khởi tạo cuộc gọi WebRTC và lưu Offer lên Firestore
 * @param {string} callId - Mã phòng họp (ID cuộc họp)
 * @param {MediaStream} localStream - Luồng Media của Host
 * @param {Object} callbacks - { onRemoteStream, onConnectionStateChange }
 * @returns {Promise<{ pc: RTCPeerConnection, cleanup: Function }>}
 */
export async function createCallSession(callId, localStream, callbacks = {}) {
  const { onRemoteStream, onConnectionStateChange } = callbacks;

  const pc = new RTCPeerConnection(ICE_SERVERS);
  const callDocRef = doc(db, 'calls', callId);
  const offerCandidatesCol = collection(db, 'calls', callId, 'offerCandidates');
  const answerCandidatesCol = collection(db, 'calls', callId, 'answerCandidates');

  const unsubscribers = [];
  const remoteStream = new MediaStream();

  // Đẩy các Track của Local Stream vào PeerConnection
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
  }

  // Lắng nghe Track từ phía đối phương và thêm vào Remote Stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    if (onRemoteStream) {
      onRemoteStream(remoteStream);
    }
  };

  // Theo dõi trạng thái kết nối P2P (connecting, connected, disconnected, failed)
  pc.onconnectionstatechange = () => {
    console.log(`[WebRTC Host] Trạng thái kết nối: ${pc.connectionState}`);
    if (onConnectionStateChange) {
      onConnectionStateChange(pc.connectionState);
    }
  };

  // Thu thập ICE Candidates của Host và ghi lên Firestore
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(offerCandidatesCol, event.candidate.toJSON()).catch((err) =>
        console.warn('Lỗi ghi offer candidate:', err)
      );
    }
  };

  // Tạo Offer SDP
  const offerDescription = await pc.createOffer();
  await pc.setLocalDescription(offerDescription);

  const offerPayload = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  // Lưu Offer vào Firestore
  await setDoc(callDocRef, {
    offer: offerPayload,
    status: 'waiting',
    createdAt: serverTimestamp(),
  });

  // Lắng nghe Answer SDP từ phía Callee (người tham gia)
  const unsubCall = onSnapshot(callDocRef, (snapshot) => {
    const data = snapshot.data();
    if (!pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription).catch((err) =>
        console.error('Lỗi thiết lập remote description từ answer:', err)
      );
    }
  });
  unsubscribers.push(unsubCall);

  // Lắng nghe ICE Candidates của Callee được gửi về
  const unsubAnswerCandidates = onSnapshot(answerCandidatesCol, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidateData = change.doc.data();
        const candidate = new RTCIceCandidate(candidateData);
        pc.addIceCandidate(candidate).catch((err) =>
          console.warn('Lỗi thêm answer ICE candidate:', err)
        );
      }
    });
  });
  unsubscribers.push(unsubAnswerCandidates);

  const cleanup = () => {
    unsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {}
    });
    try {
      pc.close();
    } catch (e) {}
  };

  return { pc, remoteStream, cleanup };
}

/**
 * 5. GUEST/CALLEE FLOW: Nhập mã phòng, đọc Offer và tạo Answer trả lời
 * @param {string} callId - Mã phòng họp
 * @param {MediaStream} localStream - Luồng Media của Guest
 * @param {Object} callbacks - { onRemoteStream, onConnectionStateChange }
 * @returns {Promise<{ pc: RTCPeerConnection, cleanup: Function }>}
 */
export async function joinCallSession(callId, localStream, callbacks = {}) {
  const { onRemoteStream, onConnectionStateChange } = callbacks;

  const callDocRef = doc(db, 'calls', callId);
  const snap = await getDoc(callDocRef);
  if (!snap.exists()) {
    throw new Error(`Không tìm thấy phòng họp mã "${callId}". Vui lòng kiểm tra lại.`);
  }

  const callData = snap.data();
  if (!callData?.offer) {
    throw new Error('Chủ phòng chưa phát tín hiệu Offer.');
  }

  const pc = new RTCPeerConnection(ICE_SERVERS);
  const offerCandidatesCol = collection(db, 'calls', callId, 'offerCandidates');
  const answerCandidatesCol = collection(db, 'calls', callId, 'answerCandidates');

  const unsubscribers = [];
  const remoteStream = new MediaStream();

  // Đẩy Track của Guest vào PeerConnection
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
  }

  // Lắng nghe Remote Stream từ Host
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    if (onRemoteStream) {
      onRemoteStream(remoteStream);
    }
  };

  // Theo dõi trạng thái kết nối
  pc.onconnectionstatechange = () => {
    console.log(`[WebRTC Callee] Trạng thái kết nối: ${pc.connectionState}`);
    if (onConnectionStateChange) {
      onConnectionStateChange(pc.connectionState);
    }
  };

  // Thu thập ICE Candidates của Callee và ghi lên Firestore
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(answerCandidatesCol, event.candidate.toJSON()).catch((err) =>
        console.warn('Lỗi ghi answer candidate:', err)
      );
    }
  };

  // Thiết lập Offer từ Host làm Remote Description
  await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

  // Tạo Answer SDP
  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answerPayload = {
    sdp: answerDescription.sdp,
    type: answerDescription.type,
  };

  // Cập nhật Answer lên Firestore
  await updateDoc(callDocRef, {
    answer: answerPayload,
    status: 'connected',
  });

  // Lắng nghe ICE Candidates của Host
  const unsubOfferCandidates = onSnapshot(offerCandidatesCol, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidateData = change.doc.data();
        const candidate = new RTCIceCandidate(candidateData);
        pc.addIceCandidate(candidate).catch((err) =>
          console.warn('Lỗi thêm offer ICE candidate:', err)
        );
      }
    });
  });
  unsubscribers.push(unsubOfferCandidates);

  const cleanup = () => {
    unsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {}
    });
    try {
      pc.close();
    } catch (e) {}
  };

  return { pc, remoteStream, cleanup };
}
