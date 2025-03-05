import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import CategoriesDropdown from "./CategoriesDropdown";
import TrendingDropdown from "./TrendingDropdown";

const Header2 = () => {
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  const [isTrendingOpen, setTrendingOpen] = useState(false);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center py-3 px-4 mt-2 bgcolor">
      {/* Left Section: Categories, Trending, Search */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full md:flex-grow">
        {/* Dropdowns Section */}
        <div className="flex w-full md:w-auto z-10">
          <CategoriesDropdown
            isOpen={isCategoriesOpen}
            setIsOpen={setCategoriesOpen}
          />
        </div>
        <div className="flex w-full md:w-auto z-10">
          <TrendingDropdown
            isOpen={isTrendingOpen}
            setIsOpen={setTrendingOpen}
          />
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white py-2 px-4 ml-7 rounded-full w-full md:w-40 flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-500 w-full textcolor"
          />
          <FiSearch className="ml-2 text-gray-500" />
        </div>
      </div>

      {/* Right Section: Artists and Blog */}
      <div className="flex space-x-4 mt-6 md:mt-0"> {/* Added mt-6 to increase space between search and buttons on mobile */}
        <button className="bg-white py-2 px-6 rounded-full text-gray-500 hover:text-black border border-gray-300 transition w-full md:w-36 textcolor">
          Artists
        </button>
        <button className="bg-white py-2 px-6 rounded-full text-gray-500 hover:text-black border border-gray-300 transition w-full md:w-36 textcolor">
          Blog
        </button>
      </div>
    </header>
  );
};

export default Header2;
