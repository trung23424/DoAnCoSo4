import { useState, useEffect, useRef } from 'react';
import meetingRoomData from '../models/meetingRoomMock.json';

export default function useMeetingRoomController({ onMeetingFinished, roomConfig }) {
  // Trạng thái thiết bị người dùng (khởi tạo theo cấu hình tạo phòng)
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

  // Trạng thái phòng & kết nối P2P
  const [participants, setParticipants] = useState(meetingRoomData.participants);
  const [networkInfo] = useState(meetingRoomData.network);

  // Bộ đếm thời gian họp (Timer)
  const [seconds, setSeconds] = useState(145); // Bắt đầu ở 02:25 để tạo cảm giác tự nhiên

  // Phụ đề thời gian thực (Live Captions do AI nhận dạng)
  const [showCaptions, setShowCaptions] = useState(true);
  const [captionIndex, setCaptionIndex] = useState(0);

  // Panel cạnh bên (Participants / Chat / P2P Info)
  const [activeSidePanel, setActiveSidePanel] = useState(null); // 'participants' | 'chat' | 'p2p' | null
  const [chatMessages, setChatMessages] = useState(meetingRoomData.initialChat);
  const [inputChat, setInputChat] = useState('');

  // Trạng thái Kết thúc họp & Xử lý AI
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiStep, setAiStep] = useState(1); // 1: Export WAV -> 2: Whisper STT -> 3: Gemini LLM -> Finish

  // Tham chiếu Web Video Stream thực tế nếu trình duyệt cho phép
  const userVideoRef = useRef(null);

  // Đồng hồ đếm thời gian
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

  // Cố gắng mở webcam thật nếu người dùng cấp quyền
  useEffect(() => {
    let stream = null;
    if (isCamOn && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Người dùng từ chối webcam hoặc không có webcam, tự động fallback về avatar
        });
    } else {
      if (userVideoRef.current?.srcObject) {
        userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        userVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCamOn]);

  // Format giây thành mm:ss
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  // Toggle các thiết bị
  const toggleMic = () => setIsMicOn((prev) => !prev);
  const toggleCam = () => setIsCamOn((prev) => !prev);
  const toggleScreenShare = () => setIsScreenSharing((prev) => !prev);
  const toggleRecording = () => setIsRecording((prev) => !prev);
  const toggleCaptions = () => setShowCaptions((prev) => !prev);

  // Toggle Side Panel
  const toggleSidePanel = (panelName) => {
    setActiveSidePanel((prev) => (prev === panelName ? null : panelName));
  };

  // Gửi tin nhắn chat
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputChat.trim()) return;

    const newMsg = {
      id: `c-${Date.now()}`,
      sender: 'Bạn (Trần Thị Thảo Nhi)',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: inputChat.trim(),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputChat('');
  };

  // Quy trình Kết thúc cuộc họp & Xử lý AI
  const handleEndMeeting = () => {
    setIsProcessingAI(true);
    setAiStep(1);

    // Bước 1: Thu âm MediaRecorder -> Xuất WAV (1.2s)
    setTimeout(() => {
      setAiStep(2); // Bước 2: OpenAI Whisper tiếng Việt (1.5s)
      setTimeout(() => {
        setAiStep(3); // Bước 3: Google Gemini LLM Tóm tắt & Action Items (1.5s)
        setTimeout(() => {
          setIsProcessingAI(false);
          if (onMeetingFinished) {
            onMeetingFinished(roomId);
          }
        }, 1500);
      }, 1500);
    }, 1200);
  };

  return {
    roomTitle,
    roomId,
    networkInfo,
    participants,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isRecording,
    formattedTime,
    showCaptions,
    currentCaption: meetingRoomData.sampleCaptions[captionIndex],
    activeSidePanel,
    chatMessages,
    inputChat,
    setInputChat,
    isProcessingAI,
    aiStep,
    userVideoRef,
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

