import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdoptionForm.css';

const AdoptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const pet = location.state?.pet;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pickupType: 'offline',

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // Add animation class to form elements after component mounts
    const formElements = document.querySelectorAll('.form-group');
    formElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, index * 100);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add success animation
      const form = document.querySelector('.adoption-form');
      form.classList.add('success');
      
      // Prepare adoption data
      const adoptionData = {
        ...formData,
        pet: {
          _id: pet._id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          image: pet.image
        },
        status: 'pending',
        submissionDate: new Date().toISOString()
      };

      // Navigate to payment page with adoption data
      setTimeout(() => {
        navigate('/adoption-payment', { state: { adoptionData } });
      }, 1000);

    } catch (error) {
      console.error('Error processing adoption form:', error);
      // Add error shake animation
      const form = document.querySelector('.adoption-form');
      form.classList.add('error');
      setTimeout(() => form.classList.remove('error'), 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pet) {
    return <div className="error-message">No pet information found.</div>;
  }

  return (
    <div className="adoption-form-container">
      <h1>🐾 Adoption Application</h1>
      <div className="pet-summary">
        <img src={`http://localhost:5000${pet.image}`} alt={pet.name} className="pet-preview" />
        <div className="pet-info">
          <h2>{pet.name}</h2>
          <p>{pet.breed} • {pet.age} years old</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="adoption-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pickupType">Pick-up Type</label>
          <select
            id="pickupType"
            name="pickupType"
            value={formData.pickupType}
            onChange={handleInputChange}
            required
          >
            <option value="offline">Offline</option>
            <option value="online">Online (Home Delivery)</option>
          </select>
        </div>



        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Book for Adoption'}
        </button>
      </form>
    </div>
  );
};

export default AdoptionForm;
