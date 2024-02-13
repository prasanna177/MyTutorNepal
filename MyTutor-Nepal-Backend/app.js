const express = require("express");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const tutorRoute = require("./routes/tutorRoute");
const dbCongfig = require("./config/dbConfig");
const cors = require("cors");

//middleware
const app = express();
app.use(cors());
app.use(express.json()); //this is used to destructure username and password sent by the client in json format
const PORT = 4000;

//routes
app.use("/api/user", userRoute); //whenever api request comes with the user keyword, it will search in the userRoute
app.use("/api/admin", adminRoute);
app.use("/api/tutor", tutorRoute);

app.get("/", (req, res) => {
  console.log("Hello from the server");
});

app.get("/login", (req, res) => {
  res.send("Login page");
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
