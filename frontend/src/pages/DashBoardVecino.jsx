import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";


export default function DashBoardVecino({ user, onGoToHome, onGoToPlazas,  onLogout }) {
  return (
    <div className="dashboard-vecino">
      <NavBar
        active="home"
        onGoToHome={onGoToHome}
        onGoToPlazas={onGoToPlazas}
        onLogout={onLogout}
        user={user}
      />


      <Footer onGoToHome={onGoToHome}></Footer>
    
    </div>
  )
};