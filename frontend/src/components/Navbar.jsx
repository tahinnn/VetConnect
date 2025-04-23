import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional for styles

const Navbar = () => {
  return (
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
      </div>
      <div className="auth-buttons">
        <button className="btn-login">Login</button>
        <button className="btn-signup">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
