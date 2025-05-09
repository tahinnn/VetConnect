import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, petRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/admin/users", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/auth/admin/pets", {
            headers: { "x-auth-token": token },
          }),
        ]);
        setUsers(userRes.data);
        setPets(petRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Admin fetch error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const banUser = async (userId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/admin/ban-user/${userId}`, {}, {
        headers: { "x-auth-token": token },
      });
      alert("User banned");
      setUsers((prev) => prev.map(u => u._id === userId ? res.data.user : u));
    } catch (err) {
      alert("Failed to ban user");
    }
  };

  const approvePet = async (petId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/admin/approve-pet/${petId}`, {}, {
        headers: { "x-auth-token": token },
      });
      alert("Pet approved");
      setPets((prev) => prev.map(p => p._id === petId ? res.data.pet : p));
    } catch (err) {
      alert("Failed to approve pet");
    }
  };

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <div className="admin-profile-container">
      <h2>🔐 Admin Profile</h2>

      <div className="admin-section">
        <h3>👥 All Users</h3>
        {users.length === 0 ? <p>No users found</p> : (
          <ul>
            {users.map(user => (
              <li key={user._id}>
                {user.name} ({user.userType}) - {user.email}
                {user.isBanned ? <span className="banned"> (Banned)</span> : (
                  <button onClick={() => banUser(user._id)}>Ban</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="admin-section">
        <h3>🐾 All Pet Listings</h3>
        {pets.length === 0 ? <p>No pets found</p> : (
          <ul>
            {pets.map(pet => (
              <li key={pet._id}>
                {pet.name} - {pet.breed} - {pet.status}
                {!pet.isApproved && (
                  <button onClick={() => approvePet(pet._id)}>Approve</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
