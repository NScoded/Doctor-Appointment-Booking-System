const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const doctorsRoute = require("./routes/doctors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/doctors", doctorsRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
