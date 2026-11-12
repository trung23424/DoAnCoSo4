import { useState, useMemo, useEffect } from 'react';
import meetingDetailsMock from '../models/meetingDetailsMock.json';
import { getMeetingDetailsFromFirestore } from '../services/meetingsService';

export default function useMeetingDetailsController(meetingId = 'asm-8f2k1q') {
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

  // State Trình phát âm thanh (Audio Player Simulation)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(18); // 18% tiến độ mô phỏng
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copied, setCopied] = useState(false);

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
            aiSummary: firestoreDetails.summary || {
              executive: 'Đang chuẩn bị tóm tắt...',
              keyPoints: [],
              decisions: [],
              actionItems: [],
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

  // Toggle phát/dừng audio
  const togglePlayAudio = () => {
    setIsPlaying((prev) => !prev);
  };

  // Thay đổi tốc độ phát
  const cyclePlaybackSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
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

  // Xuất file PDF / Word mô phỏng
  const handleExportPDF = () => {
    alert(`Đang xuất biên bản cuộc họp "${meetingData?.title}" ra file PDF...`);
  };

  const handleExportWord = () => {
    alert(`Đang xuất biên bản cuộc họp "${meetingData?.title}" ra file Word (.docx)...`);
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
    playbackSpeed,
    cyclePlaybackSpeed,
    copied,
    handleCopySummary,
    handleExportPDF,
    handleExportWord,
  };
}
