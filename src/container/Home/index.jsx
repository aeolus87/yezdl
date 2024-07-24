import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faXTwitter, faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons';
import "../../fonts/yzy.css";

const socialMediaLinks = [
  { icon: faYoutube, url: '#', color: 'text-gray-400', name: 'YouTube', maintenance: true },
  { icon: faXTwitter, url: '/twitter', color: 'text-black', name: 'X' },
  { icon: faInstagram, url: '/instagram', color: 'text-pink-500', name: 'Instagram' },
  { icon: faFacebookF, url: '/facebook', color: 'text-blue-600', name: 'Facebook' },
  { icon: faTiktok, url: '/tiktok', color: 'text-black', name: 'TikTok' },
];

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Link
          to="/"
          className="text-[#252525] text-[7rem] transition-colors duration-300 ease-in-out hover:text-[#979595] flex items-center"
        >
          y<span style={{ fontFamily: "YZY, sans-serif" }} className="flex">
            <span className="text-[#252525]">EZ</span>DL
          </span>
        </Link>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {socialMediaLinks.map((social, index) => (
          <motion.div
            key={social.url}
            whileHover={social.maintenance ? {} : { scale: 1.1 }}
            whileTap={social.maintenance ? {} : { scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 10
            }}
            className="relative"
          >
            {social.maintenance ? (
              <div className="flex flex-col items-center space-y-2 cursor-not-allowed">
                <FontAwesomeIcon icon={social.icon} className={`text-6xl ${social.color}`} />
                <span className="text-sm font-medium text-gray-600">{social.name}</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Maintenance
                </span>
              </div>
            ) : (
              <Link 
                to={social.url}
                className="flex flex-col items-center space-y-2"
              >
                <FontAwesomeIcon icon={social.icon} className={`text-6xl ${social.color}`} />
                <span className="text-sm font-medium text-gray-600">{social.name}</span>
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className="mt-12 text-xl text-gray-600 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click on an icon to go to the corresponding downloader page.
      </motion.p>
    </div>
  );
};

export default HomePage;