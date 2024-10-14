const express = require("express");
const { connectMongooesDB } = require("./config/db-config");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

connectMongooesDB();


app.use(express.json());
app.use(cookieParser());
app.use("/api/users", require("./routes/users-routes")); //so if request is coming with api/user then use the file of routes
app.use("/api/events", require("./routes/events-routes"));
app.use("/api/payment", require("./routes/payments-routes"));
app.use("/api/bookings", require("./routes/booking-routes"));  
app.use("/api/reports",require("./routes/reports-routes"))


const port = process.env.Port || 5000; //for generate random port
app.listen(port, () => {
  console.log("node+express Port Start");
});
