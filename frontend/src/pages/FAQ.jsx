import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle the active state
  };

  const faqData = [
    { question: "How can I upload my project?", answer: "To upload your project, simply sign up or log in to our platform, click on 'Upload Project', fill in the details such as project title, description, and source code, and click 'Submit'." },
    { question: "Why should I showcase my project on Dribbble?", answer: "Dribbble is a great platform for showcasing your work, receiving feedback from other designers and developers, and getting exposure to potential clients or collaborators." },
    { question: "What makes Dribbble the best place to showcase my projects?", answer: "Dribbble offers a creative community that is focused on high-quality design work. It provides visibility among industry leaders and peers, helping you connect and grow your career." },
    { question: "Can I showcase both frontend and backend projects?", answer: "Yes! You can showcase both frontend and backend projects, along with the source code and a thumbnail of your work to attract more visibility." },
    { question: "How do I get feedback on my project?", answer: "Once your project is uploaded, other users on the platform can comment on it, offering feedback and suggestions to help you improve your work." },
    { question: "How do I make my project stand out?", answer: "To make your project stand out, ensure that you provide a clear and detailed description, a high-quality thumbnail, and well-organized code. Engage with the community by sharing your project on social media or Dribbble's forums." },
    { question: "Can I update my project after uploading it?", answer: "Yes, you can update your project at any time. Just go to your project page, click 'Edit', and modify the details or upload new versions." },
    { question: "What types of projects can I upload?", answer: "You can upload any project, whether it's a web app, mobile app, design system, UI/UX design, or anything related to technology and creativity." },
    { question: "Do I need a portfolio to upload a project?", answer: "No, you don’t need a full portfolio. However, having a portfolio can help showcase your work more effectively and make you more visible to potential collaborators or clients." },
    { question: "Is it free to upload projects?", answer: "Yes, uploading projects is completely free. However, there may be premium features available for extra visibility and enhanced features." },
    { question: "How can I promote my project on Dribbble?", answer: "You can promote your project by sharing it on your social media profiles, engaging with other users by commenting and providing feedback on their projects, and by using Dribbble's 'Follow' and 'Like' features to increase visibility." },
    { question: "Can I get hired through Dribbble?", answer: "Yes! Many companies and individuals browse Dribbble to find talented designers and developers for freelance work, full-time jobs, or collaboration." },
    { question: "How does Dribbble help me improve my design skills?", answer: "Dribbble provides exposure to a wide variety of high-quality work, enabling you to learn from other talented professionals. Feedback from the community can help you refine your skills and improve your designs." },
    { question: "Can I integrate Dribbble with other platforms?", answer: "Yes, you can link your Dribbble account with other platforms like GitHub, Behance, or your personal website to show off your full portfolio." },
  ];

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-6 w-1/2">
      <h1 className="text-3xl font-semibold mb-4">Frequently Asked <span className="text-pink-600">Questions</span></h1>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-300 rounded-lg">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => handleToggle(index)}
            >
              <span className="font-medium">{faq.question}</span>
              <span>{activeIndex === index ? "-" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div className="p-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>

  );
};

export default FAQ;
