import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Camera, Sparkles, Award, Users, Video, Zap, Target, TrendingUp } from 'lucide-react';
import '../styles/AboutUs.css';
import { useNavigate } from 'react-router-dom';

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
    </div>
  );
};

export default AboutUs;