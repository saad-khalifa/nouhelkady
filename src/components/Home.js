// Home.js
import React from 'react';
import FullScreenImage from './FullScreenImage'; // استيراد FullScreenImage
import ProjectsPage from './ProjectsPage';
import AiProjectList from './AiProjectList';
import Footer from './Footer';

const Home = () => {
  return (
    <div>
      <FullScreenImage />
      <ProjectsPage/>
      <AiProjectList/>
      <Footer/>
      
    </div>
  );
};

export default Home;
