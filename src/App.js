import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/navbar";
import InstagramMain from "./container/instagram/InstagramMain";
import YoutubeMain from "./container/youtube/ytmain";
import XMain from "./container/x/XMain";
import FacebookMain from "./container/facebook/FacebookMain";
import TikTokMain from "./container/tiktok/TiktokMain";
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
          <Route path="/x" element={<XMain />} />
          <Route path="/facebook" element={<FacebookMain />} />
          <Route path="/tiktok" element={<TikTokMain />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;