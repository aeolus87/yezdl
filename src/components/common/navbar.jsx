import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faXTwitter, faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons';
import "../../fonts/yzy.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Menu state changed:", isMenuOpen);
  }, [isMenuOpen]);

  const scrollToHowToUse = (e) => {
    e.preventDefault();
    const howToUseSection = document.querySelector("#how-to-use");
    if (howToUseSection) {
      howToUseSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const toggleMenu = () => {
    console.log("Toggle menu clicked. Current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const socialMediaIcons = [
    { icon: faYoutube, path: "/youtube", color: "text-red-600" },
    { icon: faXTwitter, path: "/x", color: "text-black" },
    { icon: faInstagram, path: "/instagram", color: "text-pink-600" },
    { icon: faFacebookF, path: "/facebook", color: "text-blue-600" },
    { icon: faTiktok, path: "/tiktok", color: "text-black" },
  ];

  return (
    <header className="relative bg-[#ffffff]">
      <nav className="w-full max-w-[700px] mx-auto flex items-center justify-between py-3 px-4">
        <Link
          to="/"
          className="text-[#252525] text-lg lg:text-xl transition-colors duration-300 ease-in-out hover:text-[#979595] flex items-center"
        >
          <span style={{ fontFamily: "YZY, sans-serif" }}>
            Y<span className="text-[#252525]">EZ</span>DL
          </span>
        </Link>
        <div className="flex items-center">
          <div className="hidden md:flex space-x-6">
            {socialMediaIcons.map((item) => (
              <button
                key={item.path}
                onClick={() => handleLogoClick(item.path)}
                className={`text-2xl ${item.color} hover:opacity-75 transition-opacity duration-300 ease-in-out ${
                  location.pathname === item.path ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} />
              </button>
            ))}
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden ml-6 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 text-[#252525]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>


      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white absolute top-full left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="flex items-center space-x-6 py-4 justify-center">
          
           <a href="#how-to-use"
            onClick={scrollToHowToUse}
            className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
          >
            How to Use?
          </a>
          {socialMediaIcons.map((item) => (
            <button
              key={item.path}
              onClick={() => handleLogoClick(item.path)}
              className={`text-2xl ${item.color} hover:opacity-75 transition-opacity duration-300 ease-in-out ${
                location.pathname === item.path ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;