import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [notifications, setNotifications] = useState([]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
        const { name, email } = res.data;
        setUserData(prev => ({ ...prev, name, email }));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        alert("Error loading profile data");
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/adoptions/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchProfile();
    fetchNotifications();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    const { newPassword, confirmPassword, name } = userData;
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/auth/update-profile/${userId}`, {
        name,
        newPassword,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>User Profile</h2>
        <ul>
          <li className={activeTab === "userInfo" ? "active" : ""} onClick={() => setActiveTab("userInfo")}>👤 User Info</li>
          <li className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>❤️ Favorites</li>
          <li className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>💬 Chats</li>
          <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>🔔 Notifications</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-profile-content">
        {activeTab === "userInfo" && (
          <>
            <h3 className="section-title">User Info</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={userData.name} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Email (read-only)</label>
              <input type="email" name="email" value={userData.email} readOnly />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={userData.newPassword} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleInputChange} />
            </div>

            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </>
        )}

        {activeTab === "favorites" && <p>❤️ Your favorite listings will appear here.</p>}
        {activeTab === "chats" && <p>💬 Your previous chats will appear here.</p>}

        {activeTab === "notifications" && (
          <>
            <h3 className="section-title">🔔 Notifications</h3>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              <ul>
                {notifications.map((note, i) => (
                  <li key={i} style={{ marginBottom: "12px" }}>
                    {note.message}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
