const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./config/db");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dbConnection();
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.send("API IS RUNNING SUCESSFULLY");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || "5000";

app.listen(PORT, console.log(`server started at port  ${PORT}`));
