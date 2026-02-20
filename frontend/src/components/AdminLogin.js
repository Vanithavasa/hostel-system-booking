import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.scss";

export default function AdminLogin({ setAdminToken }) {
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setErr("");

    if (!college || !password) {
      setErr("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Login failed");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminCollege", college.toLowerCase());

      setAdminToken(data.token); // IMPORTANT for re-render
      navigate("/admin-dashboard");

    } catch {
      setErr("Server error. Try again.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        <form onSubmit={login}>
          <input
            placeholder="College name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {err && <p className="error">{err}</p>}
      </div>
    </div>
  );
}