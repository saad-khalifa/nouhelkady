import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Cpu, Eye, Clock, ArrowRight, Sparkles } from 'lucide-react';
import '../styles/AiProjectCards.css';
import Footer from './Footer';

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
    const handleFixedWhatsAppClick = () => {
    const phoneNumber = '+201140278609';
    const message = 'مرحباً، أريد التواصل معكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
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
        {/* أيقونة واتساب الثابتة */}
      <div className="fixed-whatsapp-button" onClick={handleFixedWhatsAppClick}>
        <div className="whatsapp-icon-wrapper">
          <svg 
            viewBox="0 0 32 32" 
            className="whatsapp-icon"
            fill="currentColor"
          >
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.25 1.408 1.417-5.253-0.315-0.517c-1.332-2.197-2.042-4.738-2.042-7.363 0-7.51 6.11-13.62 13.62-13.62s13.62 6.11 13.62 13.62c0 7.51-6.11 13.62-13.62 13.62z"/>
            <path d="M23.022 19.48c-0.337-0.169-1.997-0.986-2.307-1.099-0.31-0.112-0.535-0.169-0.76 0.169s-0.874 1.099-1.072 1.325c-0.198 0.225-0.395 0.253-0.732 0.084s-1.429-0.527-2.721-1.679c-1.006-0.897-1.685-2.005-1.883-2.342s-0.021-0.519 0.148-0.687c0.152-0.151 0.337-0.395 0.506-0.593s0.225-0.337 0.337-0.562c0.112-0.225 0.056-0.422-0.028-0.591s-0.76-1.833-1.042-2.509c-0.274-0.659-0.553-0.57-0.76-0.58-0.197-0.01-0.422-0.012-0.647-0.012s-0.591 0.084-0.901 0.422c-0.31 0.337-1.183 1.157-1.183 2.821s1.211 3.272 1.379 3.497c0.169 0.225 2.347 3.583 5.682 5.023 0.794 0.343 1.414 0.548 1.897 0.701 0.798 0.254 1.523 0.218 2.097 0.132 0.64-0.096 1.973-0.807 2.253-1.586s0.281-1.446 0.197-1.586c-0.084-0.14-0.31-0.225-0.647-0.394z"/>
          </svg>
        </div>
        <div className="whatsapp-pulse"></div>
        <div className="whatsapp-pulse whatsapp-pulse-2"></div>
      </div>
      <Footer/>
    </div>
  );
};

export default AiProjectCards;