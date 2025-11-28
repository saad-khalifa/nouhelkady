import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/ProjectsEditing.css';

const projects = [
  {
    id: 1,
    title: 'مشروع 1: مونتاج فيديو احترافي',
    description: 'إنتاج فيديوهات عالية الجودة للمشاريع التجارية والتسويقية.',
    image: '/images/project1.jpg',
  },
  {
    id: 2,
    title: 'مشروع 2: إنتاج فيديوهات تعليمية',
    description: 'إنتاج فيديوهات تعليمية لمختلف المواضيع مع تقنيات المونتاج المتقدمة.',
    image: '/images/project2.jpg',
  },
  {
    id: 3,
    title: 'مشروع 3: مونتاج أفلام قصيرة',
    description: 'مونتاج أفلام قصيرة بشكل احترافي مع مؤثرات خاصة.',
    image: '/images/project3.jpg',
  },
];

const ProjectsEditing = () => {
  return (
    <Container className="projects-container">
      <h2 className="text-center my-4">أعمالنا في المونتاج</h2>
      <Row>
        {projects.map((project) => (
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

export default ProjectsEditing;
