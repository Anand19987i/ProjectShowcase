import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { setFilterProjects } from '@/redux/projectSlice';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CategoryCarousel = () => {

  const category = [
    "Ecommerce",
    "Dashboard",
    "Social Media",
    "Web App",
    "Mobile App",
    "Backend",
    "Frontend",
    "Data Analytics",
    "AI/ML",
    "Cybersecurity",
    "Cloud Computing",
    "Blockchain",
    "DevOps",
    "UI/UX Design",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchQuery = (query) => {
    dispatch(setFilterProjects(query)); // Set the filter in Redux (optional, based on your use case)
    navigate(`/projects/search?query=${query}`); // Navigate to the search page with the category as query
  }

  return (
    <div>
      <Carousel className='w-full mx-auto'>
        <CarouselContent className='flex'>
          {
            category.map((cat, index) => (
              <CarouselItem key={index} className='basis-1/3 md:basis-1/5 lg:basis-1/5 flex justify-evenly'>
                <button
                  onClick={() => searchQuery(cat)} // Use category as search query
                  className='rounded-full p-1 hover:bg-gray-100'
                >
                  {cat}
                </button>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
