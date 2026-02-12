const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");              // ✅ ADDED
const db = require("./db");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080; // ✅ FIXED

/* ---------------------- MIDDLEWARE ---------------------- */
app.use(cors());
app.use(express.json());

/* ---------------------- PATIENT ROUTES ---------------------- */
const patientRoutes = require("./routes/patients");
app.use("/patients", patientRoutes);

/* ---------------------- VALIDATION HELPERS ---------------------- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  return /^\d{7,15}$/.test(phone);
}
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

/* ---------------------- HOSPITAL ROUTES ---------------------- */

app.get("/hospitals", (req, res) => {
  db.query("SELECT * FROM hospital", (err, result) => {
    if (err) return res.status(500).json({ error: "Database error while fetching hospitals" });
    res.json(result);
  });
});

app.get("/hospitals/:hid", (req, res) => {
  const hid = Number(req.params.hid);
  if (!hid) return res.status(400).json({ error: "Invalid hospital ID" });

  db.query("SELECT * FROM hospital WHERE HID = ?", [hid], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error while fetching hospital" });
    if (result.length === 0) return res.status(404).json({ error: "Hospital not found" });
    res.json(result[0]);
  });
});

app.post("/hospitals", (req, res) => {
  const { name, address, email, phone, website } = req.body;

  if (!name?.trim() || !address?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: "Name, address, and phone are required" });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  db.query(
    `INSERT INTO hospital (NAME, ADDR, EMAIL, PHONE, WEBSITE) VALUES (?, ?, ?, ?, ?)`,
    [name.trim(), address.trim(), email?.trim() || null, phone.trim(), website?.trim() || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add hospital", details: err.message });
      res.status(201).json({ message: "Hospital added successfully", hid: result.insertId });
    }
  );
});

app.delete("/hospitals/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid hospital ID" });

  db.query("DELETE FROM hospital WHERE HID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete hospital" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Hospital not found" });
    res.json({ message: "Hospital deleted successfully" });
  });
});

/* ---------------------- DOCTOR ROUTES ---------------------- */

// Get all doctors
app.get("/doctors", (req, res) => {
  db.query("SELECT * FROM doctor", (err, result) => {
    if (err) return res.status(500).json({ error: "Database error while fetching doctors" });
    res.json(result);
  });
});

// Get doctor by ID
app.get("/doctors/:did", (req, res) => {
  const did = Number(req.params.did);
  if (!did) return res.status(400).json({ error: "Invalid doctor ID" });

  db.query("SELECT * FROM doctor WHERE DID = ?", [did], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error while fetching doctor" });
    if (result.length === 0) return res.status(404).json({ error: "Doctor not found" });
    res.json(result[0]);
  });
});

// Get doctors by hospital ID
app.get("/doctors/hospital/:hid", (req, res) => {
  const hid = Number(req.params.hid);
  if (!hid) return res.status(400).json({ error: "Invalid hospital ID" });

  db.query("SELECT * FROM doctor WHERE HID = ?", [hid], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error while fetching doctors" });
    res.json(result);
  });
});

