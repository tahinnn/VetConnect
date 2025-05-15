// Home.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (userType === "shelter") {
      navigate("/shelterprofile");
    } else if (userType === "admin") {
      navigate("/admindashboard");
    } else if (userType === "user") {
      navigate("/userprofile");
    }
    // else: stay on the landing page (maybe not logged in)
  }, []);

  return (
    <div>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="animated-title">Find Your Perfect Companion</h1>
            <p className="animated-subtitle">Adopt a pet and give them a forever home</p>
            <div className="hero-features">
              <div className="feature-card">
                <i className="fas fa-paw feature-icon"></i>
                <h3>Adopt</h3>
                <p>Find your perfect furry friend</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-heart feature-icon"></i>
                <h3>Care</h3>
                <p>Professional pet care services</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-home feature-icon"></i>
                <h3>Shelter</h3>
                <p>Support local animal shelters</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
