import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Student Components
import Fees from "./components/Fees";
import Login from "./components/Login";
import Home from "./components/Home";
import HostelList from "./components/HostelList";
import RoomSelection from "./components/RoomSelection";
import BedSelection from "./components/BedSelection";
import BookingForm from "./components/BookingForm";
import Receipt from "./components/Receipt";
import SignupCollege from "./components/SignupCollege";
import Guidelines from "./components/Guidelines";
import College from "./components/College";

// Admin Components
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  // Student State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Admin State
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken")
  );

  const [currentBooking, setCurrentBooking] = useState(null);

  // ✅ Important Fix (Stable Login Check)
  const isStudentLoggedIn =
    user || JSON.parse(localStorage.getItem("user"));

  const isAdminLoggedIn =
    adminToken || localStorage.getItem("adminToken");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route path="/signup-college" element={<SignupCollege />} />

      <Route
        path="/fees"
        element={user ? <Fees /> : <Navigate to="/" />}
      />

      <Route
        path="/admin-login"
        element={<AdminLogin setAdminToken={setAdminToken} />}
      />

      {/* Student Protected Routes */}
      <Route
        path="/home"
        element={
          isStudentLoggedIn
            ? <Home user={isStudentLoggedIn} setUser={setUser} />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/guidelines"
        element={
          isStudentLoggedIn
            ? <Guidelines user={isStudentLoggedIn} setUser={setUser} />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/college"
        element={
          isStudentLoggedIn
            ? <College user={isStudentLoggedIn} />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/hostels"
        element={
          isStudentLoggedIn
            ? <HostelList />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/rooms/:hostelName"
        element={
          isStudentLoggedIn
            ? <RoomSelection />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/beds/:hostelName/:roomNo"
        element={
          isStudentLoggedIn
            ? <BedSelection />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/booking/:hostelName/:roomNo/:bedId"
        element={
          isStudentLoggedIn ? (
            <BookingForm
              setUser={setUser}
              setCurrentBooking={setCurrentBooking}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/receipt"
        element={
          isStudentLoggedIn ? (
            <Receipt currentBooking={currentBooking} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Admin Protected Route */}
      <Route
        path="/admin-dashboard"
        element={
          isAdminLoggedIn
            ? <AdminDashboard />
            : <Navigate to="/admin-login" />
        }
      />
    </Routes>
  );
}

export default App;


// import React, { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// // Student Components
// import Login from "./components/Login";
// import Home from "./components/Home";
// import HostelList from "./components/HostelList";
// import RoomSelection from "./components/RoomSelection";
// import BedSelection from "./components/BedSelection";
// import BookingForm from "./components/BookingForm";
// import Receipt from "./components/Receipt";
// import SignupCollege from "./components/SignupCollege";
// import Guidelines from "./components/Guidelines";
// import College from "./components/College";

// // Admin Components
// import AdminLogin from "./components/AdminLogin";
// import AdminDashboard from "./components/AdminDashboard";

// function App() {
//   // Student State
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });

//   // Admin State (IMPORTANT FIX)
//   const [adminToken, setAdminToken] = useState(
//     localStorage.getItem("adminToken")
//   );

//   const [currentBooking, setCurrentBooking] = useState(null);

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Login setUser={setUser} />} />
//       <Route path="/signup-college" element={<SignupCollege />} />

//       <Route
//         path="/admin-login"
//         element={<AdminLogin setAdminToken={setAdminToken} />}
//       />

//       {/* Student Protected Routes */}
//       <Route
//         path="/home"
//         element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/guidelines"
//         element={user ? <Guidelines user={user} setUser={setUser} /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/college"
//         element={user ? <College user={user} /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/hostels"
//         element={user ? <HostelList /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/rooms/:hostelName"
//         element={user ? <RoomSelection /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/beds/:hostelName/:roomNo"
//         element={user ? <BedSelection /> : <Navigate to="/" />}
//       />

//       <Route
//         path="/booking/:hostelName/:roomNo/:bedId"
//         element={
//           user ? (
//             <BookingForm
//               setUser={setUser}
//               setCurrentBooking={setCurrentBooking}
//             />
//           ) : (
//             <Navigate to="/" />
//           )
//         }
//       />

//       <Route
//         path="/receipt"
//         element={
//           user ? (
//             <Receipt currentBooking={currentBooking} />
//           ) : (
//             <Navigate to="/" />
//           )
//         }
//       />

//       {/* Admin Protected Route */}
//       <Route
//         path="/admin-dashboard"
//         element={
//           adminToken
//             ? <AdminDashboard />
//             : <Navigate to="/admin-login" />
//         }
//       />
//     </Routes>
//   );
// }

// export default App;