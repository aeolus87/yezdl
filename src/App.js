import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/navbar";
import InstagramMain from "./container/instagram/InstagramMain";
import YoutubeMain from "./container/youtube/ytmain";
import HomePage from "./container/Home";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faYoutube, faXTwitter, faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons';

library.add(faYoutube, faXTwitter, faInstagram, faFacebookF, faTiktok);

function App() {
  const location = useLocation();

  return (
    <div className="lg:mx-48">
      {location.pathname !== '/' && <Navbar />}
      <div className="">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instagram" element={<InstagramMain />} />
          <Route path="/youtube" element={<YoutubeMain />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;