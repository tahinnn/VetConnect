import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserTypeSelect from "./components/UserTypeSelect";
import UserDashboard from "./components/UserDashboard";
import ShelterDashboard from "./components/ShelterDashboard";
import AdminDashboard from './components/AdminDashboard';
import { GoogleOAuthProvider } from "@react-oauth/google";

// Import styles
import './styles.css';

// Google Client ID
const clientId = "230127747685-97hkrk2841dsf2l0fvo9gb3tnmj44let.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-user-type" element={<UserTypeSelect />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
