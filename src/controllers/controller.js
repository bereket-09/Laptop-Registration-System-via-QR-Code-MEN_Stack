const Laptop = require("../models/model");
const axios = require("axios");
const path = require("path");

const qrcode = require("qrcode");
const alart = require("alert");
const bodyParser = require("body-parser");
const { auth, requiresAuth } = require("express-openid-connect");
var s;
exports.findLaptops = async (req, res) => {
  // console.log(requiresAuth());
  // const v = isAuthenticated();
  const laptops = await Laptop.find();

  res.render("list", {
    data: laptops,
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
};

// exports.createLaptop = async (req, res) => {
//   var laptops = new Laptop();

//   laptops.name = req.body.name;
//   laptops.IdNo = req.body.IdNo;
//   laptops.userType = req.body.userType;
//   laptops.dept = req.body.dept;
//   laptops.phone = req.body.phone;
//   laptops.model = req.body.model;
//   laptops.serialNumber = req.body.serialNumber;
//   laptops.color = req.body.color;

//   laptops.save((err, doc) => {
//     if (!err) res.redirect("/dashboard");
//     else {
//       if (err.name == "ValidationError") {
//         handleValidationError(err, req.body);
//         res.render("/list", {
//           viewTitle: "Insert Laptop",
//           employee: req.body,
//         });
//       } else console.log("Error during record insertion : " + err);
//     }
//   });
// };
exports.createLaptop = async (req, res) => {
  try {
    console.log(req.body);
    const serial = req.body.serialNumber;

    const laptop = new Laptop(req.body);
    await laptop.save();
    // res.redirect("/add-new");
    const input_txt = serial;
    console.log(input_txt);
    qrcode.toDataURL(input_txt, (err, src) => {
      s = src;

      res.render("generate", {
        authInfo: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        qr_code: src,
        data: laptop,
      });
    });

    // res.render("generate", {
    //   authInfo: req.oidc.isAuthenticated(),
    //   user: req.oidc.user,
    //   data: laptop,
    //   qr: s,
    // });
  } catch (err) {
    alart("SerialNumber Should be unique");
  }
};

exports.search = (req, res) => {
  res.render("main", {
    authInfo: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
};

exports.findLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    // res.send("viewSingle", { data: laptop });
    res.render("viewSingle", { data: laptop });
  } catch {
    res.status(404).send({ error: "Laptop is not found!" });
  }
};

exports.updateLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    Object.assign(laptop, req.body);
    laptop.save();
    res.send({ data: laptop });
  } catch {
    res.status(404).send({ error: "Laptop is not found!" });
  }
};

// exports.deleteLaptop = async (req, res) => {
//   try {
//     const laptop = await Laptop.findById(req.params.id);
//     await laptop.remove();
//     res.send({ data: true });
//   } catch {
//     res.status(404).send({ error: "Laptop is not found!" });
//   }
// };
