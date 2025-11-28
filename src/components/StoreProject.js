import React, { useState } from 'react';
import { Upload, X, CheckCircle, FolderPlus, Video, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../Axios/axiosInstance';
import '../styles/StoreProject.css';

const StoreProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...galleryImages];
            const newPreviews = [...galleryPreviews];

            files.forEach((file) => {
                newImages.push(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    setGalleryPreviews([...newPreviews]);
                };
                reader.readAsDataURL(file);
            });

            setGalleryImages(newImages);
        }
    };

    const removeMainImage = () => {
        setMainImage(null);
        setMainImagePreview(null);
    };

    const removeGalleryImage = (index) => {
        const newImages = [...galleryImages];
        const newPreviews = [...galleryPreviews];
        
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setGalleryImages(newImages);
        setGalleryPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mainImage) {
            setError('يرجى اختيار الصورة الرئيسية للمشروع');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('main_image', mainImage);
        
        // إضافة جميع صور المعرض
        galleryImages.forEach((image, index) => {
            formData.append('images[]', image);
        });
        
        if (videoUrl) {
            formData.append('video_url', videoUrl);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.post('/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });
            
            setSuccess(true);
            
            setTimeout(() => {
                setSuccess(false);
                setTitle('');
                setDescription('');
                setMainImage(null);
                setMainImagePreview(null);
                setGalleryImages([]);
                setGalleryPreviews([]);
                setVideoUrl('');
            }, 3000);
            
            console.log(response.data);
        } catch (err) {
            setError('حدث خطأ أثناء إضافة المشروع. يرجى المحاولة مرة أخرى.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="store-project-wrapper">
            <div className="store-project-container">
                <div className="page-header">
                    <div className="header-icon">
                        <FolderPlus size={40} />
                    </div>
                    <h1 className="page-title">إضافة مشروع للصفحة الرئيسية</h1>
                    <p className="page-subtitle">قم بإضافة مشروع جديد لعرضه في الصفحة الرئيسية للموقع</p>
                </div>

                {success && (
                    <>
                        <div className="success-overlay" onClick={() => setSuccess(false)}></div>
                        <div className="success-modal">
                            <div className="success-icon-large">
                                <CheckCircle size={60} />
                            </div>
                            <h3>تم بنجاح!</h3>
                            <p>تم إضافة المشروع بنجاح</p>
                        </div>
                    </>
                )}

                {error && (
                    <div className="error-alert">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="close-alert">
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

                        {/* الصورة الرئيسية */}
                        <div className="form-group">
                            <label style={{ color:'white' }} className="form-label">
                                <ImageIcon size={20} />
                                <span>الصورة الرئيسية للمشروع *</span>
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
                                        <img src={mainImagePreview} alt="Main Preview" />
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

                        {/* معرض الصور */}
                        <div className="form-group">
                            <label style={{ color:'white' }} className="form-label">
                                <ImageIcon size={20} />
                                <span>معرض الصور (اختياري)</span>
                            </label>
                            
                            <div className="upload-area">
                                <input
                                    type="file"
                                    id="galleryImages"
                                    className="file-input"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryImagesChange}
                                />
                                <label style={{ color:'white' }} htmlFor="galleryImages" className="upload-label">
                                    <Upload size={40} />
                                    <span>اضغط لاختيار مجموعة الصور</span>
                                    <small>يمكنك اختيار أكثر من صورة - PNG, JPG, WEBP</small>
                                </label>
                            </div>

                            {galleryPreviews.length > 0 && (
                                <div className="gallery-preview-container">
                                    <h4>الصور المختارة للمعرض ({galleryPreviews.length})</h4>
                                    <div className="gallery-grid">
                                        {galleryPreviews.map((preview, index) => (
                                            <div key={index} className="gallery-item">
                                                <img src={preview} alt={`Gallery ${index + 1}`} />
                                                <button 
                                                    type="button"
                                                    className="remove-gallery-image-btn"
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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

export default StoreProject;