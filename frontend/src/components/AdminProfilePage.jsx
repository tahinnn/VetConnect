import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfilePage.css"; // Reuse styles

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
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || !token) {
      alert("Admin not logged in.");
      setLoading(false);
      return;
    }

    // Fetch admin profile
    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { name, email } = res.data;
        setAdminData((prev) => ({ ...prev, name, email }));
      })
      .catch((err) => {
        console.error("Error fetching admin profile:", err);
        alert("Failed to load admin profile.");
      });

    // Fetch all users
    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Failed to load users:", err);
      });

    // Fetch all pets
    axios
      .get("http://localhost:5000/api/admin/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPets(res.data))
      .catch((err) => {
        console.error("Failed to load pets:", err);
      })
      .finally(() => setLoading(false));
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { newPassword, confirmPassword, name } = adminData;
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!userId || !token) {
      alert("Admin not logged in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/auth/update-profile/${userId}`,
        {
          name,
          newPassword: newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Admin profile updated successfully!");
      setAdminData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
    } catch (err) {
      console.error("Error updating admin profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading admin profile...</p>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        <h2>Admin Profile</h2>
        <ul>
          <li className={activeTab === "adminInfo" ? "active" : ""} onClick={() => setActiveTab("adminInfo")}>👤 Admin Info</li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>👥 Users</li>
          <li className={activeTab === "pets" ? "active" : ""} onClick={() => setActiveTab("pets")}>🐾 Pets</li>
        </ul>
      </div>

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

        {activeTab === "users" && (
          <>
            <h3 className="section-title">All Users</h3>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <ul>
                {users.map((user) => (
                  <li key={user._id}>
                    {user.name} - {user.email} - Role: {user.role}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {activeTab === "pets" && (
          <>
            <h3 className="section-title">All Pets</h3>
            {pets.length === 0 ? (
              <p>No pets found.</p>
            ) : (
              <ul>
                {pets.map((pet) => (
                  <li key={pet._id}>
                    {pet.name} - {pet.type} - Shelter: {pet.shelterName}
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

export default AdminProfilePage;
