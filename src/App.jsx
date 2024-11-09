import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./assets/scss/_01-General/_BodyIndexApp.scss";


import Header from "./componentes/Header";
import MainContent from "./componentes/MainContent";

import Footer from "./componentes/Footer";

import SesionRegister from "./componentes/SesionRegistrate";
import SesionLogout from "./componentes/SesionLogout";
import SesionLogin from "./componentes/SesionLogin";

function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <div className="content centered">
          <Routes>
            <Route path="/login" element={<SesionLogin />} />
            <Route path="/register" element={<SesionRegister />} />
            <Route path="/logout" element={<SesionLogout />} />
            <Route path="*" element={<MainContent />} /> 
          </Routes>
        </div>
      </div>
 <hr className="lineafooter1"/>
  
      <Footer />
   
    </Router>
  );
}

export default App;
