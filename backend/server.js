require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= MONGODB ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

/* ================= MULTER ================= */

const UPLOAD_DIR = path.join(__dirname, "uploads");
const upload = multer({ dest: UPLOAD_DIR });

/* ================= JWT ================= */

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Access denied" });

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
};

/* ================= SCHEMA ================= */

const CollegeSchema = new mongoose.Schema({
  details: {
    collegeName: String,
    collegeId: String,
    email: String,
    contact: String,
    password: String,
  },
  guidelines: [String],
  about: [String],
  hostels: [
    {
      name: String,
      fees: {
        hostelFee: Number,
        messFee: Number,
        securityDeposit: Number,
        otherCharges: Number
      },
      rooms: [
        {
          roomNo: String,
          beds: [
            {
              bedId: String,
              status: { type: String, default: "FREE" },
              rank: { type: String, default: null }
            }
          ]
        }
      ]
    }
  ],
  students: [
    {
      rank: String,
      name: String,
      branch: String,
      booked: { type: Boolean, default: false }
    }
  ],
  bookings: [
    {
      hostel: String,
      roomNo: String,
      bedId: String,
      rank: String
    }
  ]
});

const College = mongoose.model("College", CollegeSchema);

/* =====================================================
   COLLEGE SIGNUP (WITH EXCEL IMPORT)
===================================================== */

app.post("/api/colleges", upload.single("excel"), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { collegeDetails, guidelines, about, hostels } = data;

    const existing = await College.findOne({
      "details.collegeName": collegeDetails.collegeName.toLowerCase()
    });

    if (existing)
      return res.status(400).json({ error: "College already exists" });

    const hashedPassword = await bcrypt.hash(collegeDetails.password, 10);

    let students = [];

    /* ====== READ EXCEL ====== */
    if (req.file) {
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      students = rows.map(row => ({
        rank: String(row.Rank || row.rank),
        name: row.Name || row.name,
        branch: row.Branch || row.branch,
        booked: false
      }));
    }

    const newCollege = new College({
      details: {
        collegeName: collegeDetails.collegeName.toLowerCase(),
        collegeId: collegeDetails.collegeId,
        email: collegeDetails.email,
        contact: collegeDetails.contact,
        password: hashedPassword
      },
      guidelines,
      about,
      hostels,
      students,
      bookings: []
    });

    await newCollege.save();

    res.json({ ok: true, message: "College registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   STUDENT LOGIN
===================================================== */

app.post("/api/login", async (req, res) => {
  try {
    const { college, rank, password } = req.body;

    const col = await College.findOne({
      "details.collegeName": college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    const isMatch = await bcrypt.compare(password, col.details.password);

    if (!isMatch)
      return res.status(401).json({ error: "Password incorrect" });

    const student = col.students.find(s => s.rank === rank);

    if (!student)
      return res.status(404).json({ error: "Invalid rank" });

    res.json({ ok: true, student });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   ADMIN LOGIN
===================================================== */

app.post("/api/admin/login", async (req, res) => {
  try {
    const { college, password } = req.body;

    const col = await College.findOne({
      "details.collegeName": college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    const isMatch = await bcrypt.compare(password, col.details.password);

    if (!isMatch)
      return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { college: col.details.collegeName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ ok: true, token });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   GET COLLEGE INFO
===================================================== */

app.get("/api/colleges/:college/info", async (req, res) => {
  try {
    const col = await College.findOne({
      "details.collegeName": req.params.college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    res.json(col);

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/admin/student/add", verifyToken, async (req, res) => {
  try {
    const { college, rank, name, branch } = req.body;

    const col = await College.findOne({
      "details.collegeName": college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    if (col.students.find(s => s.rank === rank))
      return res.status(400).json({ error: "Student already exists" });

    col.students.push({
      rank,
      name,
      branch,
      booked: false
    });

    await col.save();

    res.json({ ok: true });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/admin/student/:rank", verifyToken, async (req, res) => {
  try {
    const { college } = req.query;
    const rank = req.params.rank;

    const col = await College.findOne({
      "details.collegeName": college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    col.students = col.students.filter(s => s.rank !== rank);

    await col.save();

    res.json({ ok: true });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});
/* =====================================================
   ADMIN CANCEL BOOKING
===================================================== */

app.delete("/api/admin/booking/:rank", verifyToken, async (req, res) => {
  try {
    const { college } = req.query;
    const rank = req.params.rank;

    const col = await College.findOne({
      "details.collegeName": college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    const student = col.students.find(s => s.rank === rank);

    if (!student)
      return res.status(404).json({ error: "Student not found" });

    if (!student.booked)
      return res.status(400).json({ error: "No booking found" });

    const booking = col.bookings.find(b => b.rank === rank);

    if (!booking)
      return res.status(404).json({ error: "Booking record not found" });

    // Free bed
    const hostel = col.hostels.find(h => h.name === booking.hostel);
    const room = hostel?.rooms.find(r => r.roomNo === booking.roomNo);
    const bed = room?.beds.find(b => b.bedId === booking.bedId);

    if (bed) {
      bed.status = "FREE";
      bed.rank = null;
    }

    // Remove booking entry
    col.bookings = col.bookings.filter(b => b.rank !== rank);

    // Reset student booking
    student.booked = false;

    await col.save();

    res.json({ ok: true, message: "Booking cancelled successfully" });

  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
/* =====================================================
   BOOK BED
===================================================== */

app.post("/api/book", async (req, res) => {
  try {
    const { college, hostel, roomNo, bedId, rank } = req.body;

    const col = await College.findOne({
      "details.collegeName": college.toLowerCase()
    });

    if (!col)
      return res.status(404).json({ error: "College not found" });

    const student = col.students.find(s => s.rank === rank);

    if (!student)
      return res.status(404).json({ error: "Invalid rank" });

    if (student.booked)
      return res.status(400).json({ error: "Already booked" });

    const h = col.hostels.find(h => h.name === hostel);
    const r = h?.rooms.find(r => r.roomNo === roomNo);
    const b = r?.beds.find(b => b.bedId === bedId);

    if (!b || b.status === "BOOKED")
      return res.status(400).json({ error: "Bed not available" });

    b.status = "BOOKED";
    b.rank = rank;
    student.booked = true;

    col.bookings.push({ hostel, roomNo, bedId, rank });

    await col.save();

    res.json({ ok: true, message: "Booking successful" });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===================================================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});
