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
              <FaWhatsapp className="contact-icon" />
              <a href="tel:+201140278609">+201140278609</a>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:nouhelkady5555@gmail.com">nouhelkady5555@gmail.com</a>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+201140278609">+201140278609</a>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>مصر</span>
            </div>
          </div>
        </div>

        {/* قسم وسائل التواصل الاجتماعي */}
        <div className="footer-section">
          <h3>تابعنا</h3>
          <div className="social-media">
            <a href="https://www.facebook.com/share/1Gt1cFjCdK/" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/nouh_elkady?igsh=ZGh1cWUxbXUzN2lr" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@nouhelkady?_r=1&_t=ZS-91YN4Bzxwfc" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="https://www.youtube.com/@NouhElKady" target="_blank" rel="noopener noreferrer" className="social-icon youtube" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://wa.me/201140278609" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* قسم الروابط */}
        <div className="footer-section">
          <h3>روابط مهمة</h3>
          <div className="footer-links">
            <Link to="/privacy-policy">سياسة الخصوصية</Link>
            <Link to="/terms-and-conditions">الشروط والأحكام</Link>
          </div>
        </div>
      </div>

      {/* حقوق النشر */}
      <div className="footer-copyright">
        <p>&copy; 2025 جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
};

export default Footer;
