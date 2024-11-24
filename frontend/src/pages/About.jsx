import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectFile, setProjectFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectTitle || !projectDescription || !projectFile) {
      alert('Please fill out all fields and select a file');
      return;
    }

    // Handle project upload logic here, like making an API call to save the project
    console.log('Project uploaded:', { projectTitle, projectDescription, projectFile });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto my-10 px-6">
        {/* About Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-semibold text-center mb-6">About <span className='text-pink-600'>Us</span></h2>
          <p className="text-lg text-gray-700">
            Welcome to Dribbble! Our platform is dedicated to helping developers, designers, and creatives showcase their amazing projects with the world. Whether you're a freelancer, part of a team, or simply passionate about your craft, Dribbble offers a space for you to share your work, get feedback, and find inspiration.
          </p>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">Our Motive</h3>
            <p className="text-lg text-gray-700 mt-2">
              Our mission is to provide a user-friendly platform where creators can upload their projects, network with others, and grow their portfolio. We aim to foster a vibrant community where everyone can share their work, learn from others, and get discovered by potential collaborators and employers.
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800">Our Capabilities</h3>
            <ul className="list-disc pl-5 mt-2">
              <li className="text-lg text-gray-700">Upload and showcase your frontend and backend projects.</li>
              <li className="text-lg text-gray-700">Get feedback and collaborate with fellow creators.</li>
              <li className="text-lg text-gray-700">Build your professional portfolio to attract potential employers and clients.</li>
              <li className="text-lg text-gray-700">Easily share your projects on social media to gain more visibility.</li>
              <li className="text-lg text-gray-700">Access a growing community of professionals from various fields.</li>
              <li className="text-lg text-gray-700">Take advantage of advanced search filters to find projects and creators that match your interests.</li>
              <li className="text-lg text-gray-700">Get discovered by potential employers and collaborators who are actively searching for creative talent.</li>
              <li className="text-lg text-gray-700">Save and organize your favorite projects to refer back to later for inspiration or collaboration.</li>
              <li className="text-lg text-gray-700">Contribute to open-source projects, help others, and build connections.</li>
            </ul>
          </div>
        </section>

        {/* Upload Project Section */}
        {/* You can add the project upload section here if needed */}

        {/* Future Vision */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800">Our Vision for the Future</h3>
          <p className="text-lg text-gray-700 mt-2">
            We are continuously working to improve the platform, with new features and capabilities being added regularly. In the future, we plan to:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li className="text-lg text-gray-700">Integrate with popular project management tools to help you manage your projects more effectively.</li>
            <li className="text-lg text-gray-700">Expand our community to include more professionals from diverse fields.</li>
            <li className="text-lg text-gray-700">Offer exclusive opportunities for collaborations and job placements directly through the platform.</li>
            <li className="text-lg text-gray-700">Enhance the user interface for an even more intuitive and seamless experience.</li>
            <li className="text-lg text-gray-700">Introduce premium features for advanced portfolio management and custom branding.</li>
          </ul>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default About;
