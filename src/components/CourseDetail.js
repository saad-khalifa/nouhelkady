import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Axios/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Alert, Button, ListGroup } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { AuthContext } from '../contexts/AuthContext';
import { FaLock, FaPlay, FaTrash, FaVideo, FaCheckCircle } from 'react-icons/fa';
import '../styles/CourseDetail.css'
const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (user === undefined) {
      console.log('Waiting for user data to load...');
      return;
    }
    
    setCheckingAuth(false);
    
    axiosInstance.get(`/courses/${courseId}`)
      .then(response => {
        setCourse(response.data);
        
        // تعيين الفيديو الأول كافتراضي
        if (response.data.videos && response.data.videos.length > 0) {
          setSelectedVideo(response.data.videos[0]);
        }
        
        if (!user) {
          console.log('User is not logged in');
          setIsSubscribed(false);
          setLoading(false);
          return;
        }
        
        const currentCourseId = parseInt(courseId);
        let userCourses = user?.numberCourse;
        
        if (!Array.isArray(userCourses)) {
          if (userCourses !== null && userCourses !== undefined) {
            userCourses = [parseInt(userCourses)];
          } else {
            userCourses = [];
          }
        }
        
        userCourses = userCourses.map(num => parseInt(num)).filter(num => !isNaN(num));
        
        console.log('User courses:', userCourses);
        console.log('Current course ID:', currentCourseId);
        
        if (userCourses.includes(currentCourseId)) {
          console.log('User is subscribed to this course');
          setIsSubscribed(true);
        } else {
          console.log('User is NOT subscribed to this course');
          setIsSubscribed(false);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching course details:', err);
        setError('حدث خطأ أثناء تحميل التفاصيل');
        setLoading(false);
      });
  }, [courseId, user]);

  // تحسين دالة التحقق من رابط YouTube
  const isYouTube = (url) => {
    return url && /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(url);
  };

  // تحسين دالة التحقق من Google Drive
  const isGoogleDrive = (url) => {
    return url && /drive\.google\.com/i.test(url);
  };

  // تحسين دالة التحقق من ملفات الفيديو
  const isVideoFile = (url) => {
    return url && /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)$/i.test(url);
  };

  // دالة لاستخراج ID من Google Drive
  const extractGoogleDriveId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];
    
    return null;
  };

  const handleDeleteVideo = async (videoId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      try {
        await axiosInstance.delete(`/courses/${courseId}/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const updatedVideos = course.videos.filter((video) => video.id !== videoId);
        setCourse({
          ...course,
          videos: updatedVideos,
        });
        
        if (selectedVideo?.id === videoId) {
          setSelectedVideo(updatedVideos.length > 0 ? updatedVideos[0] : null);
        }
        
        alert('✅ تم حذف الفيديو بنجاح');
      } catch (error) {
        console.error(error);
        alert('❌ حدث خطأ أثناء حذف الفيديو');
      }
    }
  };

  const renderVideoPlayer = (video, index) => {
    const videoUrl = video.video_url;
    
    if (!videoUrl) {
      return <Alert variant="warning">رابط الفيديو غير متوفر</Alert>;
    }

    // YouTube
    if (isYouTube(videoUrl)) {
      return (
        <div className="player-wrapper">
          <ReactPlayer 
            url={videoUrl} 
            controls 
            width="100%" 
            height="100%"
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />
        </div>
      );
    } 
    
    // Google Drive
    else if (isGoogleDrive(videoUrl)) {
      const driveId = extractGoogleDriveId(videoUrl);
      if (driveId) {
        return (
          <div className="player-wrapper">
            <iframe
              src={`https://drive.google.com/file/d/${driveId}/preview`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={`فيديو ${index + 1}`}
            ></iframe>
          </div>
        );
      } else {
        return <Alert variant="warning">تعذر استخراج معرف Google Drive</Alert>;
      }
    } 
    
    // ملفات الفيديو المباشرة
    else if (isVideoFile(videoUrl)) {
      return (
        <div className="player-wrapper">
          <video width="100%" height="100%" controls controlsList="nodownload">
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        </div>
      );
    } 
    
    // محاولة استخدام ReactPlayer لأي رابط آخر
    else {
      return (
        <div className="player-wrapper">
          <ReactPlayer 
            url={videoUrl} 
            controls 
            width="100%" 
            height="100%"
            fallback={<Alert variant="warning">نوع الفيديو غير مدعوم. الرابط: {videoUrl}</Alert>}
          />
        </div>
      );
    }
  };

  if (loading || checkingAuth) {
    return (
      <div className="loading-container">
        <div className="spinner-custom"></div>
        <p className="loading-text">جاري تحميل الكورس...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4 error-alert">
        {error}
      </Alert>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="animated-background"></div>
      
      <div className="container-fluid content-wrapper">
        {course ? (
          <div className="course-content">
            {/* Header Section */}
            <div className="course-header">
              <div className="header-content">
                <FaVideo className="header-icon" />
                <div>
                  <h1 className="course-title">{course.title}</h1>
                  <p className="course-description">{course.description}</p>
                </div>
              </div>
            </div>
            
            {isSubscribed ? (
              course.videos && course.videos.length > 0 ? (
                <Row className="video-section">
                  {/* قائمة الفيديوهات - اليسار */}
                  <Col md={4} lg={3} className="playlist-column">
                    <Card className="playlist-card">
                      <Card.Header className="playlist-header">
                        <FaPlay className="me-2" />
                        <h5 className="mb-0">قائمة الفيديوهات</h5>
                        <span className="video-count">{course.videos.length}</span>
                      </Card.Header>
                      <ListGroup variant="flush" className="video-list">
                        {course.videos.map((video, index) => (
                          <ListGroup.Item
                            key={video.id}
                            action
                            active={selectedVideo?.id === video.id}
                            onClick={() => setSelectedVideo(video)}
                            className="video-item"
                          >
                            <div className="video-item-content">
                              <div className="video-number">{index + 1}</div>
                              <div className="video-info">
                                <span className="video-title">فيديو {index + 1}</span>
                                {selectedVideo?.id === video.id && (
                                  <FaCheckCircle className="playing-icon" />
                                )}
                              </div>
                            </div>
                            {user?.is_admin === true && (
                              <Button
                                variant="link"
                                size="sm"
                                className="delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVideo(video.id);
                                }}
                              >
                                <FaTrash />
                              </Button>
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  </Col>

                  {/* مشغل الفيديو - اليمين */}
                  <Col md={8} lg={9} className="player-column">
                    {selectedVideo ? (
                      <Card className="player-card">
                        <Card.Body className="player-body">
                          <div  className="player-header">
                            <h4 style={{ color:'white' }} className="player-title">
                              فيديو {course.videos.findIndex(v => v.id === selectedVideo.id) + 1}
                            </h4>
                          </div>
                          <div className="video-player-container">
                            {renderVideoPlayer(
                              selectedVideo,
                              course.videos.findIndex(v => v.id === selectedVideo.id)
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    ) : (
                      <div className="select-video-message">
                        <FaPlay className="select-icon" />
                        <h3>اختر فيديو من القائمة للمشاهدة</h3>
                      </div>
                    )}
                  </Col>
                </Row>
              ) : (
                <Alert variant="info" className="no-videos-alert">
                  <FaVideo className="me-2" />
                  لا توجد فيديوهات لهذا الكورس
                </Alert>
              )
            ) : (
              <div className="subscription-box">
                <div className="lock-animation">
                  <FaLock className="lock-icon" />
                </div>
                <h2 className="subscription-title">محتوى مقفل</h2>
                <p className="subscription-text">
                  يرجى الاشتراك بالكورس لمشاهدة الفيديوهات والاستفادة من المحتوى التعليمي
                </p>
                <Button 
                  className="subscription-btn"
                  size="lg"
                  onClick={() => navigate('/courses')}
                >
                  <FaPlay className="me-2" />
                  عرض الكورسات المتاحة
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="warning" className="no-course-alert">
            لا توجد تفاصيل لهذا الكورس
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;