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


/* ADD doctor */
app.use("/doctors", require("./routes/doctor"));
router.post("/", (req, res) => {
  const {
    hid,
    name,
    email,
    pass,
    addr,
    dob,
    gender,
    specialisation,
    institute,
    degree,
    phone,
    fees
  } = req.body;

  const sql = `
    INSERT INTO doctor 
    (HID, NAME, EMAIL, PASS, ADDR, DOB, GENDER, SPECIALISATION, INSTITUTE, DEGREE, PHONE, FEES)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [hid, name, email, pass, addr, dob, gender, specialisation, institute, degree, phone, fees],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.sqlMessage
        });
      }

      res.json({
        success: true,
        message: "Doctor added successfully",
        did: result.insertId
      });
    }
  );
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
