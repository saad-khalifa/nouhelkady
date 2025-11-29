import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Mail, Send, User, MessageSquare, Phone, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import '../styles/ContactUs.css';
import Footer from './Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nouhelkady.nouhelkady.com/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/send-contact`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      setShowAlert(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.code === 'ECONNABORTED') {
        alert('انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      } else if (error.response) {
        alert(error.response.data.message || 'حدث خطأ في الخادم');
      } else if (error.request) {
        alert('لا يمكن الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
      } else {
        alert('حدث خطأ غير متوقع');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'nouhelkady5555@nouhelkady.com',
      color: 'info-blue'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: '201140278609+',
      color: 'info-purple'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'السبت - الخميس: 9 صباحاً - 6 مساءً',
      color: 'info-pink'
    }
  ];
    const handleFixedWhatsAppClick = () => {
    const phoneNumber = '+201140278609';
    const message = 'مرحباً، أريد التواصل معكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="blur-circle blur-circle-1"></div>
          <div className="blur-circle blur-circle-2"></div>
        </div>
        
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <MessageSquare className="badge-icon" />
              <span>دعنا نتحدث</span>
            </div>
            <h1 className="hero-title">تواصل معنا</h1>
            <p className="hero-subtitle">
              نحن هنا لتحويل أفكارك إلى واقع مذهل. تواصل معنا وشاركنا رؤيتك
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <Container>
          <Row className="g-4">
            {/* Contact Info */}
            <Col lg={5}>
              <div className="contact-info-wrapper">
                <div className="section-header">
                  <h2 className="section-title">معلومات التواصل</h2>
                  <p className="section-subtitle">
                    يسعدنا التواصل معك والإجابة على جميع استفساراتك
                  </p>
                </div>

                <div className="contact-info-cards">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div 
                        key={index} 
                        className={`contact-info-card ${info.color}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="info-icon-wrapper">
                          <IconComponent className="info-icon" />
                        </div>
                        <div className="info-content">
                          <h4 className="info-title">{info.title}</h4>
                          <p className="info-value">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Features */}
                <div className="features-list">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>رد سريع خلال 24 ساعة</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>استشارة مجانية للمشاريع</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>دعم فني متواصل</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Contact Form */}
            <Col lg={7}>
              <div className="contact-form-wrapper">
                {showAlert && (
                  <div className="success-alert">
                    <CheckCircle className="success-icon" />
                    <div className="success-content">
                      <h4>تم إرسال رسالتك بنجاح!</h4>
                      <p>سنتواصل معك في أقرب وقت ممكن</p>
                    </div>
                  </div>
                )}

                <Form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-header">
                    <h3 className="form-title">أرسل لنا رسالة</h3>
                    <p className="form-subtitle">املأ النموذج وسنعود إليك قريباً</p>
                  </div>

                  <Form.Group className="form-group" controlId="formName">
                    <Form.Label className="form-label">
                      <User className="label-icon" />
                      الاسم الكامل
                    </Form.Label>
                    <div className="input-wrapper">
                      <Form.Control
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={isSubmitting}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formEmail">
                    <Form.Label className="form-label">
                      <Mail className="label-icon" />
                      البريد الإلكتروني
                    </Form.Label>
                    <div className="input-wrapper">
                      <Form.Control
                        type="email"
                        placeholder="example@email.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={isSubmitting}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-group" controlId="formMessage">
                    <Form.Label className="form-label">
                      <MessageSquare className="label-icon" />
                      رسالتك
                    </Form.Label>
                    <div className="input-wrapper">
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="اكتب رسالتك هنا... أخبرنا عن مشروعك أو استفسارك"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="form-textarea"
                        disabled={isSubmitting}
                      />
                    </div>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span >
                        <div style={{ backgroundColor:' rgb(9,15,40)' }} className="spinner-border spinner-border-sm me-2" role="status">
                          <span  className="visually-hidden">جاري الإرسال...</span>
                        </div>
                        جاري الإرسال...
                      </span>
                    ) : (
                      <>
                        <span className="button-text">إرسال الرسالة</span>
                        <Send className="button-icon" />
                      </>
                    )}
                    <div className="button-overlay"></div>
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
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

export default ContactUs;