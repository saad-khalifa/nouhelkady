import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Header from './Header';

const HomePage = () => {
  return (
    <div>
      <Header />
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>لمحة عن الموقع</Card.Title>
                <Card.Text>
                  هذا الموقع يتيح لك رفع الفيديوهات التعليمية من قبل الأدمن، مع إمكانية مشاهدة الفيديوهات المختلفة في مجالات متعددة.
                </Card.Text>
                <Button variant="primary" href="#">استكشاف المزيد</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>أحدث الفيديوهات</Card.Title>
                <Card.Text>
                  اكتشف أحدث الفيديوهات التعليمية التي تم رفعها من قبل الأدمن.
                </Card.Text>
                <Button variant="secondary" href="#">عرض الفيديوهات</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
