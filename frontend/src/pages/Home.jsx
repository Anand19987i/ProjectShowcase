import React from 'react'
import Navbar from './Navbar'
import ViewProject from './ViewProject'
import HeroSection from './HeroSection'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <ViewProject/>
    </div>
  )
}

export default Home