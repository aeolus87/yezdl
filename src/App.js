import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Main from "./container/main";
import HowToUse from "./container/howtouse";

function App() {
  return (
    <div className="lg:mx-48">
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/how-to-use" element={<HowToUse />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
