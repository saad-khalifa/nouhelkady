import React, { useState } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { FaCloudUploadAlt, FaVideo, FaPlus, FaTrash, FaBook, FaCheckCircle } from 'react-icons/fa';
import '../styles/AddCourse.css';

const AddCourse = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    image: null,
    videos: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourse((prevCourse) => ({
        ...prevCourse,
        image: file,
      }));
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      videos: [...prevCourse.videos, ''],
    }));
  };

  const handleVideoChange = (index, e) => {
    const newVideos = [...course.videos];
    newVideos[index] = e.target.value;
    setCourse((prevCourse) => ({
      ...prevCourse,
      videos: newVideos,
    }));
  };

  const handleRemoveVideo = (index) => {
    const newVideos = course.videos.filter((_, i) => i !== index);
    setCourse((prevCourse) => ({
      ...prevCourse,
      videos: newVideos,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title || !course.description || !course.image || course.videos.length === 0) {
      setError('الرجاء ملء جميع الحقول وإضافة فيديو واحد على الأقل');
      setSuccess('');
      return;
    }

    const formData = new FormData();
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('image', course.image);

    course.videos.forEach((video, index) => {
      formData.append(`videos[${index}]`, video);
    });

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('✅ تم إضافة الكورس بنجاح!');
      setCourse({
        title: '',
        description: '',
        image: null,
        videos: [],
      });
      setImagePreview(null);
      
      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      console.error('Error adding course:', err);
      setError('حدث خطأ أثناء إضافة الكورس. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-page">
      <div className="animated-background"></div>
      
      <div  className="add-course-container">
        <div className="page-header">
          <FaBook className="header-icon" />
          <h1 className="page-title">إضافة كورس جديد</h1>
          <p className="page-subtitle">أضف محتوى تعليمي جديد للمنصة</p>
        </div>

        <div style={{ backgroundColor:'#132B5A' }} className="form-wrapper">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <FaCheckCircle />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="course-form">
            {/* عنوان الكورس */}
            <div className="form-group">
              <label style={{ color:'wheat' }} htmlFor="title" className="form-label">
                <FaBook className="label-icon" />
                عنوان الكورس
              </label>
              <input 
                type="text"
                id="title"
                name="title"
                className="form-input"
                placeholder="أدخل عنوان الكورس"
                value={course.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* الوصف */}
            <div className="form-group">
              <label style={{ color:'wheat' }} htmlFor="description" className="form-label">
                <FaBook className="label-icon" />
                وصف الكورس
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="أدخل وصف تفصيلي للكورس"
                value={course.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            {/* صورة الكورس */}
            <div className="form-group">
              <label style={{ color:'wheat' }} htmlFor="image" className="form-label">
                <FaCloudUploadAlt className="label-icon" />
                صورة الكورس
              </label>
              
              <div className="image-upload-container">
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="معاينة" className="image-preview" />
                    <button
                      type="button"
                      className="change-image-btn"
                      onClick={() => document.getElementById('image').click()}
                    >
                      <FaCloudUploadAlt /> تغيير الصورة
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder" onClick={() => document.getElementById('image').click()}>
                    <FaCloudUploadAlt className="upload-icon" />
                    <p className="upload-text">اضغط لاختيار صورة الكورس</p>
                    <p className="upload-hint">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                )}
                
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            {/* روابط الفيديو */}
            <div className="form-group">
              <label style={{ color:'wheat' }} className="form-label">
                <FaVideo className="label-icon" />
                روابط الفيديوهات
              </label>
              
              <div className="videos-container">
                {course.videos.length === 0 ? (
                  <div className="no-videos-placeholder">
                    <FaVideo className="placeholder-icon" />
                    <p>لم تتم إضافة أي فيديوهات بعد</p>
                  </div>
                ) : (
                  course.videos.map((video, index) => (
                    <div key={index} className="video-input-wrapper">
                      <div className="video-number">{index + 1}</div>
                      <input
                        type="url"
                        className="form-input video-input"
                        placeholder="أدخل رابط الفيديو (YouTube, Google Drive, رابط مباشر)"
                        value={video}
                        onChange={(e) => handleVideoChange(index, e)}
                        required
                      />
                      <button
                        type="button"
                        className="remove-video-btn"
                        onClick={() => handleRemoveVideo(index)}
                        title="حذف الفيديو"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
                
                <button style={{ color:'white' }}
                  type="button" 
                  className="add-video-btn"
                  onClick={handleAddVideo}
                >
                  <FaPlus className="btn-icon" />
                  إضافة فيديو جديد
                </button>
              </div>
            </div>

            {/* زر الإرسال */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <FaCheckCircle className="btn-icon" />
                  إضافة الكورس
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;