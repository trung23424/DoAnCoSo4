import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Service Quản lý Cuộc họp với Cloud Firestore
 * Hỗ trợ lưu trữ theo tài khoản riêng (Data Isolation) & Đồng bộ thời gian thực
 */

/**
 * 1. Tạo cuộc họp mới và lưu trực tiếp lên Cloud Firestore
 * Gắn liền với hostId và hostEmail của tài khoản đang đăng nhập
 */
export const createMeetingInFirestore = async (config, currentUser) => {
  const meetingId =
    config.roomId || `asm-${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date();

  // Định dạng ngày và giờ theo chuẩn Việt Nam
  const dateStr = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const hostId = currentUser?.id || currentUser?.uid || 'guest';
  const hostName = currentUser?.name || currentUser?.fullName || 'Thành viên VKU';
  const hostEmail = currentUser?.email || 'user@vku.udn.vn';

  const newMeeting = {
    id: meetingId,
    title: config.title?.trim() || 'Cuộc họp trực tuyến mới',
    date: dateStr,
    time: `${timeStr} - Vừa tạo`,
    duration: '00:00',
    hostId: hostId,
    hostName: hostName,
    hostEmail: hostEmail,
    host: hostName,
    status: 'ready', // 'ready' | 'processing' | 'completed'
    summaryStatus: 'Sẵn sàng ghi âm & tóm tắt AI',
    peersCount: 1,
    language: config.language || 'vi',
    autoRecord: config.autoRecord !== undefined ? config.autoRecord : true,
    initialMic: config.initialMic !== undefined ? config.initialMic : true,
    initialCam: config.initialCam !== undefined ? config.initialCam : true,
    participants: [hostEmail],
    network: 'P2P Mesh WebRTC',
    createdAt: now.toISOString(),
  };

  // 1. Lưu thông tin phòng họp vào collection 'meetings'
  const meetingRef = doc(db, 'meetings', meetingId);
  await setDoc(meetingRef, newMeeting);

  // 2. Khởi tạo sẵn tài liệu biên bản AI ban đầu trong collection 'meeting_details'
  try {
    const detailsRef = doc(db, 'meeting_details', meetingId);
    await setDoc(detailsRef, {
      meetingId: meetingId,
      title: newMeeting.title,
      date: dateStr,
      host: hostName,
      language: newMeeting.language,
      summary: {
        executive: `Cuộc họp "${newMeeting.title}" do ${hostName} (${hostEmail}) khởi tạo vào ngày ${dateStr}. Sẵn sàng xử lý bởi OpenAI Whisper và Google Gemini 1.5 Pro.`,
        keyPoints: [
          'Khởi tạo phòng họp WebRTC P2P thành công',
          'Trợ lý AI SmartMeet sẵn sàng nhận diện giọng nói',
        ],
        decisions: [
          'Áp dụng ghi âm bảo mật MediaRecorder trên trình duyệt',
        ],
        actionItems: [
          {
            id: 'act-1',
            text: 'Mời các thành viên khác vào phòng họp bằng mã ' + meetingId,
            assignee: hostName,
            deadline: 'Hôm nay',
            completed: false,
          },
        ],
      },
      transcript: [],
      createdAt: now.toISOString(),
    });
  } catch (detailErr) {
    console.warn('Lưu meeting_details ban đầu:', detailErr);
  }

  return newMeeting;
};

/**
 * 2. Lắng nghe danh sách cuộc họp của TỪNG TÀI KHOẢN THEO THỜI GIAN THỰC (onSnapshot)
 * - Tài khoản thường: Chỉ tải cuộc họp do chính tài khoản đó tạo (hostId === currentUser.id)
 * - Tài khoản Admin: Có thể xem toàn bộ hệ thống
 */
export const subscribeUserMeetings = (currentUser, callback) => {
  if (!currentUser?.id && !currentUser?.uid) {
    callback([]);
    return () => {};
  }

  const userId = currentUser.id || currentUser.uid;
  const isAdmin = currentUser.role === 'Admin';

  const meetingsCol = collection(db, 'meetings');

  // Query: Nếu là Admin xem toàn bộ, nếu là User chỉ xem phòng do mình làm Host
  let q;
  if (isAdmin) {
    q = query(meetingsCol);
  } else {
    q = query(meetingsCol, where('hostId', '==', userId));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const meetings = [];
      snapshot.forEach((docSnap) => {
        meetings.push(docSnap.data());
      });

      // Sắp xếp theo thời gian tạo mới nhất lên đầu
      meetings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(meetings);
    },
    (err) => {
      console.warn('Lỗi lắng nghe cuộc họp Firestore:', err);
      callback([]);
    }
  );
};

/**
 * 3. Xóa cuộc họp khỏi Cloud Firestore
 */
export const deleteMeetingFromFirestore = async (meetingId) => {
  if (!meetingId) return;
  await deleteDoc(doc(db, 'meetings', meetingId));
  try {
    await deleteDoc(doc(db, 'meeting_details', meetingId));
  } catch (e) {
    console.warn('Xóa meeting_details:', e);
  }
};

/**
 * 4. Lấy chi tiết biên bản cuộc họp từ Firestore
 */
export const getMeetingDetailsFromFirestore = async (meetingId) => {
  if (!meetingId) return null;
  const docSnap = await getDoc(doc(db, 'meeting_details', meetingId));
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};
