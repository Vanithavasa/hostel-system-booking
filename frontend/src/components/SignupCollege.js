import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.scss";

export default function SignupCollege() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    collegeName: "",
    collegeId: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    guidelines: "",
    about: "",
    hostels: [
      {
        name: "",
        fees: {
          hostelFee: 0,
          messFee: 0,
          securityDeposit: 0,
          otherCharges: 0
        },
        rooms: []
      }
    ],
    excel: null
  });

  const addHostel = () => {
    setForm({
      ...form,
      hostels: [
        ...form.hostels,
        {
          name: "",
          fees: {
            hostelFee: 0,
            messFee: 0,
            securityDeposit: 0,
            otherCharges: 0
          },
          rooms: []
        }
      ]
    });
  };

  const addRoom = (hIndex) => {
    const updated = [...form.hostels];
    updated[hIndex].rooms.push({
      roomNo: "",
      beds: []
    });
    setForm({ ...form, hostels: updated });
  };

  const generateBeds = (hIndex, rIndex, count) => {
    const updated = [...form.hostels];
    updated[hIndex].rooms[rIndex].beds = Array.from(
      { length: count },
      (_, i) => ({
        bedId: `B${i + 1}`,
        status: "FREE",
        rank: null
      })
    );
    setForm({ ...form, hostels: updated });
  };

  const submit = async () => {
    try {
      const payload = {
        collegeDetails: {
          collegeName: form.collegeName,
          collegeId: form.collegeId,
          email: form.email,
          contact: form.contact,
          password: form.password,
          confirmPassword: form.confirmPassword
        },
        guidelines: form.guidelines.split("\n").filter(Boolean),
        about: form.about.split("\n").filter(Boolean),
        hostels: form.hostels
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));
      fd.append("excel", form.excel);

      const res = await fetch("http://localhost:4000/api/colleges", {
        method: "POST",
        body: fd
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      alert("College Registered Successfully");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
    <div className="signup-container">
      <h2>College Signup</h2>

      {error && <div className="form-error">{error}</div>}

      {/* Step 1 */}
      {step === 1 && (
        <>
          <input placeholder="College Name" onChange={e => setForm({ ...form, collegeName: e.target.value })} />
          <input placeholder="College ID" onChange={e => setForm({ ...form, collegeId: e.target.value })} />
          <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Contact" onChange={e => setForm({ ...form, contact: e.target.value })} />
          <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
          <input type="password" placeholder="Confirm Password" onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <textarea placeholder="Guidelines (one per line)"
          onChange={e => setForm({ ...form, guidelines: e.target.value })} />
      )}

      {/* Step 3 */}
      {step === 3 && (
        <textarea placeholder="About College (one per line)"
          onChange={e => setForm({ ...form, about: e.target.value })} />
      )}

      {/* Step 4 Hostels + Fees */}
      {step === 4 && (
        <>
          <button onClick={addHostel}>+ Add Hostel</button>

          {form.hostels.map((h, hi) => (
            <div key={hi} className="hostel-block">
              <input
                placeholder="Hostel Name"
                onChange={e => {
                  const updated = [...form.hostels];
                  updated[hi].name = e.target.value;
                  setForm({ ...form, hostels: updated });
                }}
              />

              {/* Fees */}
              <div className="hostel-fees">
                <input type="number" placeholder="Hostel Fee"
                  onChange={e => {
                    const updated = [...form.hostels];
                    updated[hi].fees.hostelFee = Number(e.target.value);
                    setForm({ ...form, hostels: updated });
                  }} />

                <input type="number" placeholder="Mess Fee"
                  onChange={e => {
                    const updated = [...form.hostels];
                    updated[hi].fees.messFee = Number(e.target.value);
                    setForm({ ...form, hostels: updated });
                  }} />

                <input type="number" placeholder="Security Deposit"
                  onChange={e => {
                    const updated = [...form.hostels];
                    updated[hi].fees.securityDeposit = Number(e.target.value);
                    setForm({ ...form, hostels: updated });
                  }} />

                <input type="number" placeholder="Other Charges"
                  onChange={e => {
                    const updated = [...form.hostels];
                    updated[hi].fees.otherCharges = Number(e.target.value);
                    setForm({ ...form, hostels: updated });
                  }} />
              </div>

              <button onClick={() => addRoom(hi)}>+ Add Room</button>

              {h.rooms.map((r, ri) => (
                <div key={ri}>
                  <input placeholder="Room No"
                    onChange={e => {
                      const updated = [...form.hostels];
                      updated[hi].rooms[ri].roomNo = e.target.value;
                      setForm({ ...form, hostels: updated });
                    }} />
                  <input type="number" placeholder="Beds"
                    onChange={e => generateBeds(hi, ri, Number(e.target.value))} />
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <input type="file"
          onChange={e => setForm({ ...form, excel: e.target.files[0] })} />
      )}

      <div>
        {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
        {step < 5 && <button onClick={() => setStep(step + 1)}>Next</button>}
        {step === 5 && <button onClick={submit}>Finish</button>}
      </div>
    </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/signup.scss";

// export default function SignupCollege() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     collegeName: "",
//     collegeId: "",
//     email: "",
//     contact: "",
//     password: "",
//     confirmPassword: "",
//     guidelines: "",
//     about: "",
//     hostels: [
//       {
//         name: "",
//         fees: {
//           hostelFee: 0,
//           messFee: 0,
//           securityDeposit: 0,
//           otherCharges: 0
//         },
//         rooms: []
//       }
//     ],
//     excel: null
//   });

//   const addHostel = () => {
//     setForm({
//       ...form,
//       hostels: [
//         ...form.hostels,
//         {
//           name: "",
//           fees: {
//             hostelFee: 0,
//             messFee: 0,
//             securityDeposit: 0,
//             otherCharges: 0
//           },
//           rooms: []
//         }
//       ]
//     });
//   };

//   const addRoom = (hIndex) => {
//     const updated = [...form.hostels];
//     updated[hIndex].rooms.push({
//       roomNo: "",
//       beds: []
//     });
//     setForm({ ...form, hostels: updated });
//   };

//   const generateBeds = (hIndex, rIndex, count) => {
//     const updated = [...form.hostels];
//     updated[hIndex].rooms[rIndex].beds = Array.from(
//       { length: count },
//       (_, i) => ({
//         bedId: `B${i + 1}`,
//         status: "FREE",
//         rank: null
//       })
//     );
//     setForm({ ...form, hostels: updated });
//   };

//   const submit = async () => {
//     try {
//       const payload = {
//         collegeDetails: {
//           collegeName: form.collegeName,
//           collegeId: form.collegeId,
//           email: form.email,
//           contact: form.contact,
//           password: form.password,
//           confirmPassword: form.confirmPassword
//         },
//         guidelines: form.guidelines.split("\n").filter(Boolean),
//         about: form.about.split("\n").filter(Boolean),
//         hostels: form.hostels
//       };

//       const fd = new FormData();
//       fd.append("data", JSON.stringify(payload));
//       fd.append("excel", form.excel);

//       const res = await fetch("http://localhost:4000/api/colleges", {
//         method: "POST",
//         body: fd
//       });

//       const json = await res.json();
//       if (!res.ok) throw new Error(json.error);

//       alert("College Registered Successfully");
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>College Signup</h2>

//       {error && <div className="form-error">{error}</div>}

//       {/* Step 1 */}
//       {step === 1 && (
//         <>
//           <input placeholder="College Name" onChange={e => setForm({ ...form, collegeName: e.target.value })} />
//           <input placeholder="College ID" onChange={e => setForm({ ...form, collegeId: e.target.value })} />
//           <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
//           <input placeholder="Contact" onChange={e => setForm({ ...form, contact: e.target.value })} />
//           <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
//           <input type="password" placeholder="Confirm Password" onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
//         </>
//       )}

//       {/* Step 2 */}
//       {step === 2 && (
//         <textarea placeholder="Guidelines (one per line)"
//           onChange={e => setForm({ ...form, guidelines: e.target.value })} />
//       )}

//       {/* Step 3 */}
//       {step === 3 && (
//         <textarea placeholder="About College (one per line)"
//           onChange={e => setForm({ ...form, about: e.target.value })} />
//       )}

//       {/* Step 4 Hostels + Fees */}
//       {step === 4 && (
//         <>
//           <button onClick={addHostel}>+ Add Hostel</button>

//           {form.hostels.map((h, hi) => (
//             <div key={hi} className="hostel-block">
//               <input
//                 placeholder="Hostel Name"
//                 onChange={e => {
//                   const updated = [...form.hostels];
//                   updated[hi].name = e.target.value;
//                   setForm({ ...form, hostels: updated });
//                 }}
//               />

//               {/* Fees */}
//               <div className="hostel-fees">
//                 <input type="number" placeholder="Hostel Fee"
//                   onChange={e => {
//                     const updated = [...form.hostels];
//                     updated[hi].fees.hostelFee = Number(e.target.value);
//                     setForm({ ...form, hostels: updated });
//                   }} />

//                 <input type="number" placeholder="Mess Fee"
//                   onChange={e => {
//                     const updated = [...form.hostels];
//                     updated[hi].fees.messFee = Number(e.target.value);
//                     setForm({ ...form, hostels: updated });
//                   }} />

//                 <input type="number" placeholder="Security Deposit"
//                   onChange={e => {
//                     const updated = [...form.hostels];
//                     updated[hi].fees.securityDeposit = Number(e.target.value);
//                     setForm({ ...form, hostels: updated });
//                   }} />

//                 <input type="number" placeholder="Other Charges"
//                   onChange={e => {
//                     const updated = [...form.hostels];
//                     updated[hi].fees.otherCharges = Number(e.target.value);
//                     setForm({ ...form, hostels: updated });
//                   }} />
//               </div>

//               <button onClick={() => addRoom(hi)}>+ Add Room</button>

//               {h.rooms.map((r, ri) => (
//                 <div key={ri}>
//                   <input placeholder="Room No"
//                     onChange={e => {
//                       const updated = [...form.hostels];
//                       updated[hi].rooms[ri].roomNo = e.target.value;
//                       setForm({ ...form, hostels: updated });
//                     }} />
//                   <input type="number" placeholder="Beds"
//                     onChange={e => generateBeds(hi, ri, Number(e.target.value))} />
//                 </div>
//               ))}
//             </div>
//           ))}
//         </>
//       )}

//       {/* Step 5 */}
//       {step === 5 && (
//         <input type="file"
//           onChange={e => setForm({ ...form, excel: e.target.files[0] })} />
//       )}

//       <div>
//         {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
//         {step < 5 && <button onClick={() => setStep(step + 1)}>Next</button>}
//         {step === 5 && <button onClick={submit}>Finish</button>}
//       </div>
//     </div>
//   );
// }