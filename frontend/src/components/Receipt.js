import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/receipt.scss";

function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="receipt-page">
        <div className="receipt">
          <h2>No Booking Found</h2>
          <button onClick={() => navigate("/home")}>
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const bookingDate = new Date().toLocaleDateString();
  const transactionId = "TXN" + Math.floor(Math.random() * 1000000);

  return (
    <div className="receipt-page">
      <div className="receipt">

        <div className="receipt-header">
          <h2>Hostel Booking Receipt</h2>
          <span className="paid-stamp">PAID</span>
        </div>

        <div className="receipt-meta">
          <p><strong>Date:</strong> {bookingDate}</p>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
        </div>

        <div className="receipt-details">
          <p><strong>Student:</strong> {booking.name}</p>
          <p><strong>Rank:</strong> {booking.rank}</p>
          <p><strong>Hostel:</strong> {booking.hostel}</p>
          <p><strong>Room:</strong> {booking.roomNo}</p>
          <p><strong>Bed:</strong> {booking.bedId}</p>
        </div>

        <button onClick={() => window.print()}>
          Print Receipt
        </button>

      </div>
    </div>
  );
}

export default Receipt;