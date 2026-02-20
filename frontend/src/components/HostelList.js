import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hostelList.scss";

export default function HostelList() {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:4000/api/colleges/${user.college}/info`)
      .then((res) => res.json())
      .then((data) => setHostels(data.hostels || []))
      .catch(() => setHostels([]));
  }, [navigate, user]);

  return (
    <div className="hostel-page">
      <h2>Select a Hostel</h2>

      <div className="hostel-list">
        {hostels.length === 0 && (
          <p style={{ textAlign: "center", color: "#6b7280" }}>
            No hostels available
          </p>
        )}

        {hostels.map((h, i) => (
          <div
            key={i}
            className="hostel-card"
            onClick={() => navigate(`/rooms/${h.name}`)}
          >
            <h3>{h.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
