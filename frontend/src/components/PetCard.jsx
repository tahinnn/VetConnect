import React from "react";
import "./PetCard.css";

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <img src={pet.image} alt={pet.name} className="pet-image" />
      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p className="details">{pet.age} • {pet.breed}</p>
        <p className="location">Status: {pet.status}</p>
        <button className="adopt-btn">Adopt Me</button>
      </div>
    </div>
  );
};

export default PetCard;
