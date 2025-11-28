import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, Cpu, Video, Image as ImageIcon, ArrowRight } from 'lucide-react';
import axiosInstance from '../Axios/axiosInstance'; // استيراد axiosInstance
import '../styles/AddAiProject.css';

const AddAiProject = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      setError('يرجى اختيار الصورة الرئيسية');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_url', videoUrl);
    formData.append('main_image', mainImage);

    images.forEach(image => {
      formData.append('images[]', image);
    });

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axiosInstance.post('/ai-projects', formData, { // استخدام axiosInstance هنا
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/manageProjectAiPage');
      }, 2000);
    } catch (err) {
      setError('حدث خطأ أثناء إضافة المشروع. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div className="add-ai-project-wrapper">
      <div className="add-ai-project-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowRight size={20} />
          <span>رجوع</span>
        </button>

        <div className="page-header">
          <div className="header-icon">
            <Cpu size={40} />
          </div>
          <h1 className="page-title">إضافة مشروع AI للواجهة</h1>
          <p className="page-subtitle">أضف مشروع ذكاء اصطناعي جديد إلى واجهة العرض</p>
        </div>

        {success && (
          <div className="success-alert">
            <CheckCircle size={20} />
            <span>تم إضافة المشروع بنجاح! جاري التحويل...</span>
          </div>
        )}

        {error && (
          <div className="error-alert">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-alert">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {/* العنوان */}
            <div className="form-group">
              <label style={{ color:'white' }} className="form-label">عنوان المشروع</label>
              <input 
                type="text"
                className="form-input"
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان المشروع..."
                required 
              />
            </div>

            {/* الوصف */}
            <div className="form-group">
              <label style={{ color:'white' }} className="form-label">وصف المشروع</label>
              <textarea 
                className="form-textarea"
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أدخل وصفاً تفصيلياً للمشروع..."
                rows={5}
                required 
              />
            </div>

            {/* رابط الفيديو */}
            <div className="form-group">
              <label style={{ color:'white' }} className="form-label">
                <Video size={20} />
                <span>رابط الفيديو (اختياري)</span>
              </label>
              <input 
                type="url"
                className="form-input"
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/... أو https://drive.google.com/..."
              />
            </div>

            {/* الصورة الرئيسية */}
            <div className="form-group">
              <label style={{ color:'white' }} className="form-label">
                <ImageIcon size={20} />
                <span>الصورة الرئيسية</span>
              </label>
              
              {!mainImagePreview ? (
                <div className="upload-area">
                  <input
                    type="file"
                    id="mainImage"
                    className="file-input"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  <label style={{ color:'white' }} htmlFor="mainImage" className="upload-label">
                    <Upload size={40} />
                    <span>اضغط لاختيار الصورة الرئيسية</span>
                    <small>PNG, JPG, WEBP (الحد الأقصى 5MB)</small>
                  </label>
                </div>
              ) : (
                <div className="image-preview-container">
                  <div className="main-image-preview">
                    <img src={mainImagePreview} alt="Preview" />
                    <button 
                      type="button"
                      className="remove-image-btn"
                      onClick={removeMainImage}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* الصور الإضافية */}
            <div className="form-group">
              <label style={{ color:'white' }} className="form-label">
                <ImageIcon size={20} />
                <span>صور إضافية (اختياري)</span>
              </label>
              
              <div className="upload-area">
                <input
                  type="file"
                  id="additionalImages"
                  className="file-input"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
                <label style={{ color:'white' }} htmlFor="additionalImages" className="upload-label">
                  <Upload size={40} />
                  <span>اضغط لاختيار صور إضافية</span>
                  <small>يمكنك اختيار عدة صور</small>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="images-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* زر الإرسال */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>إضافة المشروع</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAiProject;
