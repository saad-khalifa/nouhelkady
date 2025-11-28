import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cpu, Eye, Clock, ArrowRight, Sparkles } from 'lucide-react';
import '../styles/AiProjectCards.css';

const AiProjectCards = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // المسار الأساسي للصور - استخدم الدومين الحقيقي دائماً
  // تجاهل متغير البيئة واستخدام الدومين مباشرة
  const STORAGE_BASE_URL = 'https://nouhelkady.nouhelkady.com/storage';

  // دالة لبناء مسار الصورة الصحيح
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.warn('No image path provided');
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    
    console.log('Original image path:', imagePath);
    
    // إزالة أي مسار زائد في البداية
    let cleanPath = imagePath.trim();
    
    // إزالة storage/ من البداية إذا وجدت (جميع الحالات)
    cleanPath = cleanPath.replace(/^\/storage\//, ''); // إزالة /storage/
    cleanPath = cleanPath.replace(/^storage\//, '');   // إزالة storage/
    
    // بناء المسار النهائي
    const finalUrl = `${STORAGE_BASE_URL}/${cleanPath}`;
    console.log('Final image URL:', finalUrl);
    
    // اختبار إذا كان المسار صحيح
    console.log('Testing URL:', finalUrl);
    
    return finalUrl;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects from:', axiosInstance.defaults.baseURL);
        const response = await axiosInstance.get('/internal-projects');
        
        console.log('API Response:', response);
        console.log('Projects data:', response.data);
        console.log('Number of projects:', response.data?.length || 0);
        
        // طباعة مسار أول صورة للتحقق
        if (response.data && response.data.length > 0) {
          console.log('First project:', response.data[0]);
          console.log('First image path:', response.data[0].main_image);
          console.log('Constructed URL:', getImageUrl(response.data[0].main_image));
        }
        
        setProjects(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          response: err.response
        });
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
    <div className="ai-projects-page">
      <Container className="ai-projects-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-icon">
            <Cpu size={48} />
            <div className="sparkle sparkle-1">
              <Sparkles size={20} />
            </div>
            <div className="sparkle sparkle-2">
              <Sparkles size={16} />
            </div>
          </div>
          <h1 className="page-title">مشاريع الذكاء الاصطناعي والتطوير</h1>
          <p className="page-subtitle">
            اكتشف مجموعة من مشاريعنا المبتكرة في مجال الذكاء الاصطناعي والحلول التقنية المتقدمة
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
                    alt={project.title || 'Project image'}
                    className="card-image"
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', e.target.src);
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      console.error('Project data:', project);
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
                  <div className="ai-badge">
                    <Cpu size={18} />
                    <span>AI</span>
                  </div>
                </div>
                
                <Card.Body className="card-body">
                  <Card.Title style={{ color:'#B8C5D6' }} className="card-title">
                    {project.title}
                  </Card.Title>

                  <Link to={`/internal-projects/${project.id}`} className="view-details-link">
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
            <Cpu size={64} />
            <h3>لا توجد مشاريع حالياً</h3>
            <p>سيتم إضافة المشاريع قريباً</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AiProjectCards;