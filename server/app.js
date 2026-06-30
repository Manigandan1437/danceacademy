const express = require("express");
require("dotenv").config();
const connectDB = require("./configs/db");
const app = express();

const PORT = process.env.PORT;

connectDB();

app.get("/", (req, res) => {
  return res.status(200).json({ message: "API service running properly" });
});

app.use((req, res) => {
  return res.status(404).json({ message: "Url Not Found" });
});

app.listen(PORT, () => console.log("Server Started at port:", PORT));
