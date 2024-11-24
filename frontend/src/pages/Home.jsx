import React from 'react'
import Navbar from './Navbar'
import ViewProject from './ViewProject'
import HeroSection from './HeroSection'
import Footer from './Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <ViewProject/>
      <Footer/>
    </div>
  )
}

export default Home