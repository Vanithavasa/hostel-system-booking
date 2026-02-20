import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import "../styles/bedSelection.scss";

function BedSelection({ setUser }) {
  const navigate = useNavigate();
  const { hostelName, roomNo } = useParams();

  const [beds, setBeds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:4000/api/colleges/${user.college}/info`)
      .then((res) => res.json())
      .then((data) => {
        const hostel = data.hostels.find(h => h.name === hostelName);
        const room = hostel?.rooms.find(r => r.roomNo === roomNo);
        setBeds(room?.beds || []);
      });
  }, [hostelName, roomNo, navigate, user]);

  const handleBedClick = (bed) => {
    if (bed.status === "BOOKED") return;

    navigate(`/booking/${hostelName}/${roomNo}/${bed.bedId}`);
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

      <div className="bedSelection-container">
        <h2>
          Hostel {hostelName} – Room {roomNo}
        </h2>

        <div className="beds-row">
          {beds.map((bed) => (
            <div
              key={bed.bedId}
              className={`bed ${bed.status === "BOOKED" ? "booked" : "available"}`}
              onClick={() => handleBedClick(bed)}
            >
              {bed.bedId}
            </div>
          ))}

          {beds.length === 0 && (
            <p>No beds configured for this room</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default BedSelection;