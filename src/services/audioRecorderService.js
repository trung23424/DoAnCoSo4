/**
 * Dịch vụ Quản lý & Trộn âm thanh cuộc họp (Audio Recorder & Mixer Service)
 * Đồ án Cơ sở 4 - AI SmartMeet (VKU)
 * 
 * Tính năng chính:
 * 1. Sử dụng Web Audio API (AudioContext) để trộn (Mix) đa kênh:
 *    - Kênh Microphone của bản thân (Local Audio Stream)
 *    - Kênh Giọng nói của đối tác P2P (Remote Audio Stream)
 * 2. Hỗ trợ gắn thêm luồng đối tác động (addRemoteStream) khi đối tác vào sau.
 * 3. Thu âm định dạng WebM / Opus chất lượng cao, tối ưu cho Whisper STT & Gemini AI.
 * 4. Xuất Audio Blob và Audio URL phục vụ nghe lại hoặc đẩy lên Cloud Storage.
 */

export class MeetingAudioRecorder {
  constructor() {
    this.audioContext = null;
    this.destination = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.localSource = null;
    this.remoteSource = null;
    this.startTime = null;
    this.isRecording = false;
    this.isPaused = false;
  }

  /**
   * Xác định định dạng âm thanh tốt nhất mà trình duyệt hỗ trợ
   */
  static getSupportedMimeType() {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }

  /**
   * Bắt đầu phiên thu âm cuộc họp
   * @param {Object} params - { localStream, remoteStream, onDataChunk }
   */
  start({ localStream, remoteStream = null, onDataChunk = null }) {
    try {
      // 1. Khởi tạo AudioContext
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) {
        throw new Error('Trình duyệt không hỗ trợ Web Audio API.');
      }

      this.audioContext = new AudioCtxClass();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // 2. Tạo Node Đích (Destination) để gom tất cả các luồng âm thanh
      this.destination = this.audioContext.createMediaStreamDestination();

      // 3. Kết nối luồng Micro của chính mình (nếu có Audio Track)
      if (localStream && localStream.getAudioTracks().length > 0) {
        this.localSource = this.audioContext.createMediaStreamSource(localStream);
        this.localSource.connect(this.destination);
      }

      // 4. Kết nối luồng Âm thanh của đối tác P2P (nếu đã vào phòng)
      if (remoteStream && remoteStream.getAudioTracks().length > 0) {
        this.remoteSource = this.audioContext.createMediaStreamSource(remoteStream);
        this.remoteSource.connect(this.destination);
      }

      // 5. Khởi tạo MediaRecorder từ luồng hỗn hợp (Mixed Stream)
      const mimeType = MeetingAudioRecorder.getSupportedMimeType();
      const recorderOptions = mimeType ? { mimeType } : {};

      this.mediaRecorder = new MediaRecorder(this.destination.stream, recorderOptions);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
          if (onDataChunk) {
            onDataChunk(event.data);
          }
        }
      };

      // Bắt đầu thu âm và cắt chunk mỗi 1000ms (1 giây)
      this.mediaRecorder.start(1000);
      this.startTime = Date.now();
      this.isRecording = true;
      this.isPaused = false;

      console.log(`[AudioRecorder] Bắt đầu thu âm cuộc họp (MIME: ${mimeType || 'default'})`);
      return true;
    } catch (err) {
      console.error('[AudioRecorder] Lỗi khởi động bộ thu âm:', err);
      this.cleanup();
      throw err;
    }
  }

  /**
   * Thêm luồng âm thanh của đối tác khi họ vừa vào phòng (trộn vào phiên thu âm đang chạy)
   * @param {MediaStream} remoteStream
   */
  addRemoteStream(remoteStream) {
    if (!this.audioContext || !this.destination || !remoteStream) return;
    if (remoteStream.getAudioTracks().length === 0) return;

    try {
      if (this.remoteSource) {
        this.remoteSource.disconnect();
      }
      this.remoteSource = this.audioContext.createMediaStreamSource(remoteStream);
      this.remoteSource.connect(this.destination);
      console.log('[AudioRecorder] Đã kết nối âm thanh đối tác vào luồng thu âm.');
    } catch (err) {
      console.warn('[AudioRecorder] Không thể thêm luồng đối tác vào bộ trộn:', err);
    }
  }

  /**
   * Tạm dừng ghi âm
   */
  pause() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isPaused = true;
      console.log('[AudioRecorder] Đã tạm dừng thu âm.');
    }
  }

  /**
   * Tiếp tục ghi âm
   */
  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isPaused = false;
      console.log('[AudioRecorder] Đã tiếp tục thu âm.');
    }
  }

  /**
   * Dừng thu âm và xuất ra file Blob + URL
   * @returns {Promise<{ blob: Blob, audioUrl: string, durationSeconds: number, mimeType: string }>}
   */
  stop() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        const emptyBlob = new Blob([], { type: 'audio/webm' });
        resolve({
          blob: emptyBlob,
          audioUrl: '',
          durationSeconds: 0,
          mimeType: 'audio/webm',
        });
        this.cleanup();
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const finalBlob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(finalBlob);
        const durationSeconds = this.startTime
          ? Math.round((Date.now() - this.startTime) / 1000)
          : 0;

        console.log(`[AudioRecorder] Kết thúc thu âm (${durationSeconds}s, ${(finalBlob.size / 1024).toFixed(1)} KB)`);

        this.cleanup();
        resolve({
          blob: finalBlob,
          audioUrl,
          durationSeconds,
          mimeType,
          sizeBytes: finalBlob.size,
        });
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('[AudioRecorder] Lỗi khi gọi stop():', e);
        this.cleanup();
        resolve({
          blob: new Blob(this.audioChunks, { type: 'audio/webm' }),
          audioUrl: '',
          durationSeconds: 0,
          mimeType: 'audio/webm',
        });
      }
    });
  }

  /**
   * Giải phóng tài nguyên và đóng AudioContext
   */
  cleanup() {
    this.isRecording = false;
    this.isPaused = false;

    if (this.localSource) {
      try {
        this.localSource.disconnect();
      } catch (e) {}
      this.localSource = null;
    }

    if (this.remoteSource) {
      try {
        this.remoteSource.disconnect();
      } catch (e) {}
      this.remoteSource = null;
    }

    if (this.destination) {
      try {
        this.destination.disconnect();
      } catch (e) {}
      this.destination = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }
}

// Khởi tạo instance tiện ích dùng chung
export const meetingRecorder = new MeetingAudioRecorder();
export default meetingRecorder;
