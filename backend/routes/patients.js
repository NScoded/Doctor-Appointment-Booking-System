// routes/patients.js
const express = require("express");
const router = express.Router();
const db = require("../db");

/* ----------------- CREATE NEW PATIENT ----------------- */
router.post("/", async (req, res) => {
  const { NAME, DOB, PHONE, EMAIL, PASS, GENDER, ADDR, JOB } = req.body;

  if (!NAME || !PHONE || !PASS) {
    return res.status(400).json({ success: false, message: "Name, Phone, and Password are required." });
  }

  try {
    const sql = `
      INSERT INTO patient (NAME, DOB, PHONE, EMAIL, PASS, GENDER, ADDR, JOB)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [NAME, DOB || null, PHONE, EMAIL || null, PASS, GENDER || null, ADDR || null, JOB || null], (err, result) => {
      if (err) {
        console.error("SQL error:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ success: false, message: "Phone or Email already exists." });
        }
        return res.status(500).json({ success: false, message: "Database error while creating patient." });
      }

      res.status(201).json({ success: true, message: "Patient account created successfully!", patientId: result.insertId });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Server error while creating patient." });
  }
});

/* ----------------- GET PATIENT BY ID ----------------- */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patient WHERE PID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }
    res.json(result[0]); // send patient object directly
  });
});

/* ----------------- UPDATE PATIENT ----------------- */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { NAME, DOB, PHONE, EMAIL, GENDER, ADDR, JOB } = req.body;

  const sql = `
    UPDATE patient
    SET NAME = ?, DOB = ?, PHONE = ?, EMAIL = ?, GENDER = ?, ADDR = ?, JOB = ?
    WHERE PID = ?
  `;
  db.query(sql, [NAME, DOB, PHONE, EMAIL, GENDER, ADDR, JOB, id], (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ success: false, message: "Database error while updating patient." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }
    res.json({ success: true, message: "Patient profile updated successfully!" });
  });
});

// appointments.js
router.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM appointments WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, message: "Appointment deleted" });
  });
});


// get patient by id
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  db.query("SELECT * FROM patient WHERE PID = ?", [pid], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ patient: result[0] });
  });
});

module.exports = router;





module.exports = router;
