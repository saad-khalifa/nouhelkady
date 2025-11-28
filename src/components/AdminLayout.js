import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import '../styles/AdminLayout.css';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 992;
      setIsLargeScreen(large);
      if (large) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (!isLargeScreen) setSidebarOpen(false);
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "الرئيسية", icon: "🏠" },
    { path: "/admin/users", label: "المستخدمون", icon: "👥" },
    { path: "/admin/add-project", label: "إضافة مونتاج للرئيسية", icon: "➕" },
    { path: "/admin/manageProjectsPage", label: "مشاريع المونتاج الرئيسية", icon: "🎬" },
    { path: "/admin/add-ai-project", label: "إضافة مشروع AI للرئيسية", icon: "🤖" },
    { path: "/admin/manageProjectAiPage", label: "مشاريع AI للرئيسية", icon: "📊" },
    { path: "/admin/add-in-ai-project", label: "إضافة مشروع AI الداخلي", icon: "⚙️" },
    { path: "/admin/manageInternalAiProject", label: "مشاريع AI الداخلي", icon: "🔧" },
    { path: "/admin/add-video-project", label: "إضافة مشروع مونتاج الداخلي", icon: "🎥" },
    { path: "/admin/manageVideoProject", label: "مشاريع المونتاج الداخلي", icon: "📹" },
    { path: "/admin/add-course", label: "إضافة كورس ", icon: "📹" },
    { path: "/admin/courses", label: "الكورسات", icon: "📹" },
  ];

  return (
    <div className="admin-layout" dir="rtl">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          {!isLargeScreen && (
            <button onClick={() => setSidebarOpen(true)} className="menu-toggle" aria-label="فتح القائمة">
              <span></span><span></span><span></span>
            </button>
          )}
          <h1 className="navbar-title">لوحة التحكم</h1>
        </div>
      </nav>

      <div className="admin-container">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${isLargeScreen ? 'desktop' : 'mobile'}`}>
          {!isLargeScreen && (
            <button onClick={() => setSidebarOpen(false)} className="close-btn" aria-label="إغلاق">
              ✕
            </button>
          )}
          <div className="sidebar-header">
            <div className="admin-avatar">👤</div>
            <span className="admin-name">المدير</span>
          </div>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Overlay */}
        {!isLargeScreen && sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;