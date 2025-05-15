import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {
        const { name, email } = res.data;
        setUserData((prev) => ({ ...prev, name, email }));
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        alert("Error loading profile data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { newPassword, confirmPassword, name } = userData;
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/auth/update-profile/${userId}`, {
        name,
        newPassword: newPassword || undefined, // avoid sending empty string
      });
      alert("Profile updated successfully!");
      setUserData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" })); // clear passwords
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        <h2>User Profile</h2>
        <ul>
          <li className={activeTab === "userInfo" ? "active" : ""} onClick={() => setActiveTab("userInfo")}>👤 User Info</li>
          <li className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>❤️ Favorites</li>
          <li className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>💬 Chats</li>
          <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>🔔 Notifications</li>
        </ul>
      </div>

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
        {activeTab === "notifications" && <p>🔔 Your notifications will appear here.</p>}
      </div>
    </div>
  );
};

export default UserProfilePage;
