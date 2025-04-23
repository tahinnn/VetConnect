import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const handleDashboardRedirect = () => {
    const userType = localStorage.getItem("userType");
    if (!userType) return alert("Please log in to access your dashboard.");
    navigate(`/${userType.toLowerCase()}-dashboard`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    alert("Logged out successfully!");
    navigate("/");
    setIsLoggedIn(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <i className="fas fa-paw"></i>
          <span>VetConnect</span>
        </div>
        <div className="nav-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/pets">Pets</Link>
          <Link to="/shelters">Shelters</Link>
          <Link to="/about">About</Link>
          {isLoggedIn && (
            <button className="btn-dashboard" onClick={handleDashboardRedirect}>Dashboard</button>
          )}
        </div>
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <button className="btn-login" onClick={handleLoginClick}>Login</button>
              <button className="btn-signup" onClick={handleSignupClick}>Sign Up</button>
            </>
          ) : (
            <button className="btn-logout" onClick={handleLogout}>Log Out</button>
          )}
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Find Your Perfect Companion</h1>
            <p>Adopt a pet and give them a forever home</p>
            <div className="search-box">
              <input type="text" placeholder="Search for pets..." />
              <button><i className="fas fa-search"></i></button>
            </div>
          </div>
        </section>

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
      </main>
    </div>
  );
};

export default Home;
