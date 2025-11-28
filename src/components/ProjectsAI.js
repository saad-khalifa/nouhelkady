import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/ProjectsAI.css';

const projectsAI = [
  {
    id: 1,
    title: 'مشروع 1: الذكاء الاصطناعي في تحليل البيانات',
    description: 'استخدام تقنيات الذكاء الاصطناعي لتحليل البيانات الضخمة واستخراج الأنماط القيمة.',
    image: '/images/ai-project1.jpg',
  },
  {
    id: 2,
    title: 'مشروع 2: تطبيقات الذكاء الاصطناعي في الرؤية الحاسوبية',
    description: 'تطوير أنظمة الرؤية الحاسوبية باستخدام تقنيات الذكاء الاصطناعي لمعالجة الصور والفيديوهات.',
    image: '/images/ai-project2.jpg',
  },
  {
    id: 3,
    title: 'مشروع 3: الذكاء الاصطناعي في التعرف على الصوت',
    description: 'بناء نماذج ذكاء اصطناعي للتعرف على الصوت وتحليل اللغة الطبيعية.',
    image: '/images/ai-project3.jpg',
  },
];

const ProjectsAI = () => {
  return (
    <Container className="projects-container">
      <h2 className="text-center my-4">أعمالنا في الذكاء الاصطناعي</h2>
      <Row>
        {projectsAI.map((project) => (
          <Col key={project.id} sm={12} md={6} lg={4}>
            <Card className="project-card">
              <Card.Img variant="top" src={project.image} />
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
                <a href="#" className="btn btn-primary">شاهد التفاصيل</a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProjectsAI;
