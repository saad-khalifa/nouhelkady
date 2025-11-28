import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Mail, Send, User, MessageSquare, Phone, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import '../styles/ContactUs.css';

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
      value: 'nouhelkady5555@hotmail.com',
      color: 'info-blue'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: '+201140278609',
      color: 'info-purple'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'السبت - الخميس: 9 صباحاً - 6 مساءً',
      color: 'info-pink'
    }
  ];

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
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">جاري الإرسال...</span>
                        </div>
                        جاري الإرسال...
                      </>
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
    </div>
  );
};

export default ContactUs;