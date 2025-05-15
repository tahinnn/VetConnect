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
      const { name: userName, email } = decoded;

      console.log("Google user:", { userName, email });

      const response = await axios.post("http://localhost:5000/api/auth/google-login", {
        name: userName,
        email,
      });

      const { token, userType, userId } = response.data;

      if (!userId || !token || !userType) {
        alert("Something went wrong during Google login.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("email", email);

      console.log("Stored userId:", userId);
      console.log("UserType:", userType);

      if (userType === "Pending") {
        setTimeout(() => {
          navigate("/select-user-type");
        }, 50);
      } else {
        window.location.href = "/";
      }
      window.dispatchEvent(new Event("closeModals"));

    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message || err);
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
