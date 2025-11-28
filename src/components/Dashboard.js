import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { FaUsers, FaVideo, FaRobot, FaFolder, FaFolderOpen, FaChartLine } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    projectsCount: 0,
    aiProjectsCount: 0,
    internalProjectsCount: 0,
    internalAiProjectsCount: 0,
    videoProjectsCount: 0,
    CoursesResCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // دالة مساعدة لاستخراج العدد
  const getCount = (data) => {
    if (data === null || data === undefined) return 0;
    if (data.count !== undefined) return data.count;
    if (Array.isArray(data)) return data.length;
    if (data.data && Array.isArray(data.data)) return data.data.length;
    if (data.projects && Array.isArray(data.projects)) return data.projects.length;
    if (data.users && Array.isArray(data.users)) return data.users.length;
    return 0;
  };

  useEffect(() => {
    if (!token) {
      setError('التوكن غير موجود!');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // تعريف جميع ال endpoints المطلوبة
        const endpoints = [
          { 
            key: 'usersCount', 
            url: '/admin/users',
            name: 'المستخدمين'
          },
          { 
            key: 'projectsCount', 
            url: '/projects',
            name: 'مشاريع المونتاج'
          },
          { 
            key: 'aiProjectsCount', 
            url: '/ai-projects',
            name: 'مشاريع AI'
          },
          { 
            key: 'internalProjectsCount', 
            url: '/internal-projects',
            name: 'المشاريع الداخلية'
          },
          { 
            key: 'videoProjectsCount', 
            url: '/video-projects',
            name: 'مشاريع الفيديو'
          },
          { 
            key: 'CoursesResCount', 
            url: '/courses',
            name: 'الكورسات'
          },
        ];

        // إنشاء مصفوفة من الوعود مع معالجة الأخطاء لكل endpoint
        const requests = endpoints.map(endpoint =>
          axiosInstance.get(endpoint.url, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(response => ({
              success: true,
              endpoint,
              data: response.data
            }))
            .catch(err => {
              return {
                success: false,
                endpoint,
                error: err,
                data: null
              };
            })
        );

        const responses = await Promise.all(requests);

        // تحديث الإحصائيات بشكل منفصل لكل endpoint
        const newStats = { ...stats };
        let hasError = false;
        const errors = [];

        responses.forEach(response => {
          if (response.success && response.data) {
            const { endpoint, data } = response;
            
            // تعيين القيمة الأساسية
            newStats[endpoint.key] = getCount(data);
          } else {
            hasError = true;
            errors.push(`فشل في جلب ${response.endpoint.name}`);
          }
        });

        // حساب مشاريع AI الداخلية بناءً على المشاريع الداخلية
        // إذا كان هناك حقل ai_count في الاستجابة نستخدمه، وإلا نعتبر كل المشاريع الداخلية AI
        const internalProjectsResponse = responses.find(r => r.endpoint.key === 'internalProjectsCount');
        if (internalProjectsResponse && internalProjectsResponse.success && internalProjectsResponse.data) {
          const internalData = internalProjectsResponse.data;
          
          // إذا كان هناك خاصية ai_count في البيانات نستخدمها
          if (internalData.ai_count !== undefined) {
            newStats.internalAiProjectsCount = internalData.ai_count;
          } else {
            // إذا لم توجد خاصية ai_count، نعتبر كل المشاريع الداخلية هي AI
            newStats.internalAiProjectsCount = newStats.internalProjectsCount;
          }
        }

        setStats(newStats);
        
        // إذا كان هناك أخطاء، عرض رسالة تحذير
        if (hasError) {
          if (errors.length === endpoints.length) {
            setError('فشل في جلب جميع البيانات');
          } else {
            setError(`فشل في جلب: ${errors.join(', ')}`);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('فشل في جلب البيانات');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
    <div 
      className="stat-card"
      style={{
        animationDelay: `${delay}s`
      }}
    >
      <div className={`stat-gradient ${gradient}`}></div>
      <div className="stat-icon-wrapper">
        <Icon className="stat-icon" />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
      <div className="stat-shine"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error && stats.usersCount === 0 && stats.projectsCount === 0) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <FaChartLine className="error-icon" />
          <p className="error-text">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">لوحة التحكم</h1>
        <div className="dashboard-subtitle">
          <FaChartLine />
          <span>نظرة عامة على الإحصائيات</span>
        </div>
        
      </div>

      <div className="stats-grid">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.usersCount}
          icon={FaUsers}
          gradient="gradient-purple"
          delay={0}
        />
        <StatCard
          title="مشاريع المونتاج الرئيسية"
          value={stats.projectsCount}
          icon={FaVideo}
          gradient="gradient-pink"
          delay={0.1}
        />
        <StatCard
          title="مشاريع AI الرئيسية"
          value={stats.aiProjectsCount}
          icon={FaRobot}
          gradient="gradient-blue"
          delay={0.2}
        />
        <StatCard
          title="مشاريع المونتاج الداخلية"
          value={stats.videoProjectsCount}
          icon={FaFolder}
          gradient="gradient-green"
          delay={0.3}
        />
        <StatCard
          title="مشاريع AI الداخلية"
          value={stats.internalAiProjectsCount}
          icon={FaFolderOpen}
          gradient="gradient-orange"
          delay={0.4}
        />
        <StatCard
          title="الكورسات"
          value={stats.CoursesResCount}
          icon={FaChartLine}
          gradient="gradient-teal"
          delay={0.5}
        />
      </div>
    </div>
  );
};

export default Dashboard;