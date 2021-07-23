//jshint esversion:6

// Environment variables
require("dotenv").config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const encrypt = require("mongoose-encryption");

const app = express();
const port = process.env.PORT || 3000;

//app.use(express.static("public"));
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// https://www.npmjs.com/package/express-session
app.use(session({
  secret: process.env.SECRET_PASSPORT,
  resave: false,
  saveUninitialized: false
}));

// http://www.passportjs.org/docs/configure/
app.use(passport.initialize());
app.use(passport.session());

//////////////////////////// DB setup ////////////////////////////
// connect with mongodb --> mongod --dbpath ~/data/db --> mongo
// const connectionTest = "mongodb://localhost:27017/weddingDB";
const connectionProd = "mongodb+srv://" + process.env.USERNAMEDB + ":" + process.env.PASSWORDDB + "@cluster0.v4edf.mongodb.net/weddingDB?retryWrites=true&w=majority";
mongoose.connect(connectionProd, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// To solve the DeprecationWarning "collection.ensureIndex is deprecated. Use createIndexes instead"
mongoose.set("useCreateIndex", true);

//////////////////////////// schemas for DB ////////////////////////////
const User = require("./db/User");
const Post = require("./db/Blog");
const Item = require("./db/Item");
const Guest = require("./db/Guest");

//////////////////////////// routes ////////////////////////////
app.use("/", require("./routes/Index"));
app.use("/", require("./routes/Register"));
app.use("/", require("./routes/Login"));
app.use("/", require("./routes/Aktuelles"));
app.use("/", require("./routes/Anfahrt"));
app.use("/", require("./routes/ChangeMail"));
app.use("/", require("./routes/ChangePassword"));
app.use("/", require("./routes/Blogpost"));
app.use("/", require("./routes/Mitbringliste"));
app.use("/", require("./routes/Item"));
app.use("/", require("./routes/Guests"));

//////////////////////////// server ////////////////////////////
app.listen(port, function () {
  console.log("Server started on port " + port);
});