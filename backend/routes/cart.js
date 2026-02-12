const express = require("express");
const router = express.Router();
const db = require("../db");

/* ----------------- ADD ITEM TO CART ----------------- */
router.post("/", (req, res) => {
  const { pid, did, hid } = req.body;
  if (!pid || !did || !hid) {
    return res.status(400).json({ success: false, message: "Missing fields (pid, did, hid)" });
  }

  const sql = "INSERT INTO cart (PID, DID, HID) VALUES (?, ?, ?)";
  db.query(sql, [pid, did, hid], (err, result) => {
    if (err) {
      console.error("SQL error while adding to cart:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    res.json({ success: true, message: "Doctor added to cart", cid: result.insertId });
  });
});

/* ----------------- GET CART ITEMS BY PATIENT ----------------- */
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const sql = `
    SELECT c.CID, c.PID, d.DID, d.NAME, d.SPECIALISATION, d.DEGREE, d.INSTITUTE, d.PHONE, d.FEES, h.HID, h.NAME as hospital_name
    FROM cart c
    JOIN doctor d ON c.DID = d.DID
    JOIN hospital h ON c.HID = h.HID
    WHERE c.PID = ?`;
  
  db.query(sql, [pid], (err, rows) => {
    if (err) {
      console.error("SQL error while fetching cart:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    res.json(rows);
  });
});

/* ----------------- REMOVE ITEM FROM CART ----------------- */
router.delete("/:cid", (req, res) => {
  const { cid } = req.params;
  db.query("DELETE FROM cart WHERE CID = ?", [cid], (err, result) => {
    if (err) {
      console.error("SQL error while deleting cart item:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    res.json({ success: true, message: "Cart item removed" });
  });
});

/* ----------------- CLEAR CART AFTER BOOKING ----------------- */
router.delete("/clear/:pid", (req, res) => {
  const { pid } = req.params;
  db.query("DELETE FROM cart WHERE PID = ?", [pid], (err, result) => {
    if (err) {
      console.error("SQL error while clearing cart:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error", error: err.sqlMessage });
    }
    res.json({ success: true, message: "Cart cleared" });
  });
});

module.exports = router;
