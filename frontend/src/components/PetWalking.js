import React from 'react';
import './PetWalking.css';

const PetWalking = () => {
  return (
    <div className="construction-container">
      <div className="construction-content">
        <div className="construction-header">
          <span className="emoji">🚧</span>
          <h1>Pet Walking Service</h1>
          <span className="emoji">🚧</span>
        </div>
        
        <div className="coming-soon">
          <h2>🛠️Under Maintainence!!!!🛠️</h2>
          <div className="developer-tools">
            <span>⚙️</span>
            <span>🔧</span>
            <span>💻</span>
          </div>
        </div>

        <div className="construction-message">
          <p>Our development team is working hard to bring you the best pet walking experience!</p>
          
        </div>
       

        <div className="developer-team">
          <h3>🛠️ Our Development Team is Building Something Awesome! 🛠️</h3>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <p className="progress-text">Development Progress: 75%</p>
        </div>

       
        <div className="notification-signup">
          <h3>Get Notified When We Launch! 🎉</h3>
          <form className="signup-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Notify Me</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetWalking;