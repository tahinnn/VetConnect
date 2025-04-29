import GoogleButton from "./GoogleButton";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "Pending",
  });

  const { name, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, register user
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      const { userId } = response.data;
      if (!userId) {
        alert("Registration failed, please try again.");
        return;
      }

      // ✅ Set userId temporarily to localStorage
      localStorage.setItem("userId", userId);

      // ✅ Automatically login after registration
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const { token, userType } = loginResponse.data;
      if (!token) {
        alert("Auto-login failed, please login manually.");
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);

      // ✅ Redirect to User Type Selection
      navigate("/select-user-type");

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Registration/Login failed!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="modal-form">
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="modal-input"
        />
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
        <button type="submit" className="modal-button">Register</button>
      </form>
      <div className="divider">or</div>
      <GoogleButton />
    </div>
  );
};

export default Register;
