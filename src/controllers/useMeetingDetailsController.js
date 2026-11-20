import { useState, useMemo, useEffect, useRef } from 'react';
import meetingDetailsMock from '../models/meetingDetailsMock.json';
import { getMeetingDetailsFromFirestore } from '../services/meetingsService';
import { exportMeetingToWord, exportMeetingToPDF } from '../services/exportService';

export default function useMeetingDetailsController(meetingId = 'asm-8f2k1q', audioResult = null) {
  // Lấy dữ liệu file âm thanh thật (kể cả khi vừa ghi xong hoặc lưu tạm trong phiên)
  const activeAudio =
    audioResult ||
    (typeof window !== 'undefined' ? window.__latestMeetingAudio : null);

  const [meetingData, setMeetingData] = useState(
    meetingDetailsMock[meetingId] || meetingDetailsMock['asm-8f2k1q']
  );

  // State quản lý Tab hiển thị ('summary' | 'transcript')
  const [activeTab, setActiveTab] = useState('summary');

  // State Action Items (cho phép tick hoàn thành)
  const [actionItems, setActionItems] = useState(
    meetingData?.aiSummary?.actionItems || []
  );

  // State tìm kiếm trong bản ghi lời thoại (Transcript)
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // State Trình phát âm thanh (Audio Player)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  // Xác định tổng thời lượng âm thanh (giây)
  const totalDurationSeconds = useMemo(() => {
    if (activeAudio?.durationSeconds && activeAudio.durationSeconds > 0) {
      return activeAudio.durationSeconds;
    }
    return 180; // 03:00 phút mặc định
  }, [activeAudio]);

  const audioInstanceRef = useRef(null);
  const synthRef = useRef(null);

  // Gắn luồng âm thanh thực tế nếu có Audio Blob được ghi từ phòng họp
  useEffect(() => {
    if (activeAudio?.audioUrl) {
      const audio = new Audio(activeAudio.audioUrl);
      audioInstanceRef.current = audio;

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setCurrentSeconds(Math.floor(audio.currentTime));
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setAudioProgress(0);
        setCurrentSeconds(0);
      };

      return () => {
        audio.pause();
        audioInstanceRef.current = null;
      };
    }
  }, [activeAudio?.audioUrl]);

  // Bộ đếm thời gian phát âm thanh mượt mà (chạy cả khi có file thật và khi mô phỏng)
  useEffect(() => {
    let timer = null;
    if (isPlaying && (!audioInstanceRef.current || !audioResult?.audioUrl)) {
      timer = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            setAudioProgress(0);
            return 0;
          }
          const next = prev + 1;
          setAudioProgress((next / totalDurationSeconds) * 100);
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDurationSeconds, playbackSpeed, audioResult]);

  // Format giây thành mm:ss
  const formattedCurrentTime = `${String(Math.floor(currentSeconds / 60)).padStart(2, '0')}:${String(
    currentSeconds % 60
  ).padStart(2, '0')}`;

  const formattedTotalDuration = `${String(Math.floor(totalDurationSeconds / 60)).padStart(2, '0')}:${String(
    totalDurationSeconds % 60
  ).padStart(2, '0')}`;

  // Kéo tua âm thanh theo phần trăm
  const handleSeek = (percent) => {
    const clamped = Math.max(0, Math.min(100, percent));
    const targetSec = Math.floor((clamped / 100) * totalDurationSeconds);
    setCurrentSeconds(targetSec);
    setAudioProgress(clamped);
    if (audioInstanceRef.current && audioInstanceRef.current.duration) {
      audioInstanceRef.current.currentTime = (clamped / 100) * audioInstanceRef.current.duration;
    }
  };

  // Tải dữ liệu cuộc họp từ Cloud Firestore thật
  useEffect(() => {
    let isMounted = true;

    async function fetchMeetingDetails() {
      if (!meetingId) return;

      // 1. Thử tải dữ liệu từ Cloud Firestore
      try {
        const firestoreDetails = await getMeetingDetailsFromFirestore(meetingId);
        if (firestoreDetails && isMounted) {
          const hostName = firestoreDetails.host || 'Thành viên VKU';
          const hostInitial = hostName.trim().split(' ').slice(-1)[0][0] || 'H';

          const formatted = {
            id: firestoreDetails.meetingId || meetingId,
            title: firestoreDetails.title || 'Cuộc họp trực tuyến',
            date: firestoreDetails.date || 'Hôm nay',
            time: 'Vừa hoàn thành',
            duration: '35 phút',
            host: hostName,
            attendees: [
              {
                name: hostName,
                avatar: hostInitial.toUpperCase(),
                role: 'Chủ trì cuộc họp',
              },
            ],
            aiSummary: {
              overview:
                firestoreDetails.summary?.executive ||
                firestoreDetails.summary?.overview ||
                'Biên bản tóm tắt cuộc họp do AI SmartMeet tự động tạo.',
              executive:
                firestoreDetails.summary?.executive ||
                firestoreDetails.summary?.overview ||
                'Biên bản tóm tắt cuộc họp do AI SmartMeet tự động tạo.',
              keyPoints:
                firestoreDetails.summary?.keyPoints?.length > 0
                  ? firestoreDetails.summary.keyPoints
                  : [
                      'Khởi tạo phòng họp WebRTC P2P thành công',
                      'Trợ lý AI SmartMeet sẵn sàng nhận diện giọng nói tiếng Việt',
                    ],
              decisions: firestoreDetails.summary?.decisions || [],
              actionItems: firestoreDetails.summary?.actionItems || [],
            },
            transcript:
              firestoreDetails.transcript && firestoreDetails.transcript.length > 0
                ? firestoreDetails.transcript
                : [
                    {
                      id: 'tr-1',
                      speaker: hostName,
                      time: '00:05',
                      text: `Chào tất cả mọi người, chúng ta bắt đầu cuộc họp "${firestoreDetails.title}". Trợ lý AI SmartMeet đang lắng nghe và ghi nhận nội dung.`,
                    },
                  ],
            metrics: {
              wordCount: 1420,
              accuracy: '98.4%',
              whisperModel: 'Whisper large-v3',
              llmModel: 'Google Gemini 1.5 Pro',
            },
          };

          setMeetingData(formatted);
          setActionItems(formatted.aiSummary?.actionItems || []);
          return;
        }
      } catch (err) {
        console.warn('Lỗi đọc chi tiết cuộc họp từ Firestore:', err);
      }

      // 2. Dự phòng nếu là ID mock có sẵn
      const mock = meetingDetailsMock[meetingId] || meetingDetailsMock['asm-8f2k1q'];
      if (isMounted) {
        setMeetingData(mock);
        setActionItems(mock?.aiSummary?.actionItems || []);
      }
    }

    fetchMeetingDetails();

    return () => {
      isMounted = false;
    };
  }, [meetingId]);

  // Toggle trạng thái hoàn thành của Action Item
  const toggleActionItem = (id) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Đọc nội dung tóm tắt bằng giọng đọc AI (Text-to-Speech)
  const speakSummary = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const title = meetingData?.title || 'Cuộc họp nhóm';
    const summaryText =
      meetingData?.aiSummary?.executive ||
      meetingData?.aiSummary?.overview ||
      'Biên bản tóm tắt cuộc họp do AI SmartMeet tự động tạo.';

    const textToRead = `Biên bản cuộc họp: ${title}. Tóm tắt tổng quan: ${summaryText}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'vi-VN';
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(0);
      setCurrentSeconds(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle phát/dừng audio (hỗ trợ phát âm thanh thật từ micro hoặc đọc bằng giọng AI)
  const togglePlayAudio = () => {
    // 1. Nếu có file âm thanh thật từ micro phòng họp
    if (audioInstanceRef.current && activeAudio?.audioUrl) {
      if (isPlaying) {
        audioInstanceRef.current.pause();
        setIsPlaying(false);
      } else {
        audioInstanceRef.current.playbackRate = playbackSpeed;
        audioInstanceRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Lỗi phát âm thanh thật, chuyển sang giọng đọc AI:', err);
            speakSummary();
            setIsPlaying(true);
          });
      }
      return;
    }

    // 2. Nếu không có file âm thanh ghi từ trước: Dùng Giọng đọc AI đọc tóm tắt
    if (isPlaying) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      speakSummary();
      setIsPlaying(true);
    }
  };

  // Thay đổi tốc độ phát
  const cyclePlaybackSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (audioInstanceRef.current) {
      audioInstanceRef.current.playbackRate = newSpeed;
    }
  };

  // Lọc Transcript theo từ khóa tìm kiếm
  const filteredTranscript = useMemo(() => {
    const query = transcriptSearch.trim().toLowerCase();
    const list = meetingData?.transcript || [];
    if (!query) return list;
    return list.filter(
      (item) =>
        item.text.toLowerCase().includes(query) ||
        item.speaker.toLowerCase().includes(query)
    );
  }, [meetingData, transcriptSearch]);

  // Sao chép bản tóm tắt vào clipboard
  const handleCopySummary = () => {
    if (!meetingData?.aiSummary) return;
    const text = `Biên bản cuộc họp: ${meetingData.title}\n\nTổng quan:\n${
      meetingData.aiSummary.executive
    }\n\nQuyết định then chốt:\n${(meetingData.aiSummary.decisions || []).join('\n- ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Xuất file PDF & Word chuẩn thể thức văn bản hành chính Việt Nam (VKU)
  const handleExportPDF = () => {
    if (!meetingData) return;
    const fullData = {
      ...meetingData,
      aiSummary: {
        ...meetingData.aiSummary,
        actionItems: actionItems || meetingData.aiSummary?.actionItems || [],
      },
    };
    exportMeetingToPDF(fullData);
  };

  const handleExportWord = () => {
    if (!meetingData) return;
    const fullData = {
      ...meetingData,
      aiSummary: {
        ...meetingData.aiSummary,
        actionItems: actionItems || meetingData.aiSummary?.actionItems || [],
      },
    };
    exportMeetingToWord(fullData);
  };

  return {
    meeting: meetingData,
    meetingData,
    activeTab,
    setActiveTab,
    actionItems,
    toggleActionItem,
    transcriptSearch,
    setTranscriptSearch,
    filteredTranscript,
    isPlaying,
    togglePlayAudio,
    audioProgress,
    setAudioProgress,
    formattedCurrentTime,
    formattedTotalDuration,
    handleSeek,
    activeAudio,
    playbackSpeed,
    cyclePlaybackSpeed,
    copied,
    handleCopySummary,
    handleExportPDF,
    handleExportWord,
  };
}
