import React, { useState, useEffect } from 'react';
import { Table, Container, Form, Modal, Alert } from 'react-bootstrap';
import axiosInstance from '../Axios/axiosInstance';
import '../styles/InternalProjectDashboard.css';

const InternalProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedGalleries, setExpandedGalleries] = useState({});
  
  // حالة المودال
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // بيانات التعديل
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedMainImage, setEditedMainImage] = useState(null);
  const [editedImages, setEditedImages] = useState([]);
  const [deletedMainImage, setDeletedMainImage] = useState(false);
  const [deletedGalleryImages, setDeletedGalleryImages] = useState([]);

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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/internal-projects');
      console.log('Internal Projects dashboard data:', response.data);
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching internal projects:', err);
      setError('حدث خطأ أثناء جلب المشاريع');
      setLoading(false);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setEditedTitle(project.title);
    setEditedDescription(project.description);
    setEditedMainImage(null);
    setEditedImages([]);
    setDeletedMainImage(false);
    setDeletedGalleryImages([]);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProject(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedMainImage(null);
    setEditedImages([]);
    setDeletedMainImage(false);
    setDeletedGalleryImages([]);
    setError(null);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      
      // إضافة _method للإشارة إلى PUT
      formData.append('_method', 'PUT');
      formData.append('title', editedTitle);
      formData.append('description', editedDescription);

      // إضافة الصورة الرئيسية إذا تم تعديلها
      if (editedMainImage) {
        formData.append('main_image', editedMainImage);
      }

      // إذا تم تحديد حذف الصورة الرئيسية
      if (deletedMainImage) {
        formData.append('delete_main_image', 'true');
      }

      // إضافة باقي الصور إذا تم تعديلها
      if (editedImages.length > 0) {
        for (let i = 0; i < editedImages.length; i++) {
          formData.append('images[]', editedImages[i]);
        }
      }

      // إضافة الصور المحذوفة من المعرض
      if (deletedGalleryImages.length > 0) {
        formData.append('deleted_images', JSON.stringify(deletedGalleryImages));
      }

      // استخدام POST بدلاً من PUT لأن FormData لا يعمل مع PUT
      const response = await axiosInstance.post(
        `/internal-projects/${editingProject.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // تحديث القائمة
      setProjects(projects.map(project => 
        project.id === editingProject.id ? response.data : project
      ));
      
      setSuccessMessage('تم تحديث المشروع بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      handleCloseModal();
      fetchProjects(); // إعادة تحميل المشاريع
    } catch (err) {
      console.error('Error updating project:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث المشروع');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من أنك تريد حذف هذا المشروع؟");
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/internal-projects/${id}`);
        setProjects(projects.filter(project => project.id !== id));
        setSuccessMessage('تم حذف المشروع بنجاح!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('حدث خطأ أثناء حذف المشروع');
      }
    }
  };

  // دالة لتبديل حالة عرض المزيد من الصور
  const toggleGalleryExpansion = (projectId) => {
    setExpandedGalleries(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // دالة لحذف الصورة الرئيسية
  const handleDeleteMainImage = () => {
    setDeletedMainImage(true);
    setEditedMainImage(null);
  };

  // دالة لاستعادة الصورة الرئيسية
  const handleRestoreMainImage = () => {
    setDeletedMainImage(false);
  };

  // دالة لحذف صورة من المعرض
  const handleDeleteGalleryImage = (imagePath) => {
    setDeletedGalleryImages(prev => [...prev, imagePath]);
  };

  // دالة لاستعادة صورة من المعرض
  const handleRestoreGalleryImage = (imagePath) => {
    setDeletedGalleryImages(prev => prev.filter(img => img !== imagePath));
  };

  // دالة لعرض معرض الصور مع خاصية "المزيد"
  const renderProjectImages = (project) => {
    if (!project.images || project.images.length === 0) {
      return <span className="text-muted">لا توجد صور إضافية</span>;
    }

    const images = JSON.parse(project.images);
    const isExpanded = expandedGalleries[project.id];
    const displayImages = isExpanded ? images : images.slice(0, 3);
    const hasMoreImages = images.length > 3;

    return (
      <div className="gallery-preview">
        <div className="gallery-count">
          {images.length} صورة
        </div>
        <div className="gallery-thumbnails">
          {displayImages.map((image, index) => (
            <img
              key={index}
              src={getStorageUrl(image)}
              alt={`image-${index}`}
              className="gallery-thumbnail"
            />
          ))}
          {!isExpanded && hasMoreImages && (
            <div 
              className="more-images"
              onClick={() => toggleGalleryExpansion(project.id)}
            >
              +{images.length - 3}
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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">جاري تحميل المشاريع...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="project-dashboard mt-4">
      <h1 className="mb-4">لوحة تحكم المشاريع الداخلية</h1>
      
      {/* رسائل النجاح والخطأ */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>العنوان</th>
            <th>الوصف</th>
            <th>الصورة الرئيسية</th>
            <th>الصور الإضافية</th>
            <th>التحكم</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.title}</td>
              <td>{project.description.substring(0, 50)}...</td>
              <td>
                <img 
                  src={getStorageUrl(project.main_image)}
                  alt={project.title} 
                  style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '5px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x70?text=No+Image';
                  }}
                />
              </td>
              <td>
                {renderProjectImages(project)}
              </td>
              <td>
                <div className="actions-cell">
                  <button
                    onClick={() => handleEditClick(project)}
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
      </Table>

      {/* Modal للتعديل */}
      <Modal show={showEditModal} onHide={handleCloseModal} size="lg" dir="rtl" className="edit-modal">
        <Modal.Header closeButton style={{ background: 'rgb(18,43,92)', color: 'white' }}>
          <Modal.Title>تعديل المشروع الداخلي</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'rgb(18,43,92)' }}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white' }}>العنوان</Form.Label>
              <Form.Control
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white' }}>الوصف</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white' }}>الصورة الرئيسية</Form.Label>
              
              {editingProject && editingProject.main_image && !deletedMainImage && (
                <div className="current-image-container">
                  <div className="current-image-header">
                    <small style={{ color: 'white' }}>الصورة الحالية:</small>
                    <button
                      type="button"
                      className="btn-delete-current"
                      onClick={handleDeleteMainImage}
                    >
                      🗑️ حذف الصورة الحالية
                    </button>
                  </div>
                  <img 
                    src={getStorageUrl(editingProject.main_image)}
                    alt="current"
                    className="current-main-image"
                  />
                </div>
              )}

              {editingProject && editingProject.main_image && deletedMainImage && (
                <div className="deleted-image-message">
                  <span style={{ color: 'white' }}>🗑️ تم تحديد حذف الصورة الرئيسية الحالية</span>
                  <button
                    type="button"
                    className="btn-restore"
                    onClick={handleRestoreMainImage}
                  >
                    ↩️ تراجع عن الحذف
                  </button>
                </div>
              )}

              <div className="mt-2">
                <small style={{ color: 'white' }}>
                  {editingProject && editingProject.main_image && !deletedMainImage 
                    ? "تغيير الصورة الرئيسية (اختياري)" 
                    : "الصورة الرئيسية الجديدة"}
                </small>
                <Form.Control
                  type="file"
                  onChange={(e) => setEditedMainImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white' }}>الصور الإضافية</Form.Label>
              
              {editingProject && editingProject.images && JSON.parse(editingProject.images).length > 0 && (
                <div className="current-gallery-container">
                  <small style={{ color: 'white' }}>الصور الحالية:</small>
                  <div className="current-gallery">
                    {JSON.parse(editingProject.images).map((image, index) => {
                      const isDeleted = deletedGalleryImages.includes(image);
                      return (
                        <div key={index} className="current-gallery-item">
                          <img 
                            src={getStorageUrl(image)}
                            alt={`current-${index}`}
                            className={isDeleted ? 'deleted-image' : ''}
                          />
                          {!isDeleted ? (
                            <button
                              type="button"
                              className="delete-gallery-image-btn"
                              onClick={() => handleDeleteGalleryImage(image)}
                            >
                              ✕
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="restore-gallery-image-btn"
                              onClick={() => handleRestoreGalleryImage(image)}
                            >
                              ↩️
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {deletedGalleryImages.length > 0 && (
                    <p className="gallery-note">
                      تم تحديد حذف {deletedGalleryImages.length} صورة - سيتم حذفها عند حفظ التعديلات
                    </p>
                  )}
                </div>
              )}

              <div className="mt-2">
                <small style={{ color: 'white' }}>إضافة صور جديدة للمعرض (اختياري)</small>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setEditedImages(Array.from(e.target.files))}
                  accept="image/*"
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: 'rgb(18,43,92)' }}>
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
              onClick={handleCloseModal}
              className="btn-cancel"
            >
              ❌ إلغاء
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InternalProjectDashboard;