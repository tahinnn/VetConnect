import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';

const Home = () => {
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
    <div>
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
