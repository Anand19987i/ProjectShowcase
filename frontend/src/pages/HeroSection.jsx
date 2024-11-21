import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCarousel from "./CategoryCarousel";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/projects/search?query=${searchQuery}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-16">
      <h2 className="text-4xl sm:text-6xl font-serif mb-3 text-center">Discover Best Projects</h2>
      <h1 className="text-4xl sm:text-6xl font-serif mb-4 text-center">From Creators Worldwide</h1>
      <p className="text-center text-gray-600 text-lg font-sans sm:text-xl ">
        Explore a collection of innovative projects from talented creators worldwide
      </p>
      <p className="text-center text-gray-600 text-lg font-sans sm:text-xl mb-5">
        Share your ideas and inspire the community.
      </p>
      <div className="mb-4 flex items-center border rounded-full hover:bg-gray-50 bg-gray-200 h-14">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-5 outline-none rounded-l-full h-full hover:bg-gray-50 bg-gray-200"
          placeholder="What you are looking for?"
        />
        <button
          onClick={handleSearch}
          className="p-4 text-center bg-pink-600 hover:bg-pink-700 h-full rounded-r-full text-white"
        >
          <SearchIcon />
        </button>
      </div>
      <CategoryCarousel />
    </div>
  );
};

export default HeroSection;
