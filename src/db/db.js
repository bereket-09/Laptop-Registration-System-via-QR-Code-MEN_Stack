const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MOngodb connection string
    // const con = await mongoose.connect("mongodb://localhost:27017/project1", {

    const con = await mongoose.connect("mongodb+srv://nextjs-2022:nextjs2022@cluster0.bmmne.mongodb.net/?retryWrites=true&w=majority", {
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

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.bmmne.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
