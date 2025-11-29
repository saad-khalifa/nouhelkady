import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Camera, Sparkles, Award, Users, Video, Zap, Target, TrendingUp } from 'lucide-react';
import '../styles/AboutUs.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { 
      icon: Video, 
      number: '7+', 
      label: 'سنوات خبرة', 
      color: 'stat-blue' 
    },
    { 
      icon: Sparkles, 
      number: '33+', 
      label: 'فيديو AI احترافي', 
      color: 'stat-purple' 
    },
    { 
      icon: Users, 
      number: '50+', 
      label: 'عميل سعيد', 
      color: 'stat-orange' 
    },
    { 
      icon: Award, 
      number: '100+', 
      label: 'مشروع منجز', 
      color: 'stat-green' 
    }
  ];

  const skills = [
    { 
      icon: Camera, 
      title: 'المونتاج الاحترافي', 
      desc: 'خبرة عميقة في المونتاج والسرد السينمائي', 
      color: 'skill-blue' 
    },
    { 
      icon: Sparkles, 
      title: 'تصحيح الألوان', 
      desc: 'إضافة المؤثرات البصرية والتحسينات', 
      color: 'skill-purple' 
    },
    { 
      icon: Zap, 
      title: 'فيديوهات الذكاء الاصطناعي', 
      desc: 'إنتاج محتوى مبتكر بتقنيات AI متقدمة', 
      color: 'skill-pink' 
    }
  ];

  const experience = [
    { 
      title: 'السياحة', 
      desc: 'محتوى ترويجي جذاب', 
      icon: '✈️' 
    },
    { 
      title: 'العقارات', 
      desc: 'عروض عقارية احترافية', 
      icon: '🏢' 
    },
    { 
      title: 'الأثاث المكتبي', 
      desc: 'فيديوهات تسويقية مبتكرة', 
      icon: '🪑' 
    },
    { 
      title: 'الأسواق الخليجية', 
      desc: 'السعودية والإمارات', 
      icon: '🌍' 
    }
  ];

   const click = () => {
    nav('/contact-us');
  };

    const handleFixedWhatsAppClick = () => {
    const phoneNumber = '+201140278609';
    const message = 'مرحباً، أريد التواصل معكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated Background */}
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="blur-circle blur-circle-1"></div>
          <div className="blur-circle blur-circle-2"></div>
          <div className="stars-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <Container>
          <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
            <div className="profile-section">
              {/* Profile Image */}
              <div className="profile-image-wrapper">
                <div className="profile-image-border">
                  <div className="profile-image-inner">
                    <img 
                      src="/images/newphoto.jpg" 
                      alt="Nouh ElKady Logo" 
                      className="profile-logo"
                    />
                  </div>
                </div>
                <div className="profile-badge">AI Specialist</div>
              </div>

              {/* Name & Title */}
              <h1 className="profile-name">Nouh ElKady</h1>
              <p className="profile-title">Video Editor & AI Specialist</p>
              
              <div className="profile-tags">
                <span className="tag tag-blue">7+ سنوات خبرة</span>
                <span className="tag tag-purple">33+ فيديو AI</span>
                <span className="tag tag-pink">محترف معتمد</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className={`stat-card ${stat.color}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="stat-icon-wrapper">
                      <IconComponent className="stat-icon" />
                    </div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-indicator-border">
            <div className="scroll-indicator-dot"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title gradient-text-blue">من أنا؟</h2>
            <div className="section-divider"></div>
          </div>

          <div className="about-content-card">
            <p className="about-text">
              أنا محرر فيديو محترف بخبرة تزيد عن <span className="highlight-blue">7 سنوات</span> في صناعة محتوى بصري مؤثر وجذاب. خلال مسيرتي، عملت مع شركات رائدة في مجالات السياحة، العقارات، والأثاث المكتبي، بالإضافة إلى التعاون مع عملاء في الأسواق السعودية والإماراتية.
            </p>
            <p className="about-text">
              بجانب المونتاج التقليدي، أنا متخصص في <span className="highlight-purple">إنتاج فيديوهات بالذكاء الاصطناعي</span>، حيث أقدّم حلول إبداعية متطورة تجذب الجمهور.
            </p>
            <div className="achievement-box">
              <Target className="achievement-icon" />
              <p className="achievement-text">
                أنجزت بنجاح أكثر من <span className="highlight-pink">33 فيديو احترافي</span> بالذكاء الاصطناعي لصالح علامات تجارية وشركات كبرى في دول عربية، مما ساعدها على رفع مستوى التسويق ورواية قصصها بشكل مبتكر.
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="skills-section">
            <h3 className="section-title gradient-text-purple">المهارات والخبرات</h3>
            <div className="skills-grid">
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div key={index} className={`skill-card ${skill.color}`}>
                    <div className="skill-border"></div>
                    <IconComponent className="skill-icon" />
                    <h4 className="skill-title">{skill.title}</h4>
                    <p className="skill-desc">{skill.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Experience Section */}
          <div className="experience-section">
            <h3 className="section-title gradient-text-orange">مجالات العمل</h3>
            <div className="experience-grid">
              {experience.map((exp, index) => (
                <div key={index} className="experience-card">
                  <div className="experience-icon">{exp.icon}</div>
                  <h4 className="experience-title">{exp.title}</h4>
                  <p className="experience-desc">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <TrendingUp className="cta-icon" />
            <h3 className="cta-title">جاهز لإنشاء محتوى مميز؟</h3>
            <p className="cta-text">
              دعني أساعدك في تحويل أفكارك إلى فيديوهات احترافية تجذب الجمهور وتحقق أهدافك التسويقية
            </p>
            <button className="cta-button">
  <span onClick={click} className="cta-button-text">تواصل معي الآن </span>
   <div className="cta-button-overlay"></div>
            </button>
          </div>
        </Container>
      </section>
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

export default AboutUs;