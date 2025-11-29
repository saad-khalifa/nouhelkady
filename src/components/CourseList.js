import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaVideo, FaPlus, FaTimes, FaSave, FaImage, FaBook, FaLock, FaUnlock, FaPlay } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/CourseList.css';
import Footer from './Footer';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseData, setEditCourseData] = useState({
    title: '',
    description: '',
    image: '',
    imageFile: null,
    videos: []
  });
  const [imagePreview, setImagePreview] = useState(null);

  // المسار الأساسي للصور - استخدم الدومين الحقيقي
  const STORAGE_BASE_URL = process.env.REACT_APP_STORAGE_URL || 'https://nouhelkady.nouhelkady.com/storage';

  // دالة لبناء مسار الصورة
  const getStorageUrl = (path) => {
    if (!path) return '';
    
    let cleanPath = path.trim();
    
    // إزالة storage/ من البداية إذا وجدت
    cleanPath = cleanPath.replace(/^\/storage\//, '');
    cleanPath = cleanPath.replace(/^storage\//, '');
    
    return `${STORAGE_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Courses data:', response.data);
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) return;

    try {
      await axiosInstance.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course.id !== id));
      alert('✅ تم حذف الكورس بنجاح');
    } catch (error) {
      console.error(error);
      alert('❌ حدث خطأ أثناء حذف الكورس');
    }
  };
    const handleFixedWhatsAppClick = () => {
    const phoneNumber = '+201140278609';
    const message = 'مرحباً، أريد التواصل معكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEditClick = (course) => {
    setEditCourseId(course.id);
    setEditCourseData({
      title: course.title,
      description: course.description,
      image: course.image,
      imageFile: null,
      videos: course.videos ? course.videos.map(v => v.video_url) : []
    });
    setImagePreview(getStorageUrl(course.image));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditCourseData({ ...editCourseData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = () => {
    setEditCourseData({
      ...editCourseData,
      videos: [...editCourseData.videos, '']
    });
  };

  const handleVideoChange = (index, value) => {
    const newVideos = [...editCourseData.videos];
    newVideos[index] = value;
    setEditCourseData({ ...editCourseData, videos: newVideos });
  };

  const handleRemoveVideo = (index) => {
    const newVideos = editCourseData.videos.filter((_, i) => i !== index);
    setEditCourseData({ ...editCourseData, videos: newVideos });
  };

  const handleSaveEdit = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('title', editCourseData.title);
      formData.append('description', editCourseData.description);
      
      if (editCourseData.imageFile) {
        formData.append('image', editCourseData.imageFile);
      }

      editCourseData.videos.forEach((video, index) => {
        if (video.trim() !== '') {
          formData.append(`videos[${index}]`, video);
        }
      });

      formData.append('_method', 'PUT');

      const response = await axiosInstance.post(`/courses/${id}`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const updatedCourses = courses.map((course) => 
        course.id === id ? response.data : course
      );
      setCourses(updatedCourses);
      
      setEditCourseId(null);
      setImagePreview(null);
      alert('✅ تم تحديث الكورس بنجاح');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('❌ حدث خطأ أثناء تحديث الكورس');
    }
  };

  const handleCancelEdit = () => {
    setEditCourseId(null);
    setImagePreview(null);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const checkSubscriptionStatus = (courseId) => {
    if (!user || !user.numberCourse) return false;
    
    let userCourses = user.numberCourse;
    
    if (!Array.isArray(userCourses)) {
      userCourses = [parseInt(userCourses)];
    }
    
    userCourses = userCourses.map(num => parseInt(num)).filter(num => !isNaN(num));
    
    return userCourses.includes(parseInt(courseId));
  };

  const isAdmin = user?.is_admin == 1;

  return (
    <div className="courses-management-page">
      <div className="animated-background"></div>
      
      <div style={{ backgroundColor:'#141A32' }} className="courses-container">
        <div className="page-header">
          <FaBook className="header-icon" />
          <h1 className="page-title">
            {isAdmin ? 'إدارة الكورسات' : 'الكورسات المتاحة'}
          </h1>
          <p className="page-subtitle">
            {isAdmin ? 'عرض وتعديل وحذف الكورسات المتاحة' : 'تصفح الكورسات المتاحة للاشتراك'}
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-custom"></div>
            <p className="loading-text">جاري تحميل الكورسات...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="course-management-card">
                  {editCourseId === course.id && isAdmin ? (
                    <div className="edit-form">
                      <div className="edit-form-header">
                        <h3>تعديل الكورس</h3>
                        <button className="close-btn" onClick={handleCancelEdit}>
                          <FaTimes />
                        </button>
                      </div>

                      <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(course.id); }}>
                        <div className="form-group">
                          <label>
                            <FaBook className="label-icon" />
                            العنوان
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={editCourseData.title}
                            onChange={(e) => setEditCourseData({ ...editCourseData, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            <FaBook className="label-icon" />
                            الوصف
                          </label>
                          <textarea
                            className="form-textarea"
                            value={editCourseData.description}
                            onChange={(e) => setEditCourseData({ ...editCourseData, description: e.target.value })}
                            rows="4"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            <FaImage className="label-icon" />
                            صورة الكورس
                          </label>
                          <div className="image-edit-container">
                            {imagePreview && (
                              <div className="image-preview-wrapper">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                              </div>
                            )}
                            <input
                              type="file"
                              id={`image-${course.id}`}
                              className="file-input"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <label htmlFor={`image-${course.id}`} className="file-input-label">
                              <FaImage /> {editCourseData.imageFile ? 'تغيير الصورة' : 'اختيار صورة جديدة'}
                            </label>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>
                            <FaVideo className="label-icon" />
                            روابط الفيديوهات
                          </label>
                          <div className="videos-edit-container">
                            {editCourseData.videos.map((video, index) => (
                              <div key={index} className="video-input-row">
                                <span className="video-number">{index + 1}</span>
                                <input
                                  type="url"
                                  className="form-input"
                                  placeholder="أدخل رابط الفيديو"
                                  value={video}
                                  onChange={(e) => handleVideoChange(index, e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="remove-video-btn"
                                  onClick={() => handleRemoveVideo(index)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="add-video-btn"
                              onClick={handleAddVideo}
                            >
                              <FaPlus /> إضافة فيديو
                            </button>
                          </div>
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="save-btn">
                            <FaSave /> حفظ التعديلات
                          </button>
                          <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                            <FaTimes /> إلغاء
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="course-view">
                      <div className="course-image-wrapper">
                        <img
                          src={getStorageUrl(course.image)}
                          alt={course.title}
                          className="course-image"
                          onError={(e) => {
                            console.error('Course image failed to load:', e.target.src);
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                          }}
                        />
                        <div className="course-badge">ID: {course.id}</div>
                        {checkSubscriptionStatus(course.id) ? (
                          <div className="subscription-badge available">
                            <FaUnlock /> متاح
                          </div>
                        ) : (
                          <div className="subscription-badge locked">
                            <FaLock /> مدفوع
                          </div>
                        )}
                      </div>
                      
                      <div className="course-content">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-description">{course.description}</p>
                        
                        <div className="course-info">
                          <div className="info-item">
                            <FaVideo className="info-icon" />
                            <span>{course.videos ? course.videos.length : 0} فيديو</span>
                          </div>
                          <div className="info-item">
                            <span className="date">{new Date(course.created_at).toLocaleDateString('ar-SA')}</span>
                          </div>
                        </div>

                        {/* زر مشاهدة الكورس - يظهر للجميع */}
                        <div className="course-actions">
                          <button
                            className="view-course-btn"
                            onClick={() => handleViewCourse(course.id)}
                          >
                            <FaPlay /> مشاهدة الكورس
                          </button>
                        </div>

                        {/* أزرار التعديل والحذف - تظهر فقط للمسؤول */}
                        {isAdmin && (
                          <div className="course-actions admin-actions">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditClick(course)}
                            >
                              <FaEdit /> تعديل
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(course.id)}
                            >
                              <FaTrash /> حذف
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-courses">
                <FaBook className="no-courses-icon" />
                <h3>لا توجد كورسات</h3>
                <p>قم بإضافة كورس جديد لعرضه هنا</p>
              </div>
            )}
          </div>
        )}
      </div>
        {/* أيقونة واتساب الثابتة */}
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

export default Courses;