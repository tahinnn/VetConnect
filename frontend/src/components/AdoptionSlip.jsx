import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdoptionSlip.css';

const AdoptionSlip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adoption, setAdoption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { adoptionId } = location.state || {};

  useEffect(() => {
    const fetchAdoption = async () => {
      if (!adoptionId) {
        setError('No adoption ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/adoptions/${adoptionId}`);
        setAdoption(response.data);
      } catch (error) {
        setError('Failed to fetch adoption details');
        console.error('Error fetching adoption:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoption();
  }, [adoptionId]);

  const handleDownload = async () => {
    try {
      window.open(`http://localhost:5000/api/adoptions/${adoptionId}/booking-slip`, '_blank');
    } catch (error) {
      setError('Failed to download booking slip');
      console.error('Error downloading slip:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!adoption) {
    return <div className="error-message">Adoption not found</div>;
  }

  return (
    <div className="adoption-slip-container">
      <div className="adoption-slip">
        <h1>🎉 Adoption Booking Successful!</h1>
        
        <div className="slip-content">
          <div className="section">
            <h2>Adoption Details</h2>
            <p><strong>Booking ID:</strong> {adoption._id}</p>
            <p><strong>Issue Date:</strong> {new Date(adoption.issuedDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {adoption.status.toUpperCase()}</p>
          </div>

          <div className="section">
            <h2>Pet Information</h2>
            <div className="pet-info">
              <img src={`http://localhost:5000${adoption.pet.image}`} alt={adoption.pet.name} />
              <div>
                <p><strong>Name:</strong> {adoption.pet.name}</p>
                <p><strong>Breed:</strong> {adoption.pet.breed}</p>
                <p><strong>Age:</strong> {adoption.pet.age} years</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Adopter Information</h2>
            <p><strong>Name:</strong> {adoption.name}</p>
            <p><strong>Phone:</strong> {adoption.phone}</p>
            <p><strong>Email:</strong> {adoption.email}</p>
            <p><strong>Address:</strong> {adoption.address}</p>
            <p><strong>Pick-up Type:</strong> {adoption.pickupType}</p>
          </div>

          <div className="section">
            <h2>Payment Information</h2>
            <p><strong>Payment Method:</strong> {adoption.paymentMethod.toUpperCase()}</p>
            <p><strong>Transaction Number:</strong> {adoption.transactionNumber}</p>
            <p><strong>Adoption Fee:</strong> ৳{adoption.adoptionFee}</p>
            <p><strong>Processing Fee:</strong> ৳{adoption.processingFee}</p>
            <p className="total"><strong>Total Amount Paid:</strong> ৳{adoption.totalAmount}</p>
          </div>
        </div>

        <div className="actions">
          <button onClick={handleDownload} className="download-button">
            Download Booking Slip
          </button>
          <button onClick={() => navigate('/pets')} className="back-button">
            Back to Pets
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptionSlip;
