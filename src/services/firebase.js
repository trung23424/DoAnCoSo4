import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Cấu hình Firebase cho dự án AI SmartMeet (VKU)
const firebaseConfig = {
  apiKey: "AIzaSyDmGuR7vEZAblpwaydDlxE4wWd5_J___oc",
  authDomain: "ai-smartmeet.firebaseapp.com",
  projectId: "ai-smartmeet",
  storageBucket: "ai-smartmeet.firebasestorage.app",
  messagingSenderId: "139588397884",
  appId: "1:139588397884:web:ef125e663028ec13cf4c39",
  measurementId: "G-0TJ05LGREL"
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Cấu hình prompt chọn tài khoản cho Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
