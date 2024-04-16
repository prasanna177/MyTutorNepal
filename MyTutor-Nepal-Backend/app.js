const express = require("express");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const tutorRoute = require("./routes/tutorRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const ratingRoute = require("./routes/ratingRoute");
const uploaderRoute = require("./routes/uploaderRoute");
const khaltiRoute = require("./routes/khaltiRoute");
const assignmentRoute = require("./routes/assignmentRoute");
const dbCongfig = require("./config/dbConfig");
const cors = require("cors");
const bodyParser = require("body-parser");
const { startCronJob } = require("./utils/cronJobs");

//middleware
const app = express();
app.use(cors({
  origin: ["https://my-tutor-nepal.vercel.app"],
  methods: ["POST","GET"],
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(express.json()); //this is used to destructure username and password sent by the client in json format
const PORT = `${process.env.SERVER_PORT}` || 6000;

//routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/tutor", tutorRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/uploader", uploaderRoute);
app.use("/api/khalti", khaltiRoute);
app.use("/api/assignment", assignmentRoute);

app.get("/", (req, res) => {
  console.log("Hello from the server");
});

app.get("/login", (req, res) => {
  res.send("Login page");
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});

startCronJob();
