import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "../styles/home.scss";

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [collegeData, setCollegeData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  /* 🔹 FETCH COLLEGE DATA (INCLUDING ABOUT) */
  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/colleges/${user.college}/info`
        );
        const data = await res.json();
        setCollegeData(data);
      } catch (err) {
        console.log("Error fetching college info", err);
      }
    };

    if (user?.college) {
      fetchCollege();
    }
  }, [user]);

  return (
    <div className="home-container">

      {/* Header */}
      <div className="header">
        <p className="greeting">
          Hi! {user?.name} 👋{" "}
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            (Rank: {user?.rank})
          </span>
        </p>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <h2>Welcome to Hostel Booking</h2>

      {/* 🔷 TOP ROW */}
      <div className="top-row">

        <div className="card">
          <h3>Book Your Room</h3>
          <p>Reserve a hostel room for your stay</p>
          <button onClick={() => navigate("/hostels")}>
            Start Booking
          </button>
        </div>

        <div className="card">
          <h3>Fee Details</h3>
          <p>Check hostel and mess fee structure</p>
          <button onClick={() => navigate("/fees")}>
            View Fees
          </button>
        </div>

        <div className="card">
          <h3>Hostel Guidelines</h3>
          <p>Read hostel rules and booking policies</p>
          <button onClick={() => navigate("/guidelines")}>
            Read Guidelines
          </button>
        </div>

      </div>

      {/* 🔷 ABOUT COLLEGE SECTION */}
      <div className="about-section">
        <h3>About College</h3>

        {collegeData?.about && collegeData.about.length > 0 ? (
          <ul>
            {collegeData.about.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No information available.</p>
        )}
      </div>

    </div>
  );
}

export default Home;