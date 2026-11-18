import { useState, useEffect, useRef } from 'react';
import meetingRoomData from '../models/meetingRoomMock.json';
import {
  getLocalMediaStream,
  getDisplayMediaStream,
  createCallSession,
  joinCallSession,
  checkCallExists,
} from '../services/webrtcService';
import meetingRecorder from '../services/audioRecorderService';
import {
  liveSpeechRecognizer,
  transcribeAudioWithWhisper,
  generateMeetingSummaryWithGemini,
  saveMeetingSummaryToFirestore,
} from '../services/aiService';

export default function useMeetingRoomController({
  onMeetingFinished,
  roomConfig,
  currentUser,
}) {
  // Trạng thái thiết bị người dùng
  const [isMicOn, setIsMicOn] = useState(
    roomConfig?.initialMic !== undefined ? roomConfig.initialMic : true
  );
  const [isCamOn, setIsCamOn] = useState(
    roomConfig?.initialCam !== undefined ? roomConfig.initialCam : true
  );
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(
    roomConfig?.autoRecord !== undefined ? roomConfig.autoRecord : true
  );

  const roomTitle = roomConfig?.title || meetingRoomData.roomTitle;
  const roomId = roomConfig?.roomId || meetingRoomData.roomId;

  // Trạng thái kết nối WebRTC P2P
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle | requesting-media | connecting | connected | disconnected | failed
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [recordedAudioData, setRecordedAudioData] = useState(null);

  // Bộ đếm thời gian họp (Timer)
  const [seconds, setSeconds] = useState(0);

  // Phụ đề thời gian thực (Live Captions do AI nhận dạng)
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [liveCaption, setLiveCaption] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState([]);

  // Panel cạnh bên (Participants / Chat / P2P Info)
  const [activeSidePanel, setActiveSidePanel] = useState(null); // 'participants' | 'chat' | 'p2p' | null
  const [chatMessages, setChatMessages] = useState(meetingRoomData.initialChat);
  const [inputChat, setInputChat] = useState('');

  // Trạng thái Kết thúc họp & Xử lý AI
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiStep, setAiStep] = useState(1); // 1: Export WAV -> 2: Whisper STT -> 3: Gemini LLM -> Finish

  // Tham chiếu luồng và DOM Video
  const userVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pcRef = useRef(null);
  const cleanupRef = useRef(null);
  const screenTrackRef = useRef(null);

  // Đồng hồ đếm thời gian họp
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Giả lập phụ đề nhảy theo thời gian (mô phỏng Whisper Live)
  useEffect(() => {
    if (!showCaptions) return;
    const interval = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % meetingRoomData.sampleCaptions.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [showCaptions]);

  // Khởi động nhận diện giọng nói tiếng Việt thời gian thực (Live STT qua Web Speech API)
  useEffect(() => {
    if (showCaptions && isMicOn) {
      const speakerName = currentUser?.name || currentUser?.fullName || 'Bạn';
      liveSpeechRecognizer.start({
        speaker: speakerName,
        onCaption: (caption) => {
          setLiveCaption(caption);
        },
        onTranscriptUpdate: (list) => {
          setLiveTranscript(list);
        },
      });
    } else {
      liveSpeechRecognizer.stop();
    }

    return () => {
      liveSpeechRecognizer.stop();
    };
  }, [showCaptions, isMicOn, currentUser]);

  // Khởi tạo luồng WebRTC P2P thật khi vào phòng
  useEffect(() => {
    let isMounted = true;

    async function setupWebRTC() {
      try {
        setConnectionStatus('requesting-media');

        // 1. Lấy luồng Media thật từ Camera và Micro
        const stream = await getLocalMediaStream({
          video: isCamOn,
          audio: isMicOn,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Gắn vào thẻ video của chính mình
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        // Tự động kích hoạt bộ thu âm trộn tiếng (Audio Mixer) nếu bật thu âm
        if (isRecording) {
          try {
            meetingRecorder.start({
              localStream: stream,
              remoteStream: null,
            });
          } catch (e) {
            console.warn('[AudioRecorder] Không thể tự động bắt đầu thu âm:', e);
          }
        }

        setConnectionStatus('connecting');

        // 2. Định nghĩa các callback khi nhận remote stream hoặc thay đổi trạng thái
        const callbacks = {
          onRemoteStream: (rStream) => {
            if (!isMounted) return;
            console.log('[WebRTC P2P] Nhận được remote stream từ đối phương:', rStream);
            remoteStreamRef.current = rStream;
            setRemoteStream(rStream);
            setIsPeerConnected(true);

            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = rStream;
            }

            // Trộn âm thanh của đối tác vào bộ ghi âm cuộc họp
            meetingRecorder.addRemoteStream(rStream);
          },
          onConnectionStateChange: (state) => {
            if (!isMounted) return;
            setConnectionStatus(state);
            if (state === 'connected') {
              setIsPeerConnected(true);
            } else if (state === 'disconnected' || state === 'failed') {
              setIsPeerConnected(false);
            }
          },
        };

        // 3. Phân biệt vai trò Host (Chủ phòng) hay Callee (Người tham gia)
        let isHost = roomConfig?.isHost;

        // Nếu chưa được set rõ ràng, tự động nhận diện dựa trên việc phòng đã có Offer hay chưa
        if (isHost === undefined) {
          const check = await checkCallExists(roomId);
          if (check.exists && check.data?.offer && !check.data?.answer) {
            isHost = false; // Đã có offer chờ -> Vào vai Callee trả lời
          } else {
            isHost = true; // Chưa có phòng hoặc là phòng mới -> Vào vai Host
          }
        }

        let session;
        if (isHost) {
          console.log(`[WebRTC] Đang khởi tạo vai trò HOST cho phòng ${roomId}`);
          session = await createCallSession(roomId, stream, callbacks);
        } else {
          console.log(`[WebRTC] Đang khởi tạo vai trò CALLEE (GUEST) cho phòng ${roomId}`);
          session = await joinCallSession(roomId, stream, callbacks);
        }

        pcRef.current = session.pc;
        cleanupRef.current = session.cleanup;
      } catch (err) {
        console.warn('[WebRTC] Lỗi kết nối phòng họp:', err);
        if (isMounted) {
          setConnectionStatus('failed');
        }
      }
    }

    setupWebRTC();

    return () => {
      isMounted = false;
      meetingRecorder.cleanup();
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
    };
  }, [roomId]);

  // Format giây thành mm:ss
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  // Toggle Micro
  const toggleMic = () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  // Toggle Camera
  const toggleCam = () => {
    setIsCamOn((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  // Toggle Chia sẻ màn hình
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Dừng chia sẻ màn hình
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }

      // Khôi phục lại video track ban đầu của camera
      const originalCamTrack = localStreamRef.current?.getVideoTracks()[0];
      if (originalCamTrack && pcRef.current) {
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(originalCamTrack);
        }
      }

      if (userVideoRef.current && localStreamRef.current) {
        userVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await getDisplayMediaStream();
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        // Thay thế video track gửi đi sang màn hình
        if (pcRef.current) {
          const sender = pcRef.current.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        // Xem trước màn hình trên thẻ video của chính mình
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = screenStream;
        }

        // Lắng nghe khi người dùng bấm nút "Dừng chia sẻ" mặc định của trình duyệt
        screenTrack.onended = () => {
          const originalCamTrack = localStreamRef.current?.getVideoTracks()[0];
          if (originalCamTrack && pcRef.current) {
            const sender = pcRef.current.getSenders().find((s) => s.track?.kind === 'video');
            if (sender) {
              sender.replaceTrack(originalCamTrack);
            }
          }
          if (userVideoRef.current && localStreamRef.current) {
            userVideoRef.current.srcObject = localStreamRef.current;
          }
          setIsScreenSharing(false);
          screenTrackRef.current = null;
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.warn('Người dùng huỷ chia sẻ màn hình:', err);
      }
    }
  };

  // Toggle Thu âm đa kênh
  const toggleRecording = () => {
    setIsRecording((prev) => {
      const nextState = !prev;
      if (nextState) {
        if (meetingRecorder.isPaused) {
          meetingRecorder.resume();
        } else if (!meetingRecorder.isRecording && localStreamRef.current) {
          try {
            meetingRecorder.start({
              localStream: localStreamRef.current,
              remoteStream: remoteStreamRef.current,
            });
          } catch (e) {
            console.warn('[AudioRecorder] Không thể bật thu âm:', e);
          }
        }
      } else {
        if (meetingRecorder.isRecording) {
          meetingRecorder.pause();
        }
      }
      return nextState;
    });
  };

  const toggleCaptions = () => setShowCaptions((prev) => !prev);

  // Toggle Side Panel
  const toggleSidePanel = (panelName) => {
    setActiveSidePanel((prev) => (prev === panelName ? null : panelName));
  };

  // Gửi tin nhắn chat
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputChat.trim()) return;

    const senderName = currentUser?.name || currentUser?.fullName || 'Bạn';

    const newMsg = {
      id: `c-${Date.now()}`,
      sender: senderName,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: inputChat.trim(),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Lưu vào bản ghi hội thoại của AI
    liveSpeechRecognizer.addManualTranscript(senderName, inputChat.trim());
    setInputChat('');
  };

  // Quy trình Kết thúc cuộc họp & Xử lý AI
  const handleEndMeeting = async () => {
    // 1. Dừng thu âm trước khi tắt Microphone để đảm bảo file ghi âm đầy đủ
    let audioResult = null;
    try {
      audioResult = await meetingRecorder.stop();
      setRecordedAudioData(audioResult);
    } catch (recErr) {
      console.warn('[AudioRecorder] Lỗi dừng thu âm:', recErr);
    }

    // 2. Dừng nhận diện giọng nói & thu thập toàn bộ Transcript
    const finalTranscripts = liveSpeechRecognizer.stop();

    // 3. Sau khi ghi âm xong mới giải phóng Camera và Micro
    if (cleanupRef.current) {
      try {
        cleanupRef.current();
      } catch (e) {}
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
    }

    setIsProcessingAI(true);
    setAiStep(1); // Bước 1: Thu âm MediaRecorder -> Xuất WAV/WebM

    setTimeout(async () => {
      setAiStep(2); // Bước 2: OpenAI Whisper STT xử lý lời thoại tiếng Việt

      const speakerName = currentUser?.name || currentUser?.fullName || 'Bạn';
      const fallbackList = finalTranscripts.length > 0 ? finalTranscripts : liveTranscript;
      let transcriptsToProcess = fallbackList;

      try {
        console.log('[MeetingRoom] Đang đưa file ghi âm vào pipeline OpenAI Whisper STT...');
        const whisperResult = await transcribeAudioWithWhisper(audioResult?.blob, {
          speakerName,
          fallbackTranscripts: fallbackList,
        });

        if (Array.isArray(whisperResult) && whisperResult.length > 0) {
          transcriptsToProcess = whisperResult;
        }
      } catch (whisperErr) {
        console.warn('[MeetingRoom] Lỗi gọi Whisper STT, sử dụng fallback Live STT:', whisperErr);
      }

      setAiStep(3); // Bước 3: Google Gemini 1.5 Tóm tắt & Action Items

      try {
        // Gọi AI Gemini tóm tắt biên bản
        const aiSummary = await generateMeetingSummaryWithGemini(transcriptsToProcess, {
          meetingTitle: roomTitle,
          hostName: speakerName,
        });

        // Lưu biên bản thông minh vào Cloud Firestore
        await saveMeetingSummaryToFirestore(roomId, aiSummary, transcriptsToProcess);

        setTimeout(() => {
          setIsProcessingAI(false);
          if (onMeetingFinished) {
            onMeetingFinished(roomId, audioResult);
          }
        }, 800);
      } catch (aiErr) {
        console.warn('[AI] Lỗi xử lý biên bản AI:', aiErr);
        setIsProcessingAI(false);
        if (onMeetingFinished) {
          onMeetingFinished(roomId, audioResult);
        }
      }
    }, 1200);
  };

  // Thông tin mạng P2P hiển thị
  const p2pNetworkInfo = {
    ...meetingRoomData.network,
    iceState:
      connectionStatus === 'connected'
        ? 'Connected (Direct P2P Peer)'
        : connectionStatus === 'connecting'
        ? 'Establishing WebRTC ICE...'
        : connectionStatus === 'requesting-media'
        ? 'Requesting Media Device...'
        : 'Standby / Waiting Peer',
    latency: connectionStatus === 'connected' ? '14ms' : '--',
  };

  return {
    roomTitle,
    roomId,
    networkInfo: p2pNetworkInfo,
    participants: meetingRoomData.participants,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isRecording,
    formattedTime,
    showCaptions,
    currentCaption: meetingRoomData.sampleCaptions[captionIndex],
    liveCaption,
    liveTranscript,
    activeSidePanel,
    chatMessages,
    inputChat,
    setInputChat,
    isProcessingAI,
    aiStep,
    userVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    connectionStatus,
    isPeerConnected,
    recordedAudioData,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    toggleRecording,
    toggleCaptions,
    toggleSidePanel,
    handleSendMessage,
    handleEndMeeting,
  };
}
