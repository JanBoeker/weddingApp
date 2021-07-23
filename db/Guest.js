const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const encrypt = require("mongoose-encryption");

//////////////////////////// Set schema ////////////////////////////
const guestsSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    category: String,
    foreignID: String
});

//////////////////////////// Plugins for mongoose.js ////////////////////////////
guestsSchema.plugin(encrypt, {
    secret: process.env.SECRET_GUESTS,
    excludeFromEncryption: ["foreignID"]
});

//////////////////////////// Setup Collections ////////////////////////////
const Guest = new mongoose.model("Guest", guestsSchema);

// Export Mongoose "User" model
module.exports = mongoose.model("Guest", guestsSchema);