import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdoptionPayment.css';

const AdoptionPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adoptionData = location.state?.adoptionData;
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!adoptionData) {
    return <div className="error-message">No adoption data found.</div>;
  }

  // Calculate fees
  const adoptionFee = adoptionData.pet.adoptionFee || 1000; // Default to 1000৳ if not specified
  const processingFee = 250;
  const totalAmount = adoptionFee + processingFee;

  const validateTransactionNumber = (number) => {
    return /^\d{11}$/.test(number);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateTransactionNumber(transactionNumber)) {
      setError('Transaction number must be exactly 11 digits');
      return;
    }

    setIsProcessing(true);

    try {
      // Add payment info to the adoption data
      const finalData = {
        ...adoptionData,
        ...adoptionData,
        paymentMethod,
        transactionNumber,
        adoptionFee,
        processingFee,
        totalAmount,
        paymentStatus: 'completed',
        issuedDate: new Date().toISOString()
      };

      // Save to MongoDB
      const response = await axios.post('http://localhost:5000/api/adoptions', finalData);
      
      // Navigate to slip page
      navigate('/adoption-slip', { 
        state: { 
          adoptionId: response.data._id,
          adoptionData: response.data
        } 
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error.response?.data?.error || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>🔒 Secure Payment</h1>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <p><strong>Pet Name:</strong> {adoptionData.pet.name}</p>
            <p><strong>Adoption Fee:</strong> ৳{adoptionFee}</p>
            <p><strong>Processing Fee:</strong> ৳{processingFee}</p>
            <p className="total"><strong>Total Amount:</strong> ৳{totalAmount}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label>Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="bkash">Bkash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
            </select>
          </div>

          <div className="form-group">
            <label>Transaction Number</label>
            <input 
              type="text" 
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              placeholder="Enter 11-digit transaction number" 
              required 
              pattern="\d{11}"
              maxLength="11"
            />
          </div>

          <button 
            type="submit" 
            className={`pay-button ${isProcessing ? 'processing' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed Next'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdoptionPayment;
