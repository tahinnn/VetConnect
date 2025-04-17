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

      // Temporarily assign role; later this can come from backend
      const userType = "Individual";
      localStorage.setItem("userType", userType);

      localStorage.setItem("token", response.data.token);
      alert("Google Login successful!");

      // Redirect based on role
      navigate(userType === "Shelter" ? "/shelter-dashboard" : "/user-dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Google Login Failed");
          alert("Google Login Failed");
        }}
        width="100%"
        theme="outline"
        size="large"
        shape="rectangular"
      />
    </div>
  );
};

const styles = {
  wrapper: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
  },
};

export default GoogleButton;
