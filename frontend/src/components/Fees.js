import React, { useEffect, useState } from "react";
import "../styles/fees.scss";

function Fees() {
  const [data, setData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/colleges/${user.college}/info`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFees();
  }, [user.college]);

  if (!data) return <div className="fees-page">Loading...</div>;

  return (
    <div className="fees-page">
      <h2>Hostel Fee Details</h2>

      {data.hostels.map((hostel, index) => (
        <div key={index} className="fee-card">
          <h3>{hostel.name}</h3>

          <div className="fee-grid">
            <div>Hostel Fee: ₹{hostel.fees?.hostelFee || 0}</div>
            <div>Mess Fee: ₹{hostel.fees?.messFee || 0}</div>
            <div>Security Deposit: ₹{hostel.fees?.securityDeposit || 0}</div>
            <div>Other Charges: ₹{hostel.fees?.otherCharges || 0}</div>
          </div>

          <div className="total">
            Total: ₹
            {(hostel.fees?.hostelFee || 0) +
              (hostel.fees?.messFee || 0) +
              (hostel.fees?.securityDeposit || 0) +
              (hostel.fees?.otherCharges || 0)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Fees;