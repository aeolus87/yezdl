  //yezdl-aeolus\src\components\navbar.jsx
  import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../fonts/yzy.css";

function Navbar() {
  const [currentLogo, setCurrentLogo] = useState("youtube");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleLogoClick = (logo) => {
    setCurrentLogo(logo);
    setIsMenuOpen(false);
    switch (logo) {
      case "youtube":
        navigate("/");
        break;
      case "tiktok":
        navigate("/tiktok");
        break;
      case "instagram":
        navigate("/instagram");
        break;
      default:
        navigate("/");
    }
  };

  const toggleMenu = () => {
    console.log("Toggle menu clicked. Current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const renderLogo = () => {
    switch (currentLogo) {
      case "youtube":
        return <YouTubeLogo />;
      case "tiktok":
        return <TikTokLogo />;
      case "instagram":
        return <InstagramLogo />;
      default:
        return <YouTubeLogo />;
    }
  };

      return (
        <header className="relative bg-[#ffffff]">
          <nav className="w-full max-w-[1200px] mx-auto flex items-center justify-between py-3 px-4">
            {" "}
            <Link
              to="/"
              className="text-[#252525] text-lg sm:text-xl transition-colors duration-300 ease-in-out hover:text-[#979595] flex items-center"
            >
              <span style={{ fontFamily: "YZY, sans-serif" }} className="lg:mr-44">
                Y<span className="text-[#252525]">EZ</span>DL
              </span>
            </Link>
            <div className="flex justify-center">{renderLogo()}</div>
            <div className="hidden md:flex space-x-4 items-center">
              <a
                href="#how-to-use"
                onClick={scrollToHowToUse}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                How to Use?
              </a>
              <button
                onClick={() => handleLogoClick("tiktok")}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                TikTok
              </button>
              <button
                onClick={() => handleLogoClick("instagram")}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                Instagram
              </button>
            </div>
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
          </nav>

          {/* Mobile menu */}
          <div
            className={`md:hidden bg-white absolute top-full left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "max-h-screen opacity-100 visible"
                : "max-h-0 opacity-0 invisible"
            }`}
          >
            <div className="flex flex-col items-center space-y-4 pb-4 pt-4">
              <a
                href="#how-to-use"
                onClick={scrollToHowToUse}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                How to Use?
              </a>
              <button
                onClick={() => handleLogoClick("youtube")}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                YouTube
              </button>
              <button
                onClick={() => handleLogoClick("tiktok")}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                TikTok
              </button>
              <button
                onClick={() => handleLogoClick("instagram")}
                className="text-[#252525] hover:text-[#878484] transition-colors duration-300 ease-in-out"
              >
                Instagram
              </button>
            </div>
          </div>
        </header>
      );
    }

    const YouTubeLogo = () => (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="red">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    );

    const TikTokLogo = () => (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="black">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    );

    const InstagramLogo = () => (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="black">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );

    export default Navbar;
