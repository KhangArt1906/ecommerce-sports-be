const express = require("express");
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./utilities/database");

require("dotenv").config();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", require("./routes/authRoutes"));

app.get("/", (req, res) => res.send("My Backend is running"));
const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log(`Server is running on port ${port}`));
