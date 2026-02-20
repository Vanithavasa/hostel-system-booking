import React, { useEffect, useState } from "react";
import "../styles/adminDashboard.scss";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [newStudent, setNewStudent] = useState({
    rank: "",
    name: "",
    branch: ""
  });

  const token = localStorage.getItem("adminToken");
  const college = localStorage.getItem("adminCollege");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/colleges/${college}/info`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch dashboard data");
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (college && token) {
      fetchData();
    }
  }, [college, token]);

  /* ================= ADD STUDENT ================= */

  const addStudent = async () => {
    if (!newStudent.rank || !newStudent.name || !newStudent.branch) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/admin/student/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            college: college,
            rank: newStudent.rank,
            name: newStudent.name,
            branch: newStudent.branch
          })
        }
      );

      if (!res.ok) {
        alert("Failed to add student");
        return;
      }

      setNewStudent({ rank: "", name: "", branch: "" });

      // Refresh data
      const updated = await fetch(
        `http://localhost:4000/api/colleges/${college}/info`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const json = await updated.json();
      setData(json);

    } catch (err) {
      console.error("Add student error:", err);
    }
  };

  /* ================= REMOVE STUDENT ================= */

  const removeStudent = async (rank) => {
    try {
      await fetch(
        `http://localhost:4000/api/admin/student/${rank}?college=${college}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh
      const updated = await fetch(
        `http://localhost:4000/api/colleges/${college}/info`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const json = await updated.json();
      setData(json);

    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  /* ================= CANCEL BOOKING ================= */

  const cancelBooking = async (rank) => {
    try {
      await fetch(
        `http://localhost:4000/api/admin/booking/${rank}?college=${college}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh
      const updated = await fetch(
        `http://localhost:4000/api/colleges/${college}/info`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const json = await updated.json();
      setData(json);

    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">

        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div className="stat-box">
            <h4>Total Students</h4>
            <p>{data.students?.length || 0}</p>
          </div>
          <div className="stat-box">
            <h4>Total Bookings</h4>
            <p>{data.bookings?.length || 0}</p>
          </div>
        </div>

        {/* ================= ADD STUDENT ================= */}
        <div className="dashboard-card">
          <h3>Add Student</h3>

          <div className="add-student-form">
            <input
              placeholder="Rank"
              value={newStudent.rank}
              onChange={(e) =>
                setNewStudent({ ...newStudent, rank: e.target.value })
              }
            />
            <input
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
            <input
              placeholder="Branch"
              value={newStudent.branch}
              onChange={(e) =>
                setNewStudent({ ...newStudent, branch: e.target.value })
              }
            />

            <button onClick={addStudent}>Add Student</button>
          </div>
        </div>

        {/* ================= STUDENTS ================= */}
        <div className="dashboard-card">
          <h3>Students</h3>
          <ul className="student-list">
            {data.students?.map((s, i) => (
              <li key={i}>
                {s.rank} - {s.name} - {s.branch} -{" "}
                {s.booked ? "Booked" : "Free"}

                <button
                  className="danger-btn"
                  onClick={() => removeStudent(s.rank)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ================= BOOKINGS ================= */}
        <div className="dashboard-card">
          <h3>Bookings</h3>
          <ul className="booking-list">
            {data.bookings?.map((b, i) => (
              <li key={i}>
                {b.rank} → {b.hostel} / Room {b.roomNo} / Bed {b.bedId}

                <button
                  className="danger-btn"
                  onClick={() => cancelBooking(b.rank)}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}