require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `connection to mongo db successful ${connection.connection.host}`
    );
  } catch (err) {
    console.log("Error in connecting to database", err.message);
    process.exit();
  }
};

module.exports = dbConnection;
