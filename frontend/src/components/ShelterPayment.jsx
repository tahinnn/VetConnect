import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './ShelterPayment.css';

const ShelterPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentStep, setPaymentStep] = useState('confirm'); // confirm, payment, complete
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!location.state?.bookingData) {
      navigate('/shelters');
      return;
    }
    const data = location.state.bookingData;
    data.advancePayment = Math.ceil(data.totalCharge * 0.5);
    data.duePayment = data.totalCharge - data.advancePayment;
    setBookingData(data);
  }, [location.state, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking in database
      const formData = new FormData();
      Object.keys(bookingData).forEach(key => {
        if (key === 'petImage' && bookingData[key]) {
          formData.append('petImage', bookingData[key]);
        } else {
          formData.append(key, bookingData[key]);
        }
      });
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', 'TXN' + Date.now());

      const response = await fetch('http://localhost:5000/api/shelter-bookings', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setBookingData(result.booking);
        setPaymentStep('complete');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
      setPaymentStep('payment');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add header
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Booking Confirmation', pageWidth/2, 25, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Add content
    let y = 50;
    const addLine = (label, value) => {
      doc.text(`${label}: ${value}`, 20, y);
      y += 10;
    };

    addLine('Booking ID', bookingData._id);
    addLine('Shelter', bookingData.shelterName);
    addLine('Location', bookingData.shelterLocation);
    addLine('Pet Name', bookingData.petName);
    addLine('Breed', bookingData.breed);
    addLine('Days', bookingData.days);
    addLine('Total Charge', `৳${bookingData.totalCharge}`);
    addLine('Advance Paid', `৳${bookingData.advancePayment}`);
    addLine('Due Amount', `৳${bookingData.duePayment}`);
    addLine('Payment Status', 'Advance Payment Complete');
    addLine('Transaction ID', bookingData.transactionId);
    addLine('Booking Date', new Date(bookingData.bookingDate).toLocaleDateString());

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing our service!', pageWidth/2, 250, { align: 'center' });
    doc.text('Please bring this slip when dropping off your pet.', pageWidth/2, 260, { align: 'center' });

    // Save PDF
    doc.save('booking-confirmation.pdf');
  };

  if (!bookingData) return null;

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        {paymentStep === 'confirm' && (
          <>
            <h2 className="payment-title">
              <span className="paw-icon">🐾</span>
              Booking Summary
              <span className="paw-icon">🐾</span>
            </h2>
            <div className="booking-summary">
              <div className="summary-images">
                <div className="shelter-image">
                  <img src={bookingData.shelterImage} alt={bookingData.shelterName} />
                </div>
                {bookingData.petImage && (
                  <div className="pet-image">
                    <img src={URL.createObjectURL(bookingData.petImage)} alt={bookingData.petName} />
                  </div>
                )}
              </div>
              <div className="summary-details">
                <h3>{bookingData.shelterName}</h3>
                <p className="location">📍 {bookingData.shelterLocation}</p>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Pet Name:</label>
                    <span>{bookingData.petName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Breed:</label>
                    <span>{bookingData.breed}</span>
                  </div>
                  <div className="detail-item">
                    <label>Days:</label>
                    <span>{bookingData.days}</span>
                  </div>
                  <div className="detail-item">
                    <label>Vaccinated:</label>
                    <span>{bookingData.isVaccinated}</span>
                  </div>
                </div>
                <div className="price-summary">
                  <div className="price-item">
                    <label>Total Charge:</label>
                    <span>৳{bookingData.totalCharge}</span>
                  </div>
                  <div className="price-item highlight">
                    <label>Advance Payment (50%):</label>
                    <span>৳{bookingData.advancePayment}</span>
                  </div>
                  <div className="price-item">
                    <label>Due Payment:</label>
                    <span>৳{bookingData.duePayment}</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              className="proceed-button"
              onClick={() => setPaymentStep('payment')}
            >
              Proceed to Payment
              <span className="paw-print">🐾</span>
            </button>
          </>
        )}

        {paymentStep === 'payment' && (
          <>
            <h2 className="payment-title">
              <span className="paw-icon">🐾</span>
              Payment Details
              <span className="paw-icon">🐾</span>
            </h2>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="card-details">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                <div className="mobile-payment-info">
                  <p>Please send ৳{bookingData.advancePayment} to:</p>
                  <h3>01712345678</h3>
                  <p>After sending money, enter your transaction ID below:</p>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter Transaction ID"
                      required
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="pay-button">
                Pay ৳{bookingData.advancePayment}
                <span className="paw-print">🐾</span>
              </button>
            </form>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="processing-payment">
            <div className="spinner"></div>
            <h2>Processing Payment...</h2>
            <p>Please do not close this window</p>
          </div>
        )}

        {paymentStep === 'complete' && (
          <div className="payment-complete">
            <div className="success-animation">✓</div>
            <h2>Payment Successful!</h2>
            <div className="confirmation-details">
              <p>Booking ID: {bookingData._id}</p>
              <p>Transaction ID: {bookingData.transactionId}</p>
              <p>Amount Paid: ৳{bookingData.advancePayment}</p>
              <p>Due Amount: ৳{bookingData.duePayment}</p>
            </div>
            <button onClick={generatePDF} className="download-button">
              Download Booking Slip
              <span>📄</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterPayment;
