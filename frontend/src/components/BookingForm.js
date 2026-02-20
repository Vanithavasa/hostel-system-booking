import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import "../styles/bookingForm.scss";

function BookingForm({ setUser }) {
  const navigate = useNavigate();
  const { hostelName, roomNo, bedId } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const [error, setError] = useState("");

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college: user.college,
          hostel: hostelName,
          roomNo,
          bedId,
          rank: user.rank
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking failed");
        return;
      }

      navigate("/receipt", {
        state: {
          booking: {
            hostel: hostelName,
            roomNo,
            bedId,
            rank: user.rank,
            name: user.name
          }
        }
      });

    } catch {
      setError("Server unavailable");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="page-container">
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} /> Logout
      </button>

      <div className="booking-form">
        <h2>Confirm Booking</h2>

        <div className="summary">
          <p><strong>Student:</strong> {user.name}</p>
          <p><strong>Rank:</strong> {user.rank}</p>
          <p><strong>Hostel:</strong> {hostelName}</p>
          <p><strong>Room:</strong> {roomNo}</p>
          <p><strong>Bed:</strong> {bedId}</p>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="confirm-btn" onClick={handleSubmit}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookingForm;
