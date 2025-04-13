import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email } = decoded;

      const response = await axios.post("http://localhost:5000/api/auth/google-login", {
        name,
        email,
      });

      localStorage.setItem("token", response.data.token);
      alert("Google Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        console.log("Google Login Failed");
        alert("Google Login Failed");
      }}
    />
  );
};

export default GoogleButton;
