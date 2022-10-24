const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MOngodb connection string
    const con = await mongoose.connect("mongodb://localhost:27017/project1", {
      // dbName: "project",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify:false,
      // useCreateIndex:true
    });
    console.log("MONGODB is CONNECTED!");
  } catch (error) {
    console.log("error in DB Connecrtion");
    process.exit(1);
  }
};

module.exports = connectDB;
