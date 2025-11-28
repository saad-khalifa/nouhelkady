import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FullScreenImage.css';

const FullScreenImage = () => {
  const navigate = useNavigate();
  const [enteredCode, setEnteredCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // التحقق من وجود الـ token في localStorage
  const isLoggedIn = localStorage.getItem('token') !== null;

  // التعامل مع الضغط على الزر
  const handleToolClick = () => {
    if (!isLoggedIn) {
      // إذا لم يكن مسجل الدخول، إظهار alert يطلب منه تسجيل الدخول
      alert('يرجى تسجيل الدخول أولاً!');
      navigate('/login'); // الانتقال إلى صفحة تسجيل الدخول
    } else {
      setShowCodeInput(true);
    }
  };

  // التعامل مع إدخال الكود
  const handleCodeSubmit = () => {
    if (!enteredCode.trim()) {
      setIsCodeValid(false);
      return;
    }

    setIsLoading(true);

    // جلب الكود المخزن في localStorage
    const storedCode = localStorage.getItem('user_code');

    if (!storedCode) {
      setIsCodeValid(false);
      setIsLoading(false);
      alert('لم يتم العثور على الكود المخزن.');
      return;
    }

    // محاكاة عملية التحقق
    setTimeout(() => {
      if (enteredCode === storedCode) {
        setIsCodeValid(true);
        setTimeout(() => {
          window.open("https://ai.studio/apps/drive/1_vYNfLWpvDBZp2uKdGC6vyrrnqDTffV9", "_blank");
        }, 500);
      } else {
        setIsCodeValid(false);
      }
      setIsLoading(false);
    }, 800);
  };

  // التعامل مع Enter للإرسال
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCodeSubmit();
    }
  };

  return (
    <div className="fullscreen-wrapper">
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
                {showCodeInput && (
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
