import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* قسم معلومات الاتصال */}
        <div className="footer-section">
          <h3>تواصل معنا</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaWhatsapp style={{ color:'white' }} className="contact-icon" />
              <a style={{ color:'white' }} href="https://wa.me/201140278609" target="_blank" rel="noopener noreferrer">+201140278609</a>
            </div>
            <div className="contact-item">
              <FaEnvelope style={{ color:'white' }} className="contact-icon" />
              <a style={{ color:'white' }} href="mailto:nouhelkady5555@gmail.com">nouhelkady5555@gmail.com</a>
            </div>
            <div className="contact-item">
              <FaPhone style={{ color:'white' }} className="contact-icon" />
              <a style={{ color:'white' }} href="tel:+201140278609">+201140278609</a>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt style={{ color:'white' }} className="contact-icon" />
              <span style={{ color:'white' }}>مصر</span>
            </div>
          </div>
        </div>

        {/* قسم وسائل التواصل الاجتماعي */}
        <div className="footer-section">
          <h3>تابعنا</h3>
          <div className="social-media">
            <a style={{ color:'white' }}  href="https://www.facebook.com/share/1Gt1cFjCdK/" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a style={{ color:'white' }} href="https://www.instagram.com/nouh_elkady?igsh=ZGh1cWUxbXUzN2lr" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a style={{ color:'white' }} href="https://www.tiktok.com/@nouhelkady?_r=1&_t=ZS-91YN4Bzxwfc" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a style={{ color:'white' }} href="https://www.youtube.com/@NouhElKady" target="_blank" rel="noopener noreferrer" className="social-icon youtube" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a style={{ color:'white' }} href="https://wa.me/201140278609" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* قسم الروابط */}
        <div className="footer-section">
          <h3>روابط مهمة</h3>
          <div className="footer-links">
            <Link style={{ color:'white' }} to="/privacy-policy">سياسة الخصوصية</Link>
            <Link style={{ color:'white' }} to="/terms-and-conditions">الشروط والأحكام</Link>
          </div>
        </div>
      </div>

      {/* قسم الحقوق والمصمم */}
      <div className="rights-section">
        <div className="rights-container">
          <p className="rights-text">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لـ 
            <span className="rights-name"> سعد الخليفة</span>
          </p>
          <div className="designer-contact">
            <a 
              style={{ color:'white', textDecoration:'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: "15px" }}
              href="https://wa.me/963964367942" 
              target="_blank" 
              rel="noopener noreferrer"
              className="designer-whatsapp"
              aria-label="تواصل مع المصمم عبر واتساب"
            >
              <span>963964367942+</span>
              <FaWhatsapp />
            </a>
            <a 
              style={{ color:'white', textDecoration:'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: "15px", marginRight: '15px' }}
              href="https://www.facebook.com/saad.al.khalifa.705540" 
              target="_blank" 
              rel="noopener noreferrer"
              className="designer-facebook"
              aria-label="تابع المصمم على فيسبوك"
            >
              <span>فيسبوك</span>
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;