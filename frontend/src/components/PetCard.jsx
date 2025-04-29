import React from "react";
import "./PetCard.css";

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      {/* Using the image URL from the backend */}
      <img 
        src={`http://localhost:5000${pet.image}`}
        alt={pet.name} 
        className="pet-image" 
      />
      <div className="pet-details">
        <h3 className="pet-name">{pet.name.toUpperCase()}</h3> {/* Pet name in uppercase */}
        <p><strong>Pet Type:</strong> {pet.type}</p> {/* Display Pet Type */}
        <p><strong>Breed:</strong> {pet.breed}</p> {/* Display breed */}
        <p><strong>Age:</strong> {pet.age} Years</p>
        <p><strong>Status:</strong>  {pet.status}</p>
        <p><strong>Location:</strong> {pet.location}</p>
        <p><strong>Amount:</strong> Tk {pet.amount?.toLocaleString()}</p> {/* Amount displayed as currency */}

        <div className="button-wrapper">
          <button className="adopt-btn">Adopt Me</button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
