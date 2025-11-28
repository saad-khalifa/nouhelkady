import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Form, Row, Col, Card, Alert, Modal } from 'react-bootstrap';
import { FaTrash, FaTimes, FaEdit, FaEye, FaEyeSlash, FaUndo } from 'react-icons/fa';
import axiosInstance from '../Axios/axiosInstance';
import '../styles/AiProjectDashboard.css';

const AiProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedVideoUrl, setEditedVideoUrl] = useState('');
  const [editedMainImage, setEditedMainImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedImageRows, setExpandedImageRows] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  // حالات جديدة لتتبع حذف الصور
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
      const response = await axiosInstance.get('/ai-projects');
      console.log('AI Projects dashboard data:', response.data);
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching AI projects:', err);
      setError('حدث خطأ أثناء جلب المشاريع');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("هل أنت متأكد من أنك تريد حذف هذا المشروع؟");
      if (confirmDelete) {
        await axiosInstance.delete(`/ai-projects/${id}`);
        setProjects(projects.filter(project => project.id !== id));
        setSuccessMessage('تم حذف المشروع بنجاح!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('حدث خطأ أثناء حذف المشروع');
    }
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setEditedTitle(project.title);
    setEditedDescription(project.description);
    setEditedVideoUrl(project.video_url);
    setEditedMainImage(null);
    setMainImagePreview(getStorageUrl(project.main_image));
    setDeletedMainImage(false);
    
    // تحميل الصور الموجودة
    const images = project.images ? JSON.parse(project.images) : [];
    setExistingImages(images);
    setDeletedImages([]);
    setDeletedGalleryImages([]);
    setNewImages([]);
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedVideoUrl('');
    setEditedMainImage(null);
    setMainImagePreview(null);
    setExistingImages([]);
    setDeletedImages([]);
    setDeletedGalleryImages([]);
    setNewImages([]);
    setDeletedMainImage(false);
    setError(null);
  };

  // دوال جديدة للتحكم في حذف الصورة الرئيسية
  const handleDeleteMainImage = () => {
    setDeletedMainImage(true);
    setMainImagePreview(null);
    setEditedMainImage(null);
  };

  const handleRestoreMainImage = () => {
    setDeletedMainImage(false);
    // إعادة تعيين المعاينة للصورة الأصلية
    const currentProject = projects.find(p => p.id === editingProjectId);
    if (currentProject) {
      setMainImagePreview(getStorageUrl(currentProject.main_image));
    }
  };

  // دوال جديدة للتحكم في حذف صور المعرض
  const handleDeleteGalleryImage = (imagePath) => {
    setDeletedGalleryImages([...deletedGalleryImages, imagePath]);
  };

  const handleRestoreGalleryImage = (imagePath) => {
    setDeletedGalleryImages(deletedGalleryImages.filter(img => img !== imagePath));
  };

  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', editedTitle);
      formData.append('description', editedDescription);
      formData.append('video_url', editedVideoUrl || '');

      // إضافة الصورة الرئيسية إذا تم تعديلها ولم يتم حذفها
      if (editedMainImage && !deletedMainImage) {
        formData.append('main_image', editedMainImage);
      }

      // إرسال طلب حذف الصورة الرئيسية إذا تم حذفها
      if (deletedMainImage) {
        formData.append('delete_main_image', '1');
      }

      // إرسال الصور المحذوفة من المعرض
      if (deletedGalleryImages.length > 0) {
        formData.append('deleted_images', JSON.stringify(deletedGalleryImages));
      }

      // إضافة الصور الجديدة
      if (newImages.length > 0) {
        newImages.forEach((imageObj) => {
          formData.append('images[]', imageObj.file);
        });
      }

      const response = await axiosInstance.post(
        `/ai-projects/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setProjects(projects.map(project => 
        project.id === id ? response.data : project
      ));
      
      setSuccessMessage('تم تحديث المشروع بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
      handleCancelEdit();
      fetchProjects(); // إعادة تحميل المشاريع للتأكد من البيانات حديثة
    } catch (err) {
      console.error('خطأ في التحديث:', err.response?.data || err.message);
      setError('حدث خطأ أثناء تحديث المشروع: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedMainImage(file);
      setDeletedMainImage(false); // إلغاء الحذف إذا تم اختيار صورة جديدة
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImageObjects = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36)
    }));
    setNewImages([...newImages, ...newImageObjects]);
  };

  const handleDeleteNewImage = (imageId) => {
    const imageToDelete = newImages.find(img => img.id === imageId);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.preview);
    }
    setNewImages(newImages.filter(img => img.id !== imageId));
  };

  const toggleImageExpansion = (projectId) => {
    setExpandedImageRows(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const renderProjectImages = (project) => {
    if (!project.images || project.images.length === 0) {
      return <span className="text-muted">لا توجد صور</span>;
    }

    const images = JSON.parse(project.images);
    const isExpanded = expandedImageRows[project.id];
    const displayImages = isExpanded ? images : images.slice(0, 3);
    const hasMoreImages = images.length > 3;

    return (
      <div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '5px' }}>
          {displayImages.map((image, index) => (
            <div key={index} className="image-thumbnail-container">
              <img
                src={getStorageUrl(image)}
                alt={`image-${index}`}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  objectFit: 'cover', 
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={() => handleImageClick(getStorageUrl(image))}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                }}
              />
            </div>
          ))}
        </div>
        
        {hasMoreImages && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => toggleImageExpansion(project.id)}
            className="more-images-btn"
          >
            {isExpanded ? (
              <>
                <FaEyeSlash className="me-1" />
                إخفاء
              </>
            ) : (
              <>
                <FaEye className="me-1" />
                المزيد ({images.length - 3})
              </>
            )}
          </Button>
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

  if (error && !editingProjectId) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="ai-project-dashboard mt-4">
      <h1 className="mb-4">لوحة تحكم مشاريع AI</h1>

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
            <th>رابط الفيديو</th>
            <th>الصورة الرئيسية</th>
            <th>الصور</th>
            <th>التحكم</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <React.Fragment key={project.id}>
              <tr>
                <td>{project.id}</td>
                <td>{project.title}</td>
                <td>{project.description.substring(0, 50)}...</td>
                <td>
                  {project.video_url ? (
                    <a href={project.video_url} target="_blank" rel="noopener noreferrer">
                      مشاهدة الفيديو
                    </a>
                  ) : (
                    'لا يوجد فيديو'
                  )}
                </td>
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

              {editingProjectId === project.id && (
                <tr>
                  <td colSpan="7">
                    <div className="edit-form p-4">
                      <h3 className="mb-4">تعديل المشروع</h3>
                      <Form>
                        <Form.Group controlId="editedTitle" className="mb-3">
                          <Form.Label>العنوان</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={editedTitle} 
                            onChange={(e) => setEditedTitle(e.target.value)} 
                            required 
                          />
                        </Form.Group>

                        <Form.Group controlId="editedDescription" className="mb-3">
                          <Form.Label>الوصف</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={4}
                            value={editedDescription} 
                            onChange={(e) => setEditedDescription(e.target.value)} 
                            required 
                          />
                        </Form.Group>

                        <Form.Group controlId="editedVideoUrl" className="mb-3">
                          <Form.Label>رابط الفيديو</Form.Label>
                          <Form.Control 
                            type="url" 
                            value={editedVideoUrl} 
                            onChange={(e) => setEditedVideoUrl(e.target.value)} 
                            placeholder="https://example.com/video"
                          />
                        </Form.Group>

                        <Form.Group controlId="editedMainImage" className="mb-4">
                          <Form.Label>الصورة الرئيسية</Form.Label>
                          
                          {/* عرض الصورة الرئيسية مع خيارات الحذف والاستعادة */}
                          <div className="main-image-section mb-3">
                            {mainImagePreview && !deletedMainImage ? (
                              <div className="image-card position-relative d-inline-block">
                                <Card style={{ width: '200px' }}>
                                  <Card.Img 
                                    variant="top" 
                                    src={mainImagePreview}
                                    style={{ height: '150px', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                                    }}
                                  />
                                </Card>
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  className="delete-image-btn"
                                  onClick={handleDeleteMainImage}
                                >
                                  <FaTrash /> حذف
                                </Button>
                              </div>
                            ) : deletedMainImage ? (
                              <div className="deleted-image-alert p-3 mb-3 text-center">
                                <p className="text-warning mb-2">
                                  <FaTrash className="me-2" />
                                  الصورة الرئيسية محذوفة
                                </p>
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={handleRestoreMainImage}
                                >
                                  <FaUndo className="me-1" />
                                  استعادة الصورة
                                </Button>
                              </div>
                            ) : null}
                          </div>

                          <Form.Control 
                            type="file" 
                            onChange={handleMainImageChange} 
                            accept="image/*" 
                          />
                          <Form.Text className="text-muted">
                            اترك فارغاً إذا لم ترد تغيير الصورة الرئيسية
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>صور المعرض</Form.Label>
                          
                          {/* صور المعرض الموجودة */}
                          {existingImages.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">الصور الحالية:</h6>
                              <Row className="g-2">
                                {existingImages.map((image, index) => {
                                  const isDeleted = deletedGalleryImages.includes(image);
                                  return (
                                    <Col key={index} xs={6} sm={4} md={3} lg={2}>
                                      <Card className={`image-card ${isDeleted ? 'deleted' : ''}`}>
                                        <Card.Img 
                                          variant="top" 
                                          src={getStorageUrl(image)}
                                          style={{ 
                                            height: '120px', 
                                            objectFit: 'cover',
                                            opacity: isDeleted ? 0.4 : 1
                                          }}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150x120?text=No+Image';
                                          }}
                                        />
                                        {!isDeleted ? (
                                          <Button 
                                            variant="danger" 
                                            size="sm" 
                                            className="delete-image-btn"
                                            onClick={() => handleDeleteGalleryImage(image)}
                                          >
                                            <FaTrash /> حذف
                                          </Button>
                                        ) : (
                                          <Button 
                                            variant="success" 
                                            size="sm" 
                                            className="restore-image-btn"
                                            onClick={() => handleRestoreGalleryImage(image)}
                                          >
                                            <FaUndo /> استعادة
                                          </Button>
                                        )}
                                      </Card>
                                      {isDeleted && (
                                        <div className="text-center mt-1">
                                          <small className="text-warning">محذوفة</small>
                                        </div>
                                      )}
                                    </Col>
                                  );
                                })}
                              </Row>
                            </div>
                          )}

                          {/* صور المعرض الجديدة */}
                          {newImages.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-muted mb-2">الصور الجديدة:</h6>
                              <Row className="g-2">
                                {newImages.map((imageObj) => (
                                  <Col key={imageObj.id} xs={6} sm={4} md={3} lg={2}>
                                    <Card className="image-card">
                                      <Card.Img 
                                        variant="top" 
                                        src={imageObj.preview}
                                        style={{ height: '120px', objectFit: 'cover' }}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = 'https://via.placeholder.com/150x120?text=No+Image';
                                        }}
                                      />
                                      <Button 
                                        variant="warning" 
                                        size="sm" 
                                        className="delete-image-btn"
                                        onClick={() => handleDeleteNewImage(imageObj.id)}
                                      >
                                        <FaTimes /> إزالة
                                      </Button>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}

                          <Form.Control 
                            type="file" 
                            onChange={handleNewImagesChange} 
                            accept="image/*" 
                            multiple 
                          />
                          <Form.Text className="text-muted">
                            يمكنك اختيار عدة صور مرة واحدة
                          </Form.Text>
                        </Form.Group>

                        <div className="form-buttons">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(project.id)}
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
                      </Form>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* Modal لعرض الصورة كاملة */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>معاينة الصورة</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img 
            src={selectedImage} 
            alt="معاينة" 
            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x300?text=No+Image';
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AiProjectDashboard;