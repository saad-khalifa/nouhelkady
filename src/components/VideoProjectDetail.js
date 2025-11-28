import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { Container, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Calendar, Video } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/VideoProjectDetail.css';

const VideoProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // المسار الأساسي للصور والفيديوهات
  const STORAGE_BASE_URL = process.env.REACT_APP_STORAGE_URL || 'https://nouhelkady.nouhelkady.com/storage';

  const getStorageUrl = (path) => {
    if (!path) return '';
    let cleanPath = path;
    if (cleanPath.startsWith('storage/')) {
      cleanPath = cleanPath.substring(8);
    } else if (cleanPath.startsWith('/storage/')) {
      cleanPath = cleanPath.substring(9);
    }
    return `${STORAGE_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/video-projects/${id}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء جلب تفاصيل المشروع');
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">جاري تحميل تفاصيل المشروع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  const images = project?.images ? JSON.parse(project.images) : [];

  const isYouTubeUrl = (url) => {
    return /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);
  };

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  };

  const isGoogleDriveUrl = (url) => {
    return /drive\.google\.com/.test(url);
  };

  const renderVideo = (url) => {
    if (!url) return null;

    if (isYouTubeUrl(url)) {
      const videoId = getYouTubeId(url);
      if (videoId) {
        return (
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Project Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    if (isGoogleDriveUrl(url)) {
      const fileId = url.split('/d/')[1]?.split('/')[0];
      if (fileId) {
        return (
          <iframe
            width="100%"
            height="500"
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            title="Google Drive Video"
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          />
        );
      }
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return (
        <div className="custom-video-container">
          <video controls width="100%" height="500">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <div className="custom-video-container">
        <video controls width="100%" height="500">
          <source src={getStorageUrl(url)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <div className="video-project-detail-page">
      <Container className="video-project-detail-container">
        {project && (
          <div className="video-project-content">
            <Button 
              variant="outline-light" 
              className="back-button"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} />
              <span>العودة إلى المشاريع</span>
            </Button>

            <div className="two-column-layout">
              <div className="right-column">
                <div className="video-project-header">
                  <h1 className="video-project-title">{project.title}</h1>
                  <div className="video-project-meta">
                    <div className="meta-item">
                      <Calendar size={18} />
                      <span>{new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="meta-item">
                      <Video size={18} />
                      <span>مشروع مونتاج</span>
                    </div>
                  </div>
                </div>

                <div className="video-project-description">
                  <h3 className="section-title">
                    <span className="title-icon">📋</span>
                    وصف المشروع
                  </h3>
                  <p className="description-text">{project.description}</p>
                </div>
              </div>

              {project.url && (
                <div className="left-column">
                  <div className="video-project-video">
                    <h3 className="section-title">
                      <span className="title-icon">
                        <Video size={24} />
                      </span>
                      فيديو المشروع
                    </h3>
                    {renderVideo(project.url)}
                  </div>
                </div>
              )}
            </div>

            <div className="video-project-images">
              <h3 className="section-title">
                <span className="title-icon">
                  <ImageIcon size={24} />
                </span>
                معرض الصور
              </h3>
              
              {images.length > 0 ? (
                <div className="swiper-wrapper-custom">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ 
                      clickable: true,
                      dynamicBullets: true
                    }}
                    autoplay={{ 
                      delay: 4000, 
                      disableOnInteraction: false 
                    }}
                    loop={images.length > 1}
                    className="video-project-swiper"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="swiper-slide-content">
                          <img 
                            src={getStorageUrl(image)}
                            alt={`${project.title} - صورة ${index + 1}`}
                            className="swiper-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                            }}
                          />
                          <div className="image-caption">
                            <span>صورة {index + 1} من {images.length}</span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="no-images">
                  <ImageIcon size={48} />
                  <p>لا توجد صور لهذا المشروع</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default VideoProjectDetail;