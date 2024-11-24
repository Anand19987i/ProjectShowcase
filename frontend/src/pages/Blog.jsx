import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Blog = () => {
  const blogPosts = [
    {
      title: 'How to Showcase Your Projects Like a Pro',
      excerpt: 'In this blog, we’ll explore how you can effectively present your projects to stand out and attract potential employers or collaborators. Learn the tricks of presenting your projects professionally.',
      date: 'November 24, 2024',
      link: 'https://www.smashingmagazine.com/2020/04/portfolio-project-showcase-tips/',
    },
    {
      title: 'Tips for Building a Professional Portfolio',
      excerpt: 'Building a portfolio is a crucial step for any creative. Here are some essential tips to help you create a portfolio that stands out and attracts clients or employers.',
      date: 'November 21, 2024',
      link: 'https://blog.tubikstudio.com/how-to-build-a-portfolio-that-works/',
    },
    {
      title: 'The Future of Creative Communities',
      excerpt: 'As the creative industry evolves, so do the platforms where creators collaborate. Let’s discuss the future of online creative communities and what it means for freelancers and teams.',
      date: 'November 19, 2024',
      link: 'https://www.creativebloq.com/inspiration/the-future-of-design-creative-and-digital-collaboration',
    },
    {
      title: 'How Collaboration Leads to Innovation',
      excerpt: 'Collaboration is key to innovation. Learn how working together with other creatives can lead to breakthroughs and the creation of outstanding projects.',
      date: 'November 15, 2024',
      link: 'https://www.forbes.com/sites/forbestechcouncil/2021/02/16/how-collaboration-leads-to-innovation/?sh=3a9781db725f',
    },
    {
      title: 'Why Networking Matters for Creatives',
      excerpt: 'Networking is essential for creatives to get exposure, share ideas, and collaborate with like-minded individuals. Here’s why you should prioritize networking.',
      date: 'November 10, 2024',
      link: 'https://blog.hubspot.com/marketing/importance-of-networking-for-creatives',
    },
    {
      title: 'Building a Brand as a Freelance Creative',
      excerpt: 'In this blog, we’ll look at how freelancers can build and maintain a strong personal brand to stand out in a competitive market.',
      date: 'November 5, 2024',
      link: 'https://www.fiverr.com/resources/guides/freelance-branding-strategy',
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="max-w-4xl mx-auto my-10 px-6">
      <h2 className="text-3xl font-semibold text-center mb-6"><span className='text-pink-600'>Blogs</span></h2>
      {blogPosts.map((post, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-semibold">{post.title}</h3>
          <p className="text-lg text-gray-700 mt-2">{post.excerpt}</p>
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-4 block">
            Read More
          </a>
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default Blog;
