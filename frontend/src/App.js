import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Using Routes instead of Switch
import Register from "./components/Register";  // For Register
import Login from "./components/Login";  // For Login

function App() {
  return (
    <Router>
      <div>
        <h1>VetConnect</h1>
        <nav>
          {/* Links to navigate between Register and Login */}
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </nav>
        <Routes> {/* Updated to use Routes */}
          {/* Define routes for Register and Login */}
          <Route path="/register" element={<Register />} /> {/* Register route */}
          <Route path="/login" element={<Login />} /> {/* Login route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
