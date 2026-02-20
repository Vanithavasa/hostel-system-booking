import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.scss";

export default function Login({ setUser }) {
  const [college, setCollege] = useState("");
  const [rank, setRank] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setErr("");

    if (!college || !rank || !password) {
      setErr("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college, rank, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Login failed");
        return;
      }

      const userData = {
        rank: data.student.rank,
        name: data.student.name,
        college: college.toLowerCase()
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/home");

    } catch {
      setErr("Server unavailable. Try again later.");
    }
  };

  return (
    <div className="login-page">

      {/* Background Layers */}
      <div className="bg-slide bg1"></div>
      <div className="bg-slide bg2"></div>

      <div className="login-wrapper">

        <div className="login-info">
          <h1>Student Login Portal</h1>
          <p>
            Login using your college rank and securely access your dashboard.
          </p>
        </div>

        <div className="login-card">
          <h2>Student Login</h2>

          <form onSubmit={login}>
            <input
              placeholder="College name"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
            <input
              placeholder="Rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
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

          <div className="divider" />

          <div className="register-redirect">
            <p>Are you a college administrator?</p>

            <div className="admin-buttons">
              <button onClick={() => navigate("/admin-login")}>
                Admin Login
              </button>

              <button onClick={() => navigate("/signup-college")}>
                Register College
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/login.scss";

// export default function Login({ setUser }) {
//   const [college, setCollege] = useState("");
//   const [rank, setRank] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const navigate = useNavigate();

//   const login = async (e) => {
//     e.preventDefault();
//     setErr("");

//     if (!college || !rank || !password) {
//       setErr("All fields are required");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ college, rank, password })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setErr(data.error || "Login failed");
//         return;
//       }

//       const userData = {
//         rank: data.student.rank,
//         name: data.student.name,
//         college: college.toLowerCase()
//       };

//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//       navigate("/home");

//     } catch {
//       setErr("Server unavailable. Try again later.");
//     }
//   };

//   return (
//     <div className="login-page">

//       {/* 🔥 Background Slides */}
//       <div className="background-slide bg1"></div>
//       <div className="background-slide bg2"></div>

//       <div className="login-wrapper">

//         <div className="login-info">
//           <h1>Student Login Portal</h1>
//           <p>
//             Login using your college rank and securely access your dashboard.
//           </p>
//         </div>

//         <div className="login-card">
//           <h2>Student Login</h2>

//           <form onSubmit={login}>
//             <input
//               placeholder="College name"
//               value={college}
//               onChange={(e) => setCollege(e.target.value)}
//             />
//             <input
//               placeholder="Rank"
//               value={rank}
//               onChange={(e) => setRank(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button type="submit">Login</button>
//           </form>

//           {err && <p className="error">{err}</p>}

//           <div className="divider" />

//           <div className="register-redirect">
//             <p>Are you a college administrator?</p>

//             <div className="admin-buttons">
//   <button onClick={() => navigate("/admin-login")}>
//     Admin Login
//   </button>

//   <button onClick={() => navigate("/signup-college")}>
//     Register College
//   </button>
// </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }