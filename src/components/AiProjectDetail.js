import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/AiProjectDetail.css';

const AiProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/ai-projects/${id}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل المشروع.");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
        <p>جاري تحميل المشروع...</p>
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
    <div className="project-detail">
      {/* زر الرجوع */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowRight />
        <span>رجوع</span>
      </button>

      {/* القسم الرئيسي */}
      <div className="main-content">
        {/* القسم الأيمن - العنوان والوصف */}
        <div className="info-section">
          <h1 className="project-title">{project.title}</h1>
          <div className="divider"></div>
          <p style={{ height:'500px' }} className="project-description">{project.description}</p>
        </div>

        {/* القسم الأيسر - الفيديو */}
        <div className="video-section">
          {project.video_url ? (
            <div className="video-wrapper">
              {project.video_url.includes('drive.google.com') ? (
                <iframe
                  src={`https://drive.google.com/file/d/${project.video_url.split('/d/')[1].split('/')[0]}/preview`}
                  allow="autoplay"
                  className="video-iframe"
                  title="Google Drive Video"
                ></iframe>
              ) : (
                <iframe
                  src={project.video_url}
                  allow="autoplay"
                  className="video-iframe"
                  title="Video"
                ></iframe>
              )}
            </div>
          ) : (
            <div className="no-video">
              <p>لا يوجد فيديو لهذا المشروع</p>
            </div>
          )}
        </div>
      </div>

      {/* قسم الصور */}
      {project.images && project.images.length > 0 && (
        <div className="images-section">
          <h2 className="section-title">معرض الصور</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            speed={800}
            loop={project.images.length > 1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="images-swiper"
          >
            {project.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="image-card">
                  <img
                    src={image}
                    alt={`${project.title} - صورة ${index + 1}`}
                    className="project-image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default AiProjectDetail;