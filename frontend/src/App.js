import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import UserTypeSelect from "./components/UserTypeSelect";
import UserDashboard from "./components/UserDashboard";
import ShelterDashboard from "./components/ShelterDashboard";
import AdminDashboard from './components/AdminDashboard';
import { GoogleOAuthProvider } from "@react-oauth/google";

// Google Client ID
const clientId = "230127747685-97hkrk2841dsf2l0fvo9gb3tnmj44let.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div>
          <h1>VetConnect</h1>
          <nav>
            <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
          </nav>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select-user-type" element={<UserTypeSelect />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Admin Dashboard Route */}
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
