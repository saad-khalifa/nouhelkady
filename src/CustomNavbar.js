import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import './styles/CustomNavbar.css';

const CustomNavbar = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // تحديد إذا كان المستخدم قد مرر لأسفل لتطبيق التأثير
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  // إغلاق القائمة عند النقر على أي رابط
  const handleNavClick = () => {
    setExpanded(false);
  };

  // إضافة مستمع لتغييرات التمرير
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar
      className={`sticky-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        {/* الشعار */}
        <Navbar.Brand as={Link} to="/" className="logo-brand" onClick={handleNavClick}>
          <img
            src="/images/logo.png"
            alt="Logo"
            className="logo-image"
          />
        </Navbar.Brand>

        {/* زر التوسيع للموبايل */}
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler">
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>

        {/* قائمة التنقل */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {/* الرئيسية */}
            <Nav.Link 
              as={Link} 
              to="/" 
              className="nav-link-custom"
              onClick={handleNavClick}
            >
              <span>الرئيسية</span>
            </Nav.Link>

            {/* قائمة المشاريع المنسدلة */}
            <NavDropdown 
              title="المشاريع" 
              id="navbar-dropdown"
              className="nav-dropdown-custom"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/projects"
                onClick={handleNavClick}
                className="dropdown-item-custom"
              >
                أعمالنا في المونتاج
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/projects-ai"
                onClick={handleNavClick}
                className="dropdown-item-custom"
              >
                أعمالنا في الذكاء الاصطناعي
              </NavDropdown.Item>
            </NavDropdown>

            {/* الكورسات */}
            <Nav.Link 
              as={Link} 
              to="/courses" 
              className="nav-link-custom"
              onClick={handleNavClick}
            >
              <span>الكورسات</span>
            </Nav.Link>

            {/* من نحن */}
            <Nav.Link 
              as={Link} 
              to="/about-us" 
              className="nav-link-custom"
              onClick={handleNavClick}
            >
              <span>من نحن</span>
            </Nav.Link>

            {/* تواصل معنا */}
            <Nav.Link 
              as={Link} 
              to="/contact-us" 
              className="nav-link-custom"
              onClick={handleNavClick}
            >
              <span>تواصل معنا</span>
            </Nav.Link>

            {/* لوحة التحكم - للأدمن فقط */}
            {user && user.is_admin && (
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className="nav-link-custom admin-link"
                onClick={handleNavClick}
              >
                <span>لوحة التحكم</span>
              </Nav.Link>
            )}

            {/* زر تسجيل الدخول أو الخروج */}
            <div className="auth-button-wrapper">
              {user ? (
                <Button 
                  variant="danger" 
                  onClick={() => {
                    logout();
                    handleNavClick();
                  }}
                  className="auth-button logout-button"
                >
                  تسجيل الخروج
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  as={Link} 
                  to="/login"
                  onClick={handleNavClick}
                  className="auth-button login-button"
                >
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default CustomNavbar;