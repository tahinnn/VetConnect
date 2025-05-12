import React, { useState } from "react";
import axios from "axios";
import GoogleButton from "./GoogleButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      const { token, userType, userId } = response.data;

      // Optional: you may want to fetch profile here to get userName/email
      const profileRes = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
      const { name, email: profileEmail } = profileRes.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", name);
      localStorage.setItem("email", profileEmail);

      alert("Login successful!");
      window.location.href = "/";
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Password not set. Please sign in with Google.");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="modal-form">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="modal-input"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="modal-input"
        />
        <button type="submit" className="modal-button">Login</button>
      </form>
      <div className="divider">or</div>
      <GoogleButton />
    </div>
  );
};

export default Login;
