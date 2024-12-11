import React from 'react';
import Navbar from './Navbar';
import ViewProject from './ViewProject';
import HeroSection from './HeroSection';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow">
        <HeroSection />
        <ViewProject />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
