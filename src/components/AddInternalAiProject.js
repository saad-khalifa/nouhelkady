import React, { useState } from 'react';
import { Button, Form, Container, Alert, Card } from 'react-bootstrap';
import { Upload, Image as ImageIcon, X, CheckCircle, Cpu } from 'lucide-react';
import axiosInstance from '../Axios/axiosInstance';  // استيراد axiosInstance
import '../styles/AddInternalAiProject.css';

const AddInternalAiProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [url, setUrl] = useState('');  // إضافة حالة للرابط
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    setSuccess(false);

    if (!mainImage) {
      setError('يرجى اختيار الصورة الرئيسية');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('main_image', mainImage);
    formData.append('url', url);  // إضافة الرابط إلى الـ formData

    images.forEach(image => {
      formData.append('images[]', image);
    });

    setLoading(true);

    try {
      await axiosInstance.post('/internal-projects', formData, {  // استخدام axiosInstance هنا
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setMainImage(null);
      setMainImagePreview(null);
      setImages([]);
      setImagePreviews([]);
      setUrl('');  // إعادة تعيين الـ url بعد الإضافة

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError('حدث خطأ أثناء إضافة المشروع. يرجى المحاولة مرة أخرى.');
    }

    setLoading(false);
  };

  return (
    <div className="add-project-page">
      <Container className="add-project-container">
        <div className="page-header">
          <div className="header-icon">
            <Cpu size={40} />
          </div>
          <h1 className="page-title">إضافة مشروع ذكاء اصطناعي جديد</h1>
          <p className="page-subtitle">قم بإضافة مشروع جديد إلى معرض الذكاء الاصطناعي</p>
        </div>

        {success && (
          <Alert variant="success" className="success-alert">
            <CheckCircle size={20} />
            <span>تم إضافة المشروع بنجاح!</span>
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="error-alert" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        <Card className="form-card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* العنوان */}
              <Form.Group className="form-group">
                <Form.Label style={{ color:'white' }} className="form-label">عنوان المشروع</Form.Label>
                <Form.Control 
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان المشروع"
                  required
                />
              </Form.Group>

              {/* الوصف */}
              <Form.Group className="form-group">
                <Form.Label style={{ color:'white' }} className="form-label">وصف المشروع</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={5}
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصفاً تفصيلياً للمشروع"
                  required
                />
              </Form.Group>

              {/* الرابط */}
              <Form.Group className="form-group">
                <Form.Label style={{ color:'white' }} className="form-label">رابط المشروع</Form.Label>
                <Form.Control
                  type="url"
                  className="form-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="أدخل رابط المشروع (اختياري)"
                />
              </Form.Group>

              {/* الصورة الرئيسية */}
              <Form.Group className="form-group">
                <Form.Label style={{ color:'white' }} className="form-label">
                  <ImageIcon size={20} />
                  <span>الصورة الرئيسية</span>
                </Form.Label>
                
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
              </Form.Group>

              {/* الصور الإضافية */}
              <Form.Group className="form-group">
                <Form.Label style={{ color:'white' }} className="form-label">
                  <ImageIcon size={20} />
                  <span>صور إضافية (اختياري)</span>
                </Form.Label>
                
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
              </Form.Group>

              {/* زر الإرسال */}
              <Button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>إضافة المشروع</span>
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AddInternalAiProject;
