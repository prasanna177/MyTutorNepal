const express = require("express");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const tutorRoute = require("./routes/tutorRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const dbCongfig = require("./config/dbConfig");
const cors = require("cors");
const bodyParser = require("body-parser");

//middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(express.json()); //this is used to destructure username and password sent by the client in json format
const PORT = 4000;

//routes
app.use("/api/user", userRoute); //whenever api request comes with the user keyword, it will search in the userRoute
app.use("/api/admin", adminRoute);
app.use("/api/tutor", tutorRoute);
app.use("/api/appointment", appointmentRoute);

app.get("/", (req, res) => {
  console.log("Hello from the server");
});

app.get("/login", (req, res) => {
  res.send("Login page");
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