// Add doctor
app.post("/doctors", (req, res) => {
  const {
    hid, name, email, pass, addr, dob,
    gender, specialisation, institute, degree, phone, fees,
  } = req.body;

  if (!hid || !name?.trim() || !specialisation?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: "HID, name, specialisation, and phone are required" });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }
  if (dob && !isValidDate(dob)) {
    return res.status(400).json({ error: "Invalid date format (use YYYY-MM-DD)" });
  }

  const sql = `
    INSERT INTO doctor 
    (HID, NAME, EMAIL, PASS, ADDR, dob, GENDER, SPECIALISATION, INSTITUTE, DEGREE, PHONE, FEES)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    hid,
    name.trim(),
    email?.trim() || null,
    pass?.trim() || "pass",
    addr?.trim() || null,
    dob?.trim() || null,
    gender?.trim() || null,
    specialisation.trim(),
    institute?.trim() || null,
    degree?.trim() || null,
    phone.trim(),
    fees !== undefined && fees !== "" ? fees : null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add doctor", details: err.message });
    res.status(201).json({ message: "Doctor added successfully", did: result.insertId });
  });
});

// Delete doctor
app.delete("/doctors/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid doctor ID" });

  db.query("DELETE FROM doctor WHERE DID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete doctor" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Doctor not found" });
    res.json({ message: "Doctor deleted successfully" });
  });
});


// Update doctor by DID
app.put("/doctors/:did", (req, res) => {
  const did = Number(req.params.did);
  if (!did) return res.status(400).json({ error: "Invalid doctor ID" });

  const {
    NAME, DOB, PHONE, EMAIL, GENDER, ADDR, SPECIALISATION, INSTITUTE, DEGREE, FEES
  } = req.body;

  const sql = `
    UPDATE doctor SET 
      NAME = ?, DOB = ?, PHONE = ?, EMAIL = ?, GENDER = ?, ADDR = ?, 
      SPECIALISATION = ?, INSTITUTE = ?, DEGREE = ?, FEES = ?
    WHERE DID = ?
  `;

  const values = [
    NAME?.trim() || null,
    DOB?.trim() || null,
    PHONE?.trim() || null,
    EMAIL?.trim() || null,
    GENDER?.trim() || null,
    ADDR?.trim() || null,
    SPECIALISATION?.trim() || null,
    INSTITUTE?.trim() || null,
    DEGREE?.trim() || null,
    FEES || null,
    did
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update doctor", details: err.message });
    res.json({ message: "Profile updated successfully" });
  });
});


/* ---------------------- LOGIN ---------------------- */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Server error" });

    if (result.length > 0) {
      const user = result[0];

      // if patient, fetch PID
      if (user.role === "patient") {
        db.query("SELECT PID FROM patient WHERE EMAIL = ?", [user.email], (err2, rows) => {
          if (err2) return res.status(500).json({ success: false, message: "Server error" });

          if (rows.length > 0) {
            user.pid = rows[0].PID;   // ✅ attach PID
          }
          return res.json({ success: true, message: "Login successful", user });
        });
      }
      // if doctor, fetch DID
      else if (user.role === "doctor") {
        db.query("SELECT DID FROM doctor WHERE EMAIL = ?", [user.email], (err2, rows) => {
          if (err2) return res.status(500).json({ success: false, message: "Server error" });

          if (rows.length > 0) {
            user.did = rows[0].DID;   // ✅ attach DID
          }
          return res.json({ success: true, message: "Login successful", user });
        });
      }
      else {
        // admin or others, just return login row
        return res.json({ success: true, message: "Login successful", user });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });
});

/* ---------------------- EMAIL LOOKUPS ---------------------- */
// Get doctor by email
app.get("/doctors/byEmail/:email", (req, res) => {
  db.query("SELECT * FROM doctor WHERE EMAIL = ?", [req.params.email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Doctor not found");
    res.json(results[0]);
  });
});

// Get patient by email
app.get("/patients/byEmail/:email", (req, res) => {
  db.query("SELECT * FROM patient WHERE EMAIL = ?", [req.params.email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Patient not found");
    res.json(results[0]);
  });
});

/* ---------------------- APPOINTMENTS ROUTES ---------------------- */
const appointments = require("./routes/appointments");
app.use("/appointments", appointments);

/* ---------------------- CART ROUTES ---------------------- */
const cartRouter = require("./routes/cart");
app.use("/cart", cartRouter);

app.use("/doctors", require("./routes/doctor"));

/* ---------------------- TEMP DB IMPORT ROUTE ---------------------- */
// ✅ ONLY FOR ONE-TIME SQL IMPORT (DELETE AFTER USE)
app.get("/import-db", (req, res) => {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "project_vt.sql"),
      "utf8"
    );

    db.query(sql, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("❌ Import failed");
      }
      res.send("✅ Database imported successfully");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ SQL file not found");
  }
});

/* ---------------------- START SERVER ---------------------- */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
