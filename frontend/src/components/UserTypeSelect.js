import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserTypeSelect = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(""); // Store selected userType

  const handleSelection = async (type) => {
    // Get the userId from localStorage (saved after registration)
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID not found. Please register first.");
      return;
    }

    try {
      // Make PUT request to update userType in the backend
      const response = await axios.put(`http://localhost:5000/api/auth/update-user-type/${userId}`, { userType: type });
      console.log("User type updated:", response.data);

      // Save the userType in localStorage for use later
      localStorage.setItem("userType", type);


      // Redirect to the appropriate dashboard
      if (type === "Shelter") {
        navigate("/shelter-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Error updating user type:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Tell us who you are</h2>
        <p style={styles.subtitle}>This helps us customize your experience.</p>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => handleSelection("Shelter")}>
            I’m a Shelter
          </button>
          <button style={styles.button} onClick={() => handleSelection("User")}>
            I’m an Individual
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "400px",
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    color: "#333",
  },
  subtitle: {
    marginBottom: "30px",
    fontSize: "16px",
    color: "#666",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2196f3",
    color: "#ffffff",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default UserTypeSelect;
