import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PetCard.css";

const PetCard = ({ pet }) => {
  const [requestSent, setRequestSent] = useState(pet.requested || false);
  const isShelterListing = pet?.owner?.userType === "Shelter";

  const handleAdopt = async (e) => {
    e.preventDefault(); // prevent navigation
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login to send an adoption request.");

    try {
      await axios.post("http://localhost:5000/api/adoptions/request", {
        petId: pet._id,
        requesterId: userId,
      });
      alert("Adoption request sent to seller.");
      setRequestSent(true);
    } catch (err) {
      console.error("Adoption request error:", err);
      alert(err.response?.data?.msg || "Failed to send adoption request.");
    }
  };

  return (
    <Link to={`/pets/${pet._id}`} className="pet-card-link">
      <div className="pet-card">
        <div className="image-container">
          <img src={`http://localhost:5000${pet.image}`} alt={pet.name} className="pet-image" />
          {isShelterListing && (
            <div className="verified-badge" title={`${pet.owner?.shelterName}, ${pet.owner?.shelterLocation}`}>✅</div>
          )}
        </div>
        <div className="pet-details">
          <h3 className="pet-name">{pet.name?.toUpperCase()}</h3>
          <p><strong>Pet Type:</strong> {pet.type}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age:</strong> {pet.age} Years</p>
          <p><strong>Status:</strong> {pet.status}</p>
          <p><strong>Location:</strong> {pet.location}</p>
          <p><strong>Amount:</strong> Tk {pet.amount?.toLocaleString()}</p>

          <div className="button-wrapper">
            <button
              className="adopt-btn"
              onClick={handleAdopt}
              disabled={requestSent}
              style={{ backgroundColor: requestSent ? "red" : "" }}
            >
              {requestSent ? "Request Sent" : "Adopt Me"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;
