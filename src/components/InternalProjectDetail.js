import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { Container, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Calendar, Eye, Video } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/InternalProjectDetail.css';

const InternalProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // المسار الأساسي للصور والفيديوهات - استخدم الدومين الحقيقي
  const STORAGE_BASE_URL = process.env.REACT_APP_STORAGE_URL || 'https://nouhelkady.nouhelkady.com/storage';

  // دالة لبناء مسار الصورة/الفيديو
  const getStorageUrl = (path) => {
    if (!path) return '';
    
    let cleanPath = path;
    
    // إزالة storage/ من البداية إذا وجدت
    if (cleanPath.startsWith('storage/')) {
      cleanPath = cleanPath.substring(8);
    } else if (cleanPath.startsWith('/storage/')) {
      cleanPath = cleanPath.substring(9);
    }
    
    return `${STORAGE_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        console.log('Fetching internal project details for ID:', id);
        const response = await axiosInstance.get(`/internal-projects/${id}`);
        console.log('Internal project details:', response.data);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internal project details:', err);
        setError('حدث خطأ أثناء جلب تفاصيل المشروع');
        setLoading(false);
      }
    };

    fetchProjectDetail();
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
        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  const images = project?.images ? JSON.parse(project.images) : [];

  // دالة لفحص الرابط إذا كان رابط YouTube
  const isYouTubeUrl = (url) => {
    return /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);
  };

  // دالة لاستخراج معرف فيديو YouTube
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  };

  // دالة لفحص الرابط إذا كان من Google Drive
  const isGoogleDriveUrl = (url) => {
    return /drive\.google\.com/.test(url);
  };

  // دالة لعرض الفيديو بناءً على الرابط
  const renderVideo = (url) => {
    if (!url) return null;

    // فحص إذا كان رابط YouTube
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

    // فحص إذا كان رابط Google Drive
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

    // فحص إذا كان رابط خارجي كامل (https://)
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

    // إذا كان مسار محلي في storage
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
    <div className="project-detail-page">
      <Container className="project-detail-container">
        {project && (
          <div className="project-content">
            {/* زر العودة */}
            <Button 
              variant="outline-light" 
              className="back-button"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} />
              <span>العودة إلى المشاريع</span>
            </Button>

            {/* تخطيط من عمودين: اليمين للعنوان والتفاصيل، الشمال للفيديو */}
            <div className="two-column-layout">
              {/* العمود الأيمن - العنوان والتفاصيل */}
              <div className="right-column">
                {/* العنوان */}
                <div className="project-header">
                  <h1 className="project-title">{project.title}</h1>
                  <div className="project-meta">
                    <div className="meta-item">
                      <Calendar size={18} />
                      <span>{new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={18} />
                      <span>مشروع ذكاء اصطناعي</span>
                    </div>
                  </div>
                </div>

                {/* التفاصيل */}
                <div className="project-description">
                  <h3 className="section-title">
                    <span className="title-icon">📋</span>
                    وصف المشروع
                  </h3>
                  <p className="description-text">{project.description}</p>
                </div>
              </div>

              {/* العمود الأيسر - الفيديو */}
              {project.url && (
                <div className="left-column">
                  <div className="project-video">
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

            {/* الصور مع Swiper */}
            <div className="project-images">
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
                    className="project-swiper"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="swiper-slide-content">
                          <img 
                            src={getStorageUrl(image)}
                            alt={`${project.title} - صورة ${index + 1}`}
                            className="swiper-image"
                            onLoad={(e) => {
                              console.log('Image loaded:', e.target.src);
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', e.target.src);
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

export default InternalProjectDetail;