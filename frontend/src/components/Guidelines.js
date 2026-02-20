import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/guidelines.scss";

function Guidelines({ user, setUser }) {
  const navigate = useNavigate();
  const [guidelines, setGuidelines] = useState([]);

  useEffect(() => {
    // 🔐 Guard: user/session missing
    if (!user || !user.college) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:4000/api/colleges/${user.college}/info`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d) => setGuidelines(d.guidelines || []))
      .catch(() => navigate("/home"));
  }, [user, navigate]);

  return (
    <div className="guidelines-container">
      <button
        onClick={() => {
          setUser(null);
          navigate("/");
        }}
      >
        Logout
      </button>

      <h2>Hostel Guidelines</h2>
      <ul>
        {guidelines.map((g, i) => (
          <li key={i}>{g}</li>
        ))}
      </ul>
    </div>
  );
}

export default Guidelines;
