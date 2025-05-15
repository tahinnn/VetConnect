import React, { useState } from "react";
import axios from "axios";
import GoogleButton from "./GoogleButton";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting login...'); // Debug log
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
        formData
      );

      console.log('Login response:', response.data); // Debug log

      const { token, userType, userId, name: userName, email: userEmail } = response.data;

      // Store user data with consistent casing
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType.toLowerCase()); // Store in lowercase
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", userEmail);

      // Configure axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Close the modal
      window.dispatchEvent(new CustomEvent('closeModals'));
      
      // Navigate based on user type (case-insensitive comparison)
      switch(userType.toLowerCase()) {
        case 'admin':
          navigate("/admin-dashboard");
          break;
        case 'shelter':
          navigate("/shelter-dashboard");
          break;
        default:
          navigate("/user-dashboard");
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      const errorMsg = error.response?.data?.msg || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="google-login">
        <GoogleButton disabled={loading} />
      </div>
    </div>
  );
};

export default Login;
