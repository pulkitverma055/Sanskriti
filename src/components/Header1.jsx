import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { logo } from "../assets/images/images";
import LoginSignupModal from "./login";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCart } from "../store/productSlice";

const Header1 = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoginMode, setLoginMode] = useState(true);
  const [isMenuOpen, setMenuOpen] = useState(false); // For mobile menu toggle

  const openLogin = () => {
    setLoginMode(true);
    setModalVisible(true);
  };

  const openSignup = () => {
    setLoginMode(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleShopClick = () => {
    window.location.href = "https://shop.sanskriti.pushkarverma.dev/";
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 sm:px-8 relative z-100 bgcolor">
      {/* Left Side: Hamburger Menu */}
      <div className="relative flex items-center space-x-4">
        <button className="text-gray-600 hover:text-black sm:hidden" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </button>

        {/* Mobile Dropdown Menu - Appears below the Hamburger */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full mt-2 bg-white shadow-md py-2 w-40 rounded-lg z-20">
            <button
              className="block w-full text-left text-gray-600 hover:text-black transition px-4 py-2"
              onClick={openLogin}
            >
              Login
            </button>
            <button
              className="block w-full text-left text-gray-600 hover:text-black transition px-4 py-2"
              onClick={openSignup}
            >
              Sign Up
            </button>
            <button
              className="block w-full text-left text-gray-600 hover:text-black transition px-4 py-2"
              onClick={handleShopClick}
            >
              Shop
            </button>
          </div>
        )}
      </div>
      
      {/* Center: Logo */}
      <div className="flex-grow flex mx-10 justify-evenly">
      <button className="text-gray-600 ml-7 opacity-0 hover:text-black transition textcolor">
          About
        </button>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
      </div>

      {/* Right Side: Buttons */}
      <div className="hidden sm:flex items-center space-x-6">
        <button className="text-gray-600 hover:text-black transition textcolor">
          About
        </button>
        <button className="text-gray-600 hover:text-black transition textcolor">
          FAQs
        </button>
        <button
          className="text-gray-600 hover:text-black transition textcolor"
          onClick={openLogin}
        >
          Login
        </button>
        <button
          onClick={openSignup}
          className="text-gray-600 hover:text-black transition textcolor rounded-full"
        >
          Sign Up
        </button>

        {/* Shop Button */}
        <button
          onClick={handleShopClick}
          className="border border-gray-300 text-gray-600 hover:text-black transition py-2 px-4 rounded-full textcolor"
        >
          Shop
        </button>

        {/* Uncomment and update the cart button */}
        {/* <Link to="/cart">
          <button className="relative text-gray-600 hover:text-black transition py-2 px-4 rounded-full">
            <FaShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </Link> */}
        
      </div>

      <LoginSignupModal
        isVisible={isModalVisible}
        onClose={closeModal}
        isLoginMode={isLoginMode}
      />
    </header>
  );
};

export default Header1;
