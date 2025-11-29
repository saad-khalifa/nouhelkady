import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaProjectDiagram, FaEye, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../Axios/axiosInstance';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
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
    <div className="projects-list">
      <div className="header-section">
        <FaProjectDiagram className="header-icon" />
        <h1 className="main-title">مشاريعنا في المونتاج</h1>
        <p className="subtitle">اكتشف أحدث مشاريعنا وإنجازاتنا</p>
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
        loop={projects.length > 1}
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
                src={project.main_image} 
                alt={project.title}
                className="card-image"
                onError={(e) => {
                  // إذا فشل تحميل الصورة الرئيسية، استخدم الصورة الأولى من المعرض إذا موجودة
                  if (project.images && project.images.length > 0) {
                    e.target.src = project.images[0];
                  } else {
                    // صورة افتراضية إذا لم توجد أي صور
                    e.target.src = '/default-project-image.jpg';
                    e.target.alt = 'صورة افتراضية للمشروع';
                  }
                }}
              />
              <div className="card-content">
                <h3 className="card-title">{project.title}</h3>
          
                <div className="card-footer">
                 
                  <Link to={`/project-details/${project.id}`} className="view-details-btn">
                    <FaEye className="eye-icon" />
                    <span>عرض التفاصيل</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {projects.length === 0 && !loading && (
        <div className="no-projects">
          😔 لا توجد مشاريع حالياً
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;