import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Video, Eye, Clock, ArrowRight } from 'lucide-react';
import '../styles/VideoProjectCards.css';

const VideoProjectCards = () => {
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
        console.log('Fetching video projects from:', axiosInstance.defaults.baseURL);
        const response = await axiosInstance.get('/video-projects');
        console.log('Video Projects data:', response.data);
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video projects:', err);
        setError('حدث خطأ أثناء جلب المشاريع');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">جاري تحميل المشاريع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="video-projects-page">
      <Container className="video-projects-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-icon">
            <Video size={48} />
          </div>
          <h1 className="page-title">معرض مشاريع المونتاج والإنتاج</h1>
          <p className="page-subtitle">
            استكشف مجموعة من أعمالنا الإبداعية في مجال المونتاج والإنتاج المرئي
          </p>
        </div>

        {/* Projects Grid */}
        <Row className="projects-grid">
          {projects.map((project, index) => (
            <Col key={project.id} xs={12} sm={6} lg={4} className="project-col">
              <Card className="project-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-image-wrapper">
                  <Card.Img 
                    variant="top" 
                    src={getImageUrl(project.main_image)}
                    alt={project.title}
                    className="card-image"
                    onLoad={(e) => {
                      console.log('Video project image loaded:', e.target.src);
                    }}
                    onError={(e) => {
                      console.error('Video project image failed to load:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <Eye size={32} />
                      <span>عرض التفاصيل</span>
                    </div>
                  </div>
                  <div className="video-badge">
                    <Video size={18} />
                  </div>
                </div>
                
                <Card.Body className="card-body">
                  <Card.Title style={{ color:'#B8C5D6' }} className="card-title">
                    {project.title}
                  </Card.Title>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  <Link to={`/video-projects/${project.id}`} className="view-details-link">
                    <button className="view-details-btn">
                      <span>استكشف المشروع</span>
                      <ArrowRight size={18} className="btn-icon" />
                    </button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="empty-state">
            <Video size={64} />
            <h3>لا توجد مشاريع حالياً</h3>
            <p>سيتم إضافة المشاريع قريباً</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default VideoProjectCards;