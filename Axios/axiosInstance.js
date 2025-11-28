import axios from 'axios';

// إعداد axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // تحديد العنوان الأساسي
  timeout: 10000, // تعيين مهلة للطلبات
  headers: {
    'Content-Type': 'application/json',
  },
});

// يمكنك إضافة إعدادات أخرى إذا لزم الأمر

export default axiosInstance;
