import axios from 'axios';

// استخدام الدومين الحقيقي مباشرة (Laravel على Hostinger)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nouhelkady.nouhelkady.com/api';

console.log('API Base URL:', API_BASE_URL); // للتحقق

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 30 ثانية
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// طلب interceptor لإضافة التوكن إذا كان موجوداً
axiosInstance.interceptors.request.use(
  (config) => {
    // يمكنك إضافة التوكن هنا إذا كنت تستخدم المصادقة
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// رد interceptor لمعالجة الأخطاء
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // معالجة أخطاء الشبكة
    if (error.code === 'ERR_NETWORK') {
      console.error('خطأ في الاتصال بالخادم:', error);
      // يمكنك إظهار إشعار للمستخدم
    }
    
    // معالجة أخطاء المهلة
    if (error.code === 'ECONNABORTED') {
      console.error('انتهت مهلة الطلب:', error);
    }
    
    // معالجة أخطاء HTTP
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('غير مصرح - يرجى تسجيل الدخول');
          // يمكنك إعادة التوجيه لصفحة تسجيل الدخول
          break;
        case 403:
          console.error('ممنوع - ليس لديك صلاحية');
          break;
        case 404:
          console.error('الصفحة غير موجودة');
          break;
        case 500:
          console.error('خطأ في الخادم');
          break;
        default:
          console.error('حدث خطأ:', data?.message || error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;