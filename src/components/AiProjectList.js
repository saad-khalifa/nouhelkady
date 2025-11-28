import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaRobot, FaEye, FaSpinner } from 'react-icons/fa';

// استيراد ملفات CSS الخاصة بـ Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import axiosInstance from '../Axios/axiosInstance';
import '../styles/AiProjectList.css';

const AiProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // المسار الأساسي للصور - استخدم الدومين الحقيقي
  const STORAGE_BASE_URL = process.env.REACT_APP_STORAGE_URL || 'https://nouhelkady.nouhelkady.com/storage';

  // دالة لبناء مسار الصورة
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg';
    
    let cleanPath = imagePath;
    
    // إزالة storage/ من البداية إذا وجدت
    if (cleanPath.startsWith('storage/')) {
      cleanPath = cleanPath.substring(8);
    } else if (cleanPath.startsWith('/storage/')) {
      cleanPath = cleanPath.substring(9);
    }
    
    return `${STORAGE_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching AI projects from:', axiosInstance.defaults.baseURL);
        const response = await axiosInstance.get('/ai-projects');
        console.log('AI Projects data:', response.data);
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching AI projects:', err);
        setError('حدث خطأ أثناء جلب المشاريع');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
        <p>جاري تحميل المشاريع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="ai-project-list">
      <div className="header-section">
        <FaRobot className="header-icon" />
        <h1 className="main-title">مشاريع الذكاء الاصطناعي</h1>
        <p className="subtitle">اكتشف أحدث مشاريعنا في مجال الذكاء الاصطناعي</p>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ 
          delay: 3500, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        speed={800}
        loop={projects.length > 3} // Loop فقط إذا كان هناك أكثر من 3 مشاريع
        grabCursor={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        className="projects-swiper"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="project-card">
              <img 
                src={getImageUrl(project.main_image)}
                alt={project.title}
                className="card-image"
                onLoad={(e) => {
                  console.log('Image loaded:', e.target.src);
                }}
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="card-content">
                <h3 style={{ color: 'white' }} className="card-title">{project.title}</h3>
                <Link to={`/ai-projects/${project.id}`} className="view-details-btn">
                  <FaEye className="eye-icon" />
                  <span>عرض التفاصيل</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* رسالة عند عدم وجود مشاريع */}
      {projects.length === 0 && (
        <div className="empty-state">
          <FaRobot size={64} style={{ color: '#ccc' }} />
          <h3>لا توجد مشاريع حالياً</h3>
          <p>سيتم إضافة المشاريع قريباً</p>
        </div>
      )}
    </div>
  );
};

export default AiProjectList;