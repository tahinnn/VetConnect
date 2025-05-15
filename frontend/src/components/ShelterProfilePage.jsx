import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShelterProfilePage.css";

const ShelterProfilePage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [imageFile, setImageFile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    shelterName: "",
    shelterLocation: "",
    petTypes: "",
    newPassword: "",
    confirmPassword: ""
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
        const { email, shelterName, shelterLocation, petTypes } = res.data;
        setFormData(prev => ({ ...prev, email, shelterName, shelterLocation, petTypes }));
      } catch (err) {
        console.error("Failed to fetch shelter profile:", err);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    const { shelterName, shelterLocation, petTypes, newPassword, confirmPassword } = formData;

    if (!shelterName.trim() || !shelterLocation.trim() || !petTypes.trim()) {
      alert("Please fill in all required fields before saving.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords don’t match");
      return;
    }

    try {
      const payload = {
        shelterName: shelterName.trim(),
        shelterLocation: shelterLocation.trim(),
        petTypes: petTypes.trim(),
        newPassword: newPassword?.trim()
      };

      await axios.put(`http://localhost:5000/api/auth/update-shelter-profile/${userId}`, payload);

      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);

        const uploadRes = await axios.put(
          `http://localhost:5000/api/auth/shelter/upload-image/${userId}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadedUrl = uploadRes.data?.shelterImage;
        if (uploadedUrl) {
          localStorage.setItem("shelterImage", uploadedUrl);
        }
      }

      localStorage.setItem("shelterName", shelterName);
      localStorage.setItem("shelterLocation", shelterLocation);
      localStorage.setItem("petTypes", petTypes);

      alert("Shelter profile updated successfully!");
    } catch (err) {
      console.error("Error saving shelter profile:", err);
      alert("Error saving changes.");
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <h2>Shelter Profile</h2>
        <ul>
          <li className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>🏠 Shelter Info</li>
          <li className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>❤️ Favorites</li>
          <li className={activeTab === "chats" ? "active" : ""} onClick={() => setActiveTab("chats")}>💬 Chats</li>
          <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>🔔 Notifications</li>
        </ul>
      </div>

      <div className="main-profile-content">
        {activeTab === "info" && (
          <>
            <h3 className="section-title">Shelter Info</h3>
            <div className="form-group">
              <label>Shelter Name</label>
              <input type="text" name="shelterName" value={formData.shelterName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} readOnly />
            </div>
            <div className="form-group">
              <label>Shelter Location</label>
              <input type="text" name="shelterLocation" value={formData.shelterLocation} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pet Types</label>
              <select name="petTypes" value={formData.petTypes} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Upload Shelter Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </>
        )}

        {activeTab === "favorites" && <p>❤️ Favorite listings for shelter.</p>}
        {activeTab === "chats" && <p>💬 Chat history with users appears here.</p>}
        
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

export default ShelterProfilePage;
