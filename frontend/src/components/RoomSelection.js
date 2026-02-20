import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/roomSelection.scss";

export default function RoomSelection() {
  const { hostelName } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:4000/api/colleges/${user.college}/info`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.hostels) return;

        const hostel = data.hostels.find(
          (h) => h.name.toLowerCase() === hostelName.toLowerCase()
        );

        setRooms(hostel?.rooms || []);
      })
      .catch(() => setRooms([]));
  }, [hostelName, navigate, user]);

  return (
    <div className="room-page">
      <h2>{hostelName} – Select Room</h2>

      <div className="room-list">
        {rooms.length === 0 && (
          <p className="empty-text">No rooms found</p>
        )}

        {rooms.map((r, i) => (
          <div
            key={i}
            className="room-card"
            onClick={() =>
              navigate(`/beds/${hostelName}/${r.roomNo}`)
            }
          >
            Room {r.roomNo}
          </div>
        ))}
      </div>
    </div>
  );
}
