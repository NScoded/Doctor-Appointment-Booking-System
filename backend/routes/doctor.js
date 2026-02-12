const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET single doctor by DID */
router.get("/:did", (req, res) => {
  const { did } = req.params;
  db.query("SELECT * FROM doctor WHERE DID = ?", [did], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
    if (result.length === 0) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, doctor: result[0] });
  });
});

/* UPDATE doctor info */
router.put("/:did", (req, res) => {
  const { did } = req.params;
  const { NAME, DOB, PHONE, EMAIL, GENDER, ADDR, SPECIALISATION, INSTITUTE, DEGREE, FEES } = req.body;

  const sql = `
    UPDATE doctor
    SET NAME=?, DOB=?, PHONE=?, EMAIL=?, GENDER=?, ADDR=?, SPECIALISATION=?, INSTITUTE=?, DEGREE=?, FEES=?
    WHERE DID=?
  `;
  db.query(sql, [NAME, DOB, PHONE, EMAIL, GENDER, ADDR, SPECIALISATION, INSTITUTE, DEGREE, FEES, did], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Doctor updated successfully" });
  });
});

module.exports = router;
