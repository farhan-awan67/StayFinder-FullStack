const mongoose = require("mongoose");

const dbUrl = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    mongoose.connect(dbUrl);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

// const connectDB = mongoose
//   .connect("dbUrl")
//   .then(() => console.log("DB connected"))
//   .catch((err) => console.log(err));

module.exports = connectDB;
