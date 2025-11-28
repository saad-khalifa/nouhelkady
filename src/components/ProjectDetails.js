import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectDetails.css';

const ProjectDetails = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedMainImage, setUpdatedMainImage] = useState(null);
  const [updatedMainImagePreview, setUpdatedMainImagePreview] = useState(null);
  const [updatedGalleryImages, setUpdatedGalleryImages] = useState([]);
  const [updatedGalleryPreviews, setUpdatedGalleryPreviews] = useState([]);
  const [updatedVideoUrl, setUpdatedVideoUrl] = useState('');
  const [deletedMainImage, setDeletedMainImage] = useState(false);
  const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);
  const [expandedGalleries, setExpandedGalleries] = useState({}); // حالة لتتبع الصور الموسعة
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل المشاريع');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/projects/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setProjects(projects.filter(project => project.id !== id));
      alert('✅ تم حذف المشروع بنجاح');
    } catch (err) {
      setError('حدث خطأ أثناء حذف المشروع');
      alert('❌ حدث خطأ أثناء حذف المشروع');
      console.error(err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setUpdatedTitle(project.title);
    setUpdatedDescription(project.description);
    setUpdatedMainImage(null);
    setUpdatedMainImagePreview(null);
    setUpdatedGalleryImages([]);
    setUpdatedGalleryPreviews([]);
    setUpdatedVideoUrl(project.video_url || '');
    setDeletedMainImage(false);
    setDeletedGalleryImages([]);
    setError('');
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedMainImage(file);
      setDeletedMainImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMainImage = () => {
    setUpdatedMainImage(null);
    setUpdatedMainImagePreview(null);
  };

  const deleteCurrentMainImage = () => {
    setDeletedMainImage(true);
  };

  const restoreCurrentMainImage = () => {
    setDeletedMainImage(false);
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...updatedGalleryImages];
      const newPreviews = [...updatedGalleryPreviews];

      files.forEach((file) => {
        newImages.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          setUpdatedGalleryPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });

      setUpdatedGalleryImages(newImages);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = [...updatedGalleryImages];
    const newPreviews = [...updatedGalleryPreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setUpdatedGalleryImages(newImages);
    setUpdatedGalleryPreviews(newPreviews);
  };

  const deleteCurrentGalleryImage = (index) => {
    setDeletedGalleryImages(prev => [...prev, index]);
  };

  const restoreCurrentGalleryImage = (index) => {
    setDeletedGalleryImages(prev => prev.filter(i => i !== index));
  };

  // دالة لتبديل حالة عرض المزيد من الصور
  const toggleGalleryExpansion = (projectId) => {
    setExpandedGalleries(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // دالة لعرض معرض الصور مع خاصية "المزيد"
  const renderGalleryPreview = (project) => {
    if (!project.images || project.images.length === 0) {
      return <span>لا توجد صور إضافية</span>;
    }

    const isExpanded = expandedGalleries[project.id];
    const displayImages = isExpanded ? project.images : project.images.slice(0, 3);
    const hasMoreImages = project.images.length > 3;

    return (
      <div className="gallery-preview">
        <div className="gallery-count">
          {project.images.length} صورة
        </div>
        <div className="gallery-thumbnails">
          {displayImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery ${index + 1}`}
              className="gallery-thumbnail"
            />
          ))}
          {!isExpanded && hasMoreImages && (
            <div 
              className="more-images"
              onClick={() => toggleGalleryExpansion(project.id)}
            >
              +{project.images.length - 3}
            </div>
          )}
        </div>
        {hasMoreImages && (
          <button
            className="toggle-gallery-btn"
            onClick={() => toggleGalleryExpansion(project.id)}
          >
            {isExpanded ? 'إخفاء' : 'المزيد'}
          </button>
        )}
      </div>
    );
  };

  const handleSaveEdit = async () => {
    if (!updatedTitle || !updatedDescription) {
      setError('يجب إدخال العنوان والوصف');
      alert('⚠️ يجب إدخال العنوان والوصف');
      return;
    }

    const formData = new FormData();
    formData.append('title', updatedTitle);
    formData.append('description', updatedDescription);
    formData.append('_method', 'PUT');

    if (updatedMainImage) {
      formData.append('main_image', updatedMainImage);
    }

    if (deletedMainImage) {
      formData.append('delete_main_image', 'true');
    }

    updatedGalleryImages.forEach((image) => {
      formData.append('images[]', image);
    });

    if (deletedGalleryImages.length > 0) {
      formData.append('deleted_gallery_images', JSON.stringify(deletedGalleryImages));
    }

    if (updatedVideoUrl) {
      formData.append('video_url', updatedVideoUrl);
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axiosInstance.post(
        `/projects/${editingProject.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProjects(projects.map((project) => 
        project.id === editingProject.id ? response.data : project
      ));
      
      setEditingProject(null);
      setError('');
      alert('✅ تم حفظ التعديلات بنجاح');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ التعديلات');
      alert('❌ حدث خطأ أثناء حفظ التعديلات');
      console.error('Error details:', err.response?.data || err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setUpdatedTitle('');
    setUpdatedDescription('');
    setUpdatedMainImage(null);
    setUpdatedMainImagePreview(null);
    setUpdatedGalleryImages([]);
    setUpdatedGalleryPreviews([]);
    setUpdatedVideoUrl('');
    setDeletedMainImage(false);
    setDeletedGalleryImages([]);
    setError('');
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="projects-table-container">
        <div className="loading-message">
          <p>⏳ جاري تحميل المشاريع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-table-container">
      <h2>📋 قائمة المشاريع</h2>

      {error && (
        <div className="error-alert">
          ⚠️ {error}
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 ابحث حسب العنوان..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="projects-table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>العنوان</th>
              <th>الوصف</th>
              <th>الصورة الرئيسية</th>
              <th>معرض الصور</th>
              <th>رابط الفيديو</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                  {project.description.length > 100 
                    ? project.description.substring(0, 100) + '...' 
                    : project.description}
                </td>
                <td>
                  {project.main_image ? (
                    <img
                      src={project.main_image}
                      alt={project.title}
                      className="project-main-image"
                    />
                  ) : (
                    <span>لا توجد صورة رئيسية</span>
                  )}
                </td>
                <td>
                  {renderGalleryPreview(project)}
                </td>
                <td>
                  {project.video_url ? (
                    <a 
                      href={project.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      🎥 عرض الفيديو
                    </a>
                  ) : (
                    <span>لا يوجد فيديو</span>
                  )}
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      onClick={() => handleEdit(project)}
                      className="btn-edit"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-delete"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProject && (
        <div className="edit-form-container">
          <h3>✨ تعديل المشروع: {editingProject.title}</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">العنوان</label>
              <input
                type="text"
                className="form-input"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">الوصف</label>
              <textarea
                className="form-textarea"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                required
              />
            </div>

            {editingProject.main_image && !deletedMainImage && (
              <div className="current-image-container">
                <div className="current-image-header">
                  <label className="form-label">الصورة الرئيسية الحالية</label>
                  <button
                    type="button"
                    className="btn-delete-current"
                    onClick={deleteCurrentMainImage}
                  >
                    🗑️ حذف الصورة الحالية
                  </button>
                </div>
                <img
                  src={editingProject.main_image}
                  alt="Current Main"
                  className="current-main-image"
                />
              </div>
            )}

            {editingProject.main_image && deletedMainImage && (
              <div className="deleted-image-message">
                <span>🗑️ تم تحديد حذف الصورة الرئيسية الحالية</span>
                <button
                  type="button"
                  className="btn-restore"
                  onClick={restoreCurrentMainImage}
                >
                  ↩️ تراجع عن الحذف
                </button>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {editingProject.main_image && !deletedMainImage 
                  ? "تغيير الصورة الرئيسية (اختياري)" 
                  : "الصورة الرئيسية الجديدة (مطلوبة إذا لم توجد صورة حالية)"}
              </label>
              
              {!updatedMainImagePreview ? (
                <div className="upload-area">
                  <input
                    type="file"
                    id="mainImageEdit"
                    className="file-input"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  <label htmlFor="mainImageEdit" className="upload-label">
                    <span>📷 اختر صورة رئيسية جديدة</span>
                    <small>PNG, JPG, WEBP (الحد الأقصى 5MB)</small>
                  </label>
                </div>
              ) : (
                <div className="image-preview-container">
                  <div className="main-image-preview">
                    <img src={updatedMainImagePreview} alt="New Main Preview" />
                    <button 
                      type="button"
                      className="remove-image-btn"
                      onClick={removeMainImage}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="file-selected">
                    ✅ تم اختيار صورة رئيسية جديدة: {updatedMainImage.name}
                  </p>
                </div>
              )}
            </div>

            {editingProject.images && editingProject.images.length > 0 && (
              <div className="current-gallery-container">
                <label className="form-label">
                  معرض الصور الحالي ({editingProject.images.length} صورة)
                </label>
                <div className="current-gallery">
                  {editingProject.images.map((image, index) => (
                    <div key={index} className="current-gallery-item">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className={deletedGalleryImages.includes(index) ? 'deleted-image' : ''}
                      />
                      {!deletedGalleryImages.includes(index) ? (
                        <button
                          type="button"
                          className="delete-gallery-image-btn"
                          onClick={() => deleteCurrentGalleryImage(index)}
                        >
                          ✕
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="restore-gallery-image-btn"
                          onClick={() => restoreCurrentGalleryImage(index)}
                        >
                          ↩️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="gallery-note">
                  {deletedGalleryImages.length > 0 
                    ? `تم تحديد حذف ${deletedGalleryImages.length} صورة - سيتم حذفها عند حفظ التعديلات`
                    : 'ملاحظة: سيتم استبدال جميع الصور عند اختيار صور جديدة'}
                </p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">إضافة صور جديدة للمعرض (اختياري)</label>
              
              <div className="upload-area">
                <input
                  type="file"
                  id="galleryImagesEdit"
                  className="file-input"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                />
                <label htmlFor="galleryImagesEdit" className="upload-label">
                  <span>🖼️ اختر صور جديدة للمعرض</span>
                  <small>يمكنك اختيار أكثر من صورة - PNG, JPG, WEBP</small>
                </label>
              </div>

              {updatedGalleryPreviews.length > 0 && (
                <div className="new-gallery-preview">
                  <p>الصور الجديدة المختارة ({updatedGalleryPreviews.length}):</p>
                  <div className="new-gallery-grid">
                    {updatedGalleryPreviews.map((preview, index) => (
                      <div key={index} className="new-gallery-item">
                        <img src={preview} alt={`New ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-new-image-btn"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">رابط الفيديو</label>
              <input
                type="url"
                className="form-input"
                value={updatedVideoUrl}
                onChange={(e) => setUpdatedVideoUrl(e.target.value)}
                placeholder="https://drive.google.com/... أو https://youtube.com/..."
              />
            </div>

            <div className="form-buttons">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-save"
              >
                💾 حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cancel"
              >
                ❌ إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <p className="no-results">
          😔 لا توجد مشاريع تطابق البحث.
        </p>
      )}
    </div>
  );
};

export default ProjectDetails;