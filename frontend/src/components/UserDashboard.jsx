// src/components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfilePage.css"; // Reuse styling

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/adoption/user/${userId}`)
      .then(res => setRequests(res.data))
      .catch(err => console.error("Failed to fetch adoption requests", err));
  }, []);

  const handleDecision = async (requestId, decision) => {
    try {
      await axios.put(`http://localhost:5000/api/adoption/${requestId}/decision`, {
        decision
      });
      alert(`Request ${decision === "approved" ? "Approved" : "Rejected"}`);
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      console.error("Decision error:", err);
      alert("Failed to update request.");
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            🐾 View Adoption Requests
          </li>
        </ul>
      </div>

      <div className="main-profile-content">
        {activeTab === "requests" && (
          <>
            <h3 className="section-title">Adoption Requests</h3>
            {requests.length === 0 ? (
              <p>No adoption requests received.</p>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="form-group">
                  <p><strong>From:</strong> {req.fromUser?.name || "Unknown"}</p>
                  <p><strong>Pet:</strong> {req.pet?.name}</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="save-btn" onClick={() => handleDecision(req._id, "approved")}>Approve</button>
                    <button
                      className="save-btn"
                      style={{ backgroundColor: "#e11d48" }}
                      onClick={() => handleDecision(req._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
