import { useState, useRef, useEffect } from 'react';
import defaultSettings from '../models/settingsMock.json';

export default function useSettingsController() {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'webrtc' | 'devices' | 'profile'

  // AI Settings State
  const [whisperModel, setWhisperModel] = useState(defaultSettings.ai.whisperModel);
  const [aiProvider, setAiProvider] = useState(defaultSettings.ai.aiProvider);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return (
      (typeof localStorage !== 'undefined' &&
        localStorage.getItem('ai_smartmeet_gemini_key')) ||
      defaultSettings.ai.geminiApiKey ||
      ''
    );
  });
  const [openaiApiKey, setOpenaiApiKey] = useState(() => {
    return (
      (typeof localStorage !== 'undefined' &&
        localStorage.getItem('ai_smartmeet_openai_key')) ||
      ''
    );
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(defaultSettings.ai.systemPrompt);
  const [autoRecording, setAutoRecording] = useState(defaultSettings.ai.autoRecording);

  // WebRTC Settings State
  const [stunServer, setStunServer] = useState(defaultSettings.webrtc.stunServer);
  const [turnServer, setTurnServer] = useState(defaultSettings.webrtc.turnServer);
  const [audioCodec, setAudioCodec] = useState(defaultSettings.webrtc.audioCodec);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  // Devices & Testing State
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isTestingCam, setIsTestingCam] = useState(false);
  const testVideoRef = useRef(null);

  // Profile Settings State
  const [profile, setProfile] = useState(defaultSettings.profile);
  const [savedToast, setSavedToast] = useState(false);

  // Giả lập thanh đo âm lượng khi test mic
  useEffect(() => {
    let interval = null;
    if (isTestingMic) {
      interval = setInterval(() => {
        // Sinh ngẫu nhiên âm lượng từ 30% đến 90%
        setMicLevel(Math.floor(Math.random() * 60) + 30);
      }, 150);
    } else {
      setMicLevel(0);
    }
    return () => clearInterval(interval);
  }, [isTestingMic]);

  // Cố gắng mở webcam khi người dùng bấm Test Camera
  useEffect(() => {
    let stream = null;
    if (isTestingCam && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (testVideoRef.current) {
            testVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Fallback nếu không có webcam
        });
    } else {
      if (testVideoRef.current?.srcObject) {
        testVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        testVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isTestingCam]);

  const toggleTestMic = () => setIsTestingMic((prev) => !prev);
  const toggleTestCam = () => setIsTestingCam((prev) => !prev);

  // Phát âm thanh thử nghiệm loa
  const handleTestSpeaker = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      alert('Đang phát âm thanh kiểm tra loa...');
    }
  };

  // Khôi phục Prompt mặc định
  const handleResetPrompt = () => {
    setSystemPrompt(defaultSettings.ai.systemPrompt);
  };

  // Lưu cài đặt
  const handleSaveSettings = (e) => {
    e?.preventDefault();
    if (typeof localStorage !== 'undefined') {
      if (geminiApiKey) localStorage.setItem('ai_smartmeet_gemini_key', geminiApiKey.trim());
      if (openaiApiKey) localStorage.setItem('ai_smartmeet_openai_key', openaiApiKey.trim());
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return {
    activeTab,
    setActiveTab,
    whisperModel,
    setWhisperModel,
    aiProvider,
    setAiProvider,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    showApiKey,
    setShowApiKey,
    showOpenaiKey,
    setShowOpenaiKey,
    systemPrompt,
    setSystemPrompt,
    autoRecording,
    setAutoRecording,
    stunServer,
    setStunServer,
    turnServer,
    setTurnServer,
    audioCodec,
    setAudioCodec,
    encryptionEnabled,
    setEncryptionEnabled,
    isTestingMic,
    micLevel,
    isTestingCam,
    testVideoRef,
    toggleTestMic,
    toggleTestCam,
    handleTestSpeaker,
    handleResetPrompt,
    profile,
    setProfile,
    savedToast,
    handleSaveSettings,
  };
}
