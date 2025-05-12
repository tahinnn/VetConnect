import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PetDetailPage.css";

const PetDetailPage = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [adoptionStatus, setAdoptionStatus] = useState("idle");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        console.error("Failed to fetch pet details", err);
      }
    };

    const checkStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/adoptions/status", {
          params: { userId, petId },
        });
        if (res.data.status === "sent") setAdoptionStatus("sent");
        else if (res.data.status === "rejected") setAdoptionStatus("rejected");
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    fetchPet();
    if (userId) checkStatus();
  }, [petId, userId]);

  const handleAdoptRequest = async () => {
    try {
      await axios.post("http://localhost:5000/api/adoptions/request", {
        petId,
        requesterId: userId,
      });
      setAdoptionStatus("sent");
      alert("Adoption request sent to seller.");
    } catch (err) {
      console.error("Adoption request failed:", err);
      alert(err.response?.data?.msg || "You cannot request this pet.");
    }
  };

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="pet-detail-page">
      <div className="left-section">
        <h2 className="pet-title">{pet.name.toUpperCase()} | {pet.type.toUpperCase()}</h2>
        <img src={`http://localhost:5000${pet.image}`} alt={pet.name} className="pet-main-img" />
        <div className="pet-info">
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age:</strong> {pet.age} years</p>
          <p><strong>Gender:</strong> {pet.gender}</p>
          <p><strong>Location:</strong> {pet.location}</p>
        </div>
        <div className="pet-description">
          <h4>Description</h4>
          <p>{pet.description}</p>
        </div>
      </div>

      <div className="right-section">
        <h4 className="price">Tk {pet.amount?.toLocaleString()}</h4>
        <hr />
        <p><strong>Seller:</strong> {pet.owner?.userType === "Shelter" ? pet.owner?.shelterName : pet.owner?.name}</p>
        <p><strong>Phone:</strong> {pet.phone}</p>
        <button
          className={`adopt-btn ${adoptionStatus !== "idle" ? "disabled" : ""}`}
          onClick={handleAdoptRequest}
          disabled={adoptionStatus === "sent" || adoptionStatus === "rejected"}
        >
          {adoptionStatus === "sent" ? "Request Sent" :
            adoptionStatus === "rejected" ? "Request Rejected" : "Adopt This Pet"}
        </button>
      </div>
    </div>
  );
};

export default PetDetailPage;
