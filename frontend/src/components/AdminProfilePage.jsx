import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfilePage.css"; // Reuse existing styles

const AdminProfilePage = () => {
  const [activeTab, setActiveTab] = useState("adminInfo");
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load admin profile info
    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {
        const { name, email } = res.data;
        setAdminData((prev) => ({ ...prev, name, email }));
      })
      .catch((err) => {
        console.error("Failed to fetch admin profile:", err);
        alert("Error loading admin data");
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { name, newPassword, confirmPassword } = adminData;

    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords don’t match");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/auth/update-profile/${userId}`, {
        name,
        newPassword,
      });

      alert("Admin profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update admin profile");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/users", {
        headers: { "x-auth-token": token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Error loading users");
    }
  };

  const handleBanToggle = async (id, isBanned) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/admin/ban-user/${id}`,
        {},
        {
          headers: { "x-auth-token": token },
        }
      );
      loadUsers();
    } catch (err) {
      console.error("Ban toggle failed:", err);
      alert("Failed to update user status");
    }
  };

  const loadPets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/pets", {
        headers: { "x-auth-token": token },
      });
      setPets(res.data);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      alert("Error loading listings");
    }
  };

  const handleDeleteListing = async (petId) => {
    try {
      await axios.delete(`http://localhost:5000/api/pets/${petId}`, {
        headers: { "x-auth-token": token },
      });
      loadPets();
      alert("Listing deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete listing");
    }
  };

  useEffect(() => {
    if (activeTab === "allUsers") loadUsers();
    if (activeTab === "allListings") loadPets();
  }, [activeTab]);

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Profile</h2>
        <ul>
          <li className={activeTab === "adminInfo" ? "active" : ""} onClick={() => setActiveTab("adminInfo")}>🧑‍💼 Admin Info</li>
          <li className={activeTab === "allUsers" ? "active" : ""} onClick={() => setActiveTab("allUsers")}>👥 Show All Users</li>
          <li className={activeTab === "allListings" ? "active" : ""} onClick={() => setActiveTab("allListings")}>📋 Show All Listings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-profile-content">
        {activeTab === "adminInfo" && (
          <>
            <h3 className="section-title">Admin Info</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={adminData.name} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Email (read-only)</label>
              <input type="email" value={adminData.email} readOnly />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={adminData.newPassword} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={adminData.confirmPassword} onChange={handleInputChange} />
            </div>

            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </>
        )}

        {activeTab === "allUsers" && (
          <>
            <h3 className="section-title">All Users</h3>
            {users.map((user) => (
              <div key={user._id} className="form-group" style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Type:</strong> {user.userType}</p>
                <p><strong>Banned:</strong> {user.isBanned ? "Yes" : "No"}</p>
                <button
                  className="save-btn"
                  style={{
                    backgroundColor: user.isBanned ? "#3b82f6" : "#dc2626",
                  }}
                  onClick={() => handleBanToggle(user._id, user.isBanned)}
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === "allListings" && (
          <>
            <h3 className="section-title">All Listings</h3>
            {pets.map((pet) => (
              <div key={pet._id} className="form-group" style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                <p><strong>Name:</strong> {pet.name}</p>
                <p><strong>Type:</strong> {pet.type}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Owner:</strong> {pet.owner}</p>
                <button
                  className="save-btn"
                  style={{ backgroundColor: "#dc2626" }}
                  onClick={() => handleDeleteListing(pet._id)}
                >
                  Delete Listing
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
