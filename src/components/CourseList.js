import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaVideo, FaPlus, FaTimes, FaSave, FaImage, FaBook, FaLock, FaUnlock, FaPlay } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/CourseList.css';

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
      
      <div style={{ backgroundColor:'#122C5C' }} className="courses-container">
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
    </div>
  );
};

export default Courses;