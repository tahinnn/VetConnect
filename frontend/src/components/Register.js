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

  const [error, setError] = useState("");
  const { name, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("User registered successfully!");
      

      // Now login the user
      const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const { token, userId, name, email } = loginRes.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", name);
      localStorage.setItem("email", email);

      // Redirect to the user type selection page
      navigate("/select-user-type");

    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Registration or login failed!";
      alert(errorMsg);
      setError(errorMsg);
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
