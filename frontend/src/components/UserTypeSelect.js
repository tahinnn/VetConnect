import React from "react";
import { useNavigate } from "react-router-dom";

const UserTypeSelect = () => {
  const navigate = useNavigate();

  const handleSelection = (type) => {
    // Save user type in localStorage or send to backend if needed
    localStorage.setItem("userType", type);
    alert(`You selected: ${type}`);
    navigate("/dashboard"); // redirect to dashboard or next step
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
          <button style={styles.button} onClick={() => handleSelection("Individual")}>
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
