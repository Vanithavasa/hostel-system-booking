import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/college.scss";

function College({ user }) {
  const navigate = useNavigate();
  const [about, setAbout] = useState("");

  useEffect(() => {
    if (!user || !user.college) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:4000/api/colleges/${user.college}/info`)
      .then(res => res.json())
      .then(data => {
        setAbout(data.about?.description || "");
      })
      .catch(() => navigate("/home"));
  }, [user, navigate]);

  return (
    <div className="college-page">
      <div className="college-container">
        <h2>{user.college.toUpperCase()}</h2>

        <div className="college-about">
          <h3>About College</h3>
          {about ? <p>{about}</p> : <p>No details provided.</p>}
        </div>
      </div>
    </div>
  );
}

export default College;
