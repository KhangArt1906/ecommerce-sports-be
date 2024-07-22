const mongoose = require("mongoose");

module.exports.dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {});
    console.log("Database connected...");
  } catch (error) {
    console.log("Could not connect to database: ", error.message);
  }
};
