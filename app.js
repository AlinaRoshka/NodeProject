const express = require("express");
const mongoose = require("mongoose");

const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const cards = require("./routes/cards");


require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/cards", cards);


mongoose
  .connect(process.env.dbConnect, { useNewUrlParser: true })
  .then(() => console.log(`MongoDB is connected...`))
  .catch(() => console.log(`MongoDB is not connected...`));

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
