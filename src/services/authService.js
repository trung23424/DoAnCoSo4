import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Dịch vụ Xác thực người dùng bằng Firebase Authentication & Cloud Firestore
 */

// Chuyển mã lỗi Firebase Auth sang tiếng Việt thân thiện
export const mapAuthErrorToVietnamese = (errorCode, rawMessage = '') => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký tài khoản trên Firebase! Bạn vui lòng bấm "Đăng nhập ngay" ở bên dưới.';
    case 'auth/invalid-email':
      return 'Địa chỉ email không đúng định dạng!';
    case 'auth/operation-not-allowed':
      return 'Đăng nhập bằng Email/Password chưa được kích hoạt trên Firebase Console!';
    case 'auth/weak-password':
      return 'Mật khẩu quá ngắn, vui lòng nhập tối thiểu 6 ký tự!';
    case 'auth/user-disabled':
      return 'Tài khoản này đã bị vô hiệu hóa!';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác!';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau vài phút!';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng đến Firebase. Vui lòng kiểm tra lại đường truyền!';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'API Key của Firebase không hợp lệ. Vui lòng kiểm tra lại API Key trong Project Settings!';
    case 'auth/configuration-not-found':
      return 'Chưa tìm thấy cấu hình Authentication trên Firebase. Vui lòng kiểm tra lại xem dịch vụ đã được tạo chưa!';
    default:
      return `Lỗi xác thực [${errorCode || 'Unknown'}]: ${rawMessage || 'Vui lòng kiểm tra lại console trình duyệt!'}`;
  }
};

/**
 * Đăng ký tài khoản mới bằng Email và Mật khẩu
 */
export const registerWithEmail = async ({
  email,
  password,
  fullName,
  studentId = '',
  faculty = 'Khoa Khoa học Máy tính',
}) => {
  try {
    // 1. Tạo tài khoản trong Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const user = userCredential.user;

    // 2. Cập nhật Display Name
    try {
      await updateProfile(user, {
        displayName: fullName.trim(),
      });
    } catch (profErr) {
      console.warn('Lỗi updateProfile:', profErr);
    }

    // 3. Tạo hồ sơ người dùng
    const nameInitials = fullName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const userData = {
      id: user.uid,
      name: fullName.trim(),
      email: user.email.toLowerCase(),
      studentId: studentId.trim() || `VKU-${user.uid.slice(0, 5).toUpperCase()}`,
      faculty: faculty,
      role: email.toLowerCase().includes('admin') ? 'Admin' : 'Member',
      status: 'Active',
      meetingsCreated: 0,
      avatar: nameInitials || 'SV',
      plan: 'Pro Workspace',
      createdAt: new Date().toISOString(),
    };

    // 4. Lưu hồ sơ vào Cloud Firestore chạy ngầm (KHÔNG await để tránh treo nếu chưa tạo Database)
    try {
      setDoc(doc(db, 'users', user.uid), userData).catch((err) => {
        console.warn('Lưu Firestore ngầm (bỏ qua nếu chưa bật Firestore Database):', err);
      });
    } catch (firestoreErr) {
      console.warn('Bỏ qua Firestore write:', firestoreErr);
    }

    // Trả về dữ liệu thành công ngay lập tức!
    return userData;
  } catch (err) {
    console.error('Firebase Register Error:', err);
    throw new Error(mapAuthErrorToVietnamese(err.code, err.message));
  }
};

/**
 * Đăng nhập bằng Email và Mật khẩu
 */
export const loginWithEmail = async (email, password) => {
  try {
    // 1. Đăng nhập qua Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const user = userCredential.user;

    // 2. Thử đọc hồ sơ từ Cloud Firestore với timeout an toàn 1.2s (không bị treo nếu chưa bật Firestore)
    try {
      const getDocPromise = getDoc(doc(db, 'users', user.uid));
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1200));
      const userSnap = await Promise.race([getDocPromise, timeoutPromise]);

      if (userSnap && userSnap.exists()) {
        const profile = userSnap.data();

        // Kiểm tra xem tài khoản có bị admin khóa không
        if (profile.status === 'Inactive') {
          await signOut(auth);
          throw new Error('Tài khoản của bạn đã bị khóa bởi Quản trị viên!');
        }

        return profile;
      }
    } catch (firestoreErr) {
      console.warn('Không đọc được Firestore profile:', firestoreErr);
    }

    // Dự phòng thông tin người dùng từ Firebase Auth
    const name = user.displayName || user.email.split('@')[0];
    return {
      id: user.uid,
      name: name,
      email: user.email,
      studentId: `VKU-${user.uid.slice(0, 5).toUpperCase()}`,
      faculty: 'Khoa Khoa học Máy tính',
      role: user.email.toLowerCase().includes('admin') ? 'Admin' : 'Member',
      status: 'Active',
      meetingsCreated: 0,
      avatar: name.slice(0, 2).toUpperCase(),
      plan: 'Pro Workspace',
    };
  } catch (err) {
    console.error('Firebase Login Error:', err);
    if (err.message && err.message.includes('khóa bởi Quản trị viên')) {
      throw err;
    }
    throw new Error(mapAuthErrorToVietnamese(err.code, err.message));
  }
};

/**
 * Đăng xuất tài khoản
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Lắng nghe trạng thái đăng nhập thời gian thực
 */
export const subscribeAuth = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    // Đọc hồ sơ chi tiết từ Cloud Firestore (với timeout an toàn)
    try {
      const getDocPromise = getDoc(doc(db, 'users', firebaseUser.uid));
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
      const userSnap = await Promise.race([getDocPromise, timeoutPromise]);

      if (userSnap && userSnap.exists()) {
        const profile = userSnap.data();
        callback({
          ...profile,
          fullName: profile.name || profile.fullName,
        });
        return;
      }
    } catch (e) {
      console.warn('Lỗi đọc Firestore profile trong subscribeAuth:', e);
    }

    const name = firebaseUser.displayName || firebaseUser.email.split('@')[0];
    callback({
      id: firebaseUser.uid,
      name: name,
      fullName: name,
      email: firebaseUser.email,
      studentId: `VKU-${firebaseUser.uid.slice(0, 5).toUpperCase()}`,
      role: firebaseUser.email.toLowerCase().includes('admin') ? 'Admin' : 'Member',
      avatar: name.slice(0, 2).toUpperCase(),
      plan: 'Pro Workspace',
    });
  });
};
