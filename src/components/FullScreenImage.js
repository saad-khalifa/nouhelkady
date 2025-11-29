import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/FullScreenImage.css';

const FullScreenImage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [enteredCode, setEnteredCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [encryptedUrl, setEncryptedUrl] = useState('');

  const encryptUrl = (url) => {
    const key = 'NouhElKady2024Secret';
    const combined = key + url;
    return btoa(combined);
  };

  const decryptUrl = (encrypted) => {
    const key = 'NouhElKady2024Secret';
    const decoded = atob(encrypted);
    return decoded.replace(key, '');
  };

  const handleToolClick = () => {
    if (isAuthenticated) {
      alert('يرجى تسجيل الدخول أولاً!');
      navigate('/login');
    } else if (!user?.user_code) {
      alert('لم يتم تعيين كود لحسابك. يرجى التواصل مع الإدارة.');
    } else {
      setShowCodeInput(true);
    }
  };

  const handleCodeSubmit = () => {
    if (!enteredCode.trim()) {
      setIsCodeValid(false);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (enteredCode === user.user_code) {
        setIsCodeValid(true);
        const originalUrl = "https://ai.studio/apps/drive/1_vYNfLWpvDBZp2uKdGC6vyrrnqDTffV9";
        const encrypted = encryptUrl(originalUrl);
        setEncryptedUrl(encrypted);
        
        setTimeout(() => {
          setShowIframe(true);
        }, 500);
      } else {
        setIsCodeValid(false);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCodeSubmit();
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    setEnteredCode('');
    setIsCodeValid(null);
    setShowCodeInput(false);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '+201140278609';
    const message = 'مرحباً، أريد الاستفسار عن خدماتكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fullscreen-wrapper">
      {/* القسم الأول: الصورة بعرض كامل */}
      <section className="full-width-hero">
        <div className="hero-image-container">
          <img
            className="full-width-image"
            src="/images/neww.jpeg"
            alt="خلفية الإبداع المرئي"
            loading="eager"
          />
          <div className="hero-overlay-full"></div>
          
          {/* المحتوى فوق الصورة */}
          <div className="hero-content-overlay">
            <div className="hero-text-content">
              <h1 className="hero-main-name">Nouh Elkady</h1>
              <h2 className="hero-subtitle">Video Editor & AI Specialist</h2>
              <p className="hero-description">
                خبرة في عالم المونتاج والذكاء الاصطناعي
              </p>
              
              {/* زر التواصل على الواتساب */}
              <button 
                className="hero-whatsapp-button"
                onClick={handleWhatsAppClick}
              >
                <span className="button-text">تواصل معنا</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="image-container">
        {/* خلفية متحركة */}
        <div className="animated-background"></div>

        <div className="content-grid">
          {/* قسم النصوص */}
          <div className="text-content">
            <div className="text-inner">
              {/* العنوان الرئيسي */}
              <h1 className="main-title">
                <span className="title-line">مرحباً بك في</span>
                <span className="title-highlight">عالم الإبداع المرئي</span>
              </h1>

              {/* الوصف الرئيسي */}
              <p className="main-description">
                نحن متخصصون في إنتاج محتوى بصري استثنائي باستخدام أحدث تقنيات 
                <span className="highlight-text"> المونتاج الاحترافي </span>
                و
                <span className="highlight-text"> الذكاء الاصطناعي المتقدم</span>.
                نحوّل أفكارك إلى تجارب مرئية مبهرة تترك أثراً لا يُنسى.
              </p>

              {/* قسم الأداة */}
              <div className="tool-section">
                <h2 className="tool-title">
                  <span className="icon-spark">✨</span>
                  أداة تحويل الصور الذكية
                </h2>
                
                <p className="tool-description">
                  حوّل صور منتجاتك في ثوانٍ معدودة! أداتنا المدعومة بالذكاء الاصطناعي 
                  تمنحك القدرة على:
                </p>

                <ul className="features-list">
                  <li>
                    <span className="feature-icon">🎯</span>
                    تغيير الزوايا والتصاميم بدقة عالية
                  </li>
                  <li>
                    <span className="feature-icon">⚡</span>
                    معالجة فورية خلال ثوانٍ
                  </li>
                  <li>
                    <span className="feature-icon">🔒</span>
                    الحفاظ على جودة الصورة الأصلية
                  </li>
                  <li>
                    <span className="feature-icon">🎨</span>
                    تعديلات احترافية بدون تعقيدات
                  </li>
                </ul>

                {/* زر التجربة */}
                <button 
                  className="cta-button"
                  onClick={handleToolClick}
                  disabled={isLoading}
                >
                  <span className="button-content">
                    <span className="button-icon">🚀</span>
                    <span className="button-text">جرّب الأداة الآن</span>
                  </span>
                  <span className="button-shine"></span>
                </button>

                {/* مربع إدخال الكود */}
                {showCodeInput && !showIframe && (
                  <div className={`code-input-container ${showCodeInput ? 'show' : ''}`}>
                    <div className="code-box">
                      <h3 className="code-title">
                        <span className="lock-icon">🔐</span>
                        أدخل رمز الوصول
                      </h3>

                      <div className="input-wrapper">
                        <input
                          type="text"
                          value={enteredCode}
                          onChange={(e) => {
                            setEnteredCode(e.target.value);
                            setIsCodeValid(null);
                          }}
                          onKeyPress={handleKeyPress}
                          placeholder="أدخل الكود الخاص بك"
                          className={`code-input ${isCodeValid === false ? 'error' : ''} ${isCodeValid === true ? 'success' : ''}`}
                          disabled={isLoading}
                          autoFocus
                        />
                        
                        <button 
                          onClick={handleCodeSubmit}
                          className={`submit-button ${isLoading ? 'loading' : ''}`}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner"></span>
                          ) : (
                            'إرسال'
                          )}
                        </button>
                      </div>

                      {/* رسائل الحالة */}
                      {isCodeValid === false && (
                        <div className="message error-message">
                          <span className="message-icon">❌</span>
                          الكود غير صحيح! يرجى المحاولة مرة أخرى
                        </div>
                      )}

                      {isCodeValid === true && (
                        <div className="message success-message">
                          <span className="message-icon">✅</span>
                          تم التحقق بنجاح! جاري فتح الأداة...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* قسم الصورة */}
          <div className="image-preview">
            <div className="image-wrapper">
              <div className="image-glow"></div>
              <img
                className="preview-image"
                src="/images/neww.jpeg"
                alt="معاينة الأداة"
                loading="lazy"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>

        {/* عرض الأداة في iframe */}
        {showIframe && (
          <div className="iframe-modal">
            <div className="iframe-overlay" onClick={closeIframe}></div>
            <div className="iframe-container">
              <button className="iframe-close" onClick={closeIframe}>
                ✕
              </button>
              <div className="iframe-header">
                <h3>أداة تحويل الصور الذكية</h3>
                <div className="iframe-security">
                  🔒 اتصال آمن ومشفر
                </div>
              </div>
              <iframe
                src={decryptUrl(encryptedUrl)}
                title="أداة تحويل الصور"
                className="tool-iframe"
                allow="camera; microphone; clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </div>
        )}

        {/* عناصر زخرفية */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenImage;