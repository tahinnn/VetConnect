import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserTypeSelect from "./components/UserTypeSelect";
import UserDashboard from "./components/UserDashboard";
import ShelterDashboard from "./components/ShelterDashboard";
import AdminDashboard from './components/AdminDashboard';
import PetList from "./components/PetList";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import CreatePetAdPage from "./components/CreatePetAdPage";

// Import styles
import './styles.css';
import './App.css';

const clientId = "230127747685-97hkrk2841dsf2l0fvo9gb3tnmj44let.apps.googleusercontent.com";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => {
      setShowLoginModal(true);
      setShowSignupModal(false);
    };

    const handleOpenSignup = () => {
      setShowSignupModal(true);
      setShowLoginModal(false);
    };

    window.addEventListener('openLoginModal', handleOpenLogin);
    window.addEventListener('openSignupModal', handleOpenSignup);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLogin);
      window.removeEventListener('openSignupModal', handleOpenSignup);
    };
  }, []);

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Navbar />
        
        {showLoginModal && (
          <div className="modal show" onClick={handleCloseModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={handleCloseModals}>&times;</span>
              <h2>Login</h2>
              <Login />
            </div>
          </div>
        )}

        {showSignupModal && (
          <div className="modal show" onClick={handleCloseModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={handleCloseModals}>&times;</span>
              <h2>Sign Up</h2>
              <Register />
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-user-type" element={<UserTypeSelect />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/create-ad" element={<CreatePetAdPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
