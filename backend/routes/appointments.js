const express = require("express");
const router = express.Router();
const db = require("../db");

/* ----------------- BOOK NEW APPOINTMENT ----------------- */
router.post("/", (req, res) => {
  console.log("Incoming Request Body:", req.body);
  const { pid, did, hid, appointment_date } = req.body;

  // ✅ Validation
  if (!pid || !did || !hid || !appointment_date) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (pid, did, hid, appointment_date)"
    });
  }

  const sql = `
    INSERT INTO appointments (PID, DID, HID, APPOINTMENT_DATE, STATUS)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [pid, did, hid, appointment_date], (err, result) => {
    if (err) {
      console.error("SQL error while booking appointment:", err.sqlMessage);
      return res.status(500).json({
        success: false,
        message: "Database error while booking appointment",
        error: err.sqlMessage
      });
    }
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment_id: result.insertId
    });
  });
});


/* ----------------- GET APPOINTMENTS BY PATIENT ----------------- */
router.get("/patient/:pid", (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    return res.status(400).json({ success: false, message: "Patient ID is required" });
  }

  const sql = `
    SELECT a.AID, a.PID, a.APPOINTMENT_DATE, a.STATUS, 
           d.NAME AS doctor_name, h.NAME AS hospital_name
    FROM appointments a
    JOIN doctor d ON a.DID = d.DID
    JOIN hospital h ON a.HID = h.HID
    WHERE a.PID = ?
  `;

  db.query(sql, [pid], (err, rows) => {
    if (err) {
      console.error("SQL error while fetching patient appointments:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No appointments found for this patient" });
    }
    res.json({ success: true, count: rows.length, appointments: rows });
  });
});


/* ----------------- GET APPOINTMENTS BY DOCTOR ----------------- */
router.get("/doctor/:did", (req, res) => {
  const { did } = req.params;
  if (!did) return res.status(400).json({ success: false, message: "Doctor ID is required" });

  const sql = `
    SELECT a.AID, a.APPOINTMENT_DATE, a.STATUS, p.NAME AS patient_name, h.NAME AS hospital_name
    FROM appointments a
    JOIN patient p ON a.PID = p.PID
    JOIN hospital h ON a.HID = h.HID
    WHERE a.DID = ?`;
  
  db.query(sql, [did], (err, rows) => {
    if (err) {
      console.error("SQL error while fetching doctor appointments:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    res.json({ success: true, count: rows.length, appointments: rows });
  });
});


/* ----------------- UPDATE APPOINTMENT STATUS ----------------- */
router.put("/status/:aid", (req, res) => {
  const { aid } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ success: false, message: "Status is required" });

  const validStatuses = ["pending", "confirmed", "rejected", "completed", "cancelled"];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
  }

  const sql = "UPDATE appointments SET STATUS = ? WHERE AID = ?";
  db.query(sql, [status, aid], (err, result) => {
    if (err) {
      console.error("SQL error while updating status:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment status updated" });
  });
});


/* ----------------- CANCEL APPOINTMENT (by patient) ----------------- */
router.put("/cancel/:aid", (req, res) => {
  const { aid } = req.params;
  const sql = "UPDATE appointments SET STATUS = 'cancelled' WHERE AID = ?";
  db.query(sql, [aid], (err, result) => {
    if (err) {
      console.error("SQL error while cancelling appointment:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment cancelled" });
  });
});


/* ----------------- DELETE APPOINTMENT (admin) ----------------- */
router.delete("/:aid", (req, res) => {
  const { aid } = req.params;
  const sql = "DELETE FROM appointments WHERE AID = ?";
  db.query(sql, [aid], (err, result) => {
    if (err) {
      console.error("SQL error while deleting appointment:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment deleted" });
  });
});


/* ----------------- GET SINGLE PATIENT ----------------- */
router.get("/patients/:pid", (req, res) => {
  const pid = req.params.pid;
  db.query("SELECT * FROM patient WHERE PID = ?", [pid], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json(result[0]);
  });
});



/* ----------------- UPDATE PATIENT ----------------- */
router.put("/patients/:pid", (req, res) => {
  const pid = req.params.pid;
  const { NAME, DOB, PHONE, EMAIL, GENDER, ADDR, JOB } = req.body;
  db.query(
    "UPDATE patient SET NAME=?, DOB=?, PHONE=?, EMAIL=?, GENDER=?, ADDR=?, JOB=? WHERE PID=?",
    [NAME, DOB, PHONE, EMAIL, GENDER, ADDR, JOB, pid],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Patient not found" });
      res.json({ success: true, message: "Patient updated" });
    }
  );
});

module.exports = router;
