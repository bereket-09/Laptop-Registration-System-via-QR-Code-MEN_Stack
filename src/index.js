const express = require("express");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs");
const qrcode = require("qrcode");
const Laptop = require("./models/model");
const bodyParser = require("body-parser");
const Controller = require("./controllers/controller");
// const uploadController = require("./controllers/uploads");
// const img = require("../upload");
var fname = "";
var serial = "";
const { auth, requiresAuth } = require("express-openid-connect");
const QRCode = require("qrcode");

const PORT = process.env.PORT || 3000;

const app = express();
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3000",
  clientID: "l8mq2O09NlJ4qb3cloPPNg6SrfQnFdFg",
  issuerBaseURL: "https://dev--rso9qle.eu.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.render(req.oidc.isAuthenticated() ? "dashboard" : "dashboard", {
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});
app.use(express.static("Images"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./db/db");

//set view enjine
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();

app.get("/add-new", requiresAuth(), (req, res) => {
  res.render("add-new", {
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});

app.get("/viewSingle", (req, res) => {
  res.render("viewSingle", {
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});

app.use("/css", express.static(path.resolve(__dirname, "../assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "../assets/js")));
app.use("/img", express.static(path.resolve(__dirname, "../assets/img")));

app.get("/search", (req, res) => {
  res.render("home", {
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});

// app.get("/search", Controller.search);
app.get("/list", Controller.findLaptops);
app.post("/add-new", Controller.createLaptop);
app.get("/view/:id", Controller.findLaptop);
app.patch("/update/:id", Controller.updateLaptop);
// app.delete("/delete/:id", Controller.deleteLaptop);

app.listen(PORT, () => {
  console.log("Server has started at port ",PORT);
});

app.post("/scan", (req, res, next) => {
  const input_txt = req.body.inputed;
  console.log(input_txt);
  qrcode.toDataURL(input_txt, (err, src) => {
    res.render("generate", {
      authInfo: req.oidc.isAuthenticated(),
      user: req.oidc.user,
      qr_code: src,
    });
  });
});

app.get("/delete/:id", async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    await laptop.remove();
    // res.send({ data: true })  ;
    res.redirect("/list");
  } catch {
    res.status(404).send({ error: "Laptop is not found!" });
  }
});

app.get("/update/:id", async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    const input_txt = laptop.serialNumber;
    console.log(input_txt);
    qrcode.toDataURL(input_txt, (err, src) => {
      serial = src;
    });
    res.render("update_pc", {
      data: laptop,
      authInfo: req.oidc.isAuthenticated(),
      user: req.oidc.user,
      qr: serial,
    });
  } catch {
    res.status(404).send({ error: "Laptop is not found!" });
  }
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, File, cb) => {
    console.log(File);
    cb(null, Date.now() + path.extname(File.originalname));
    fname = Date.now() + path.extname(File.originalname);
  },
});

const upload = multer({ storage: storage });

// const path = require("path");
app.get("/upload", (req, res) => {
  // return res.sendFile(path.join(`${__dirname}/../views/index.html`));
  res.render("upload");
});

app.post("/update/:id", upload.single("image"), async (req, res) => {
  var myquery = { _id: req.params.id };
  var newvalues = { $set: { profile: fname } };
  Laptop.updateOne(myquery, newvalues, function (err, res) {
    if (err) throw err;
    console.log("1 document updated");
    // res.redirect("/list");
  });
  // const laptop = await Laptop.updateOne({_id:req.params.id},{$set: {profile: req.body.image});
  res.redirect("/list");
});

app.post("/viewSingl", async (req, res) => {
  const data = await Laptop.findOne({ serialNumber: req.body.inputed });
  // console.log(laptop);
  // res.render("viewSingle", {
  //   authInfo: req.oidc.isAuthenticated(),
  //   user: req.oidc.user,
  //   laptop: laptop,
  // });
  console.log(data);
  res.render("viewSingle", {
    laptop: data,
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
});
