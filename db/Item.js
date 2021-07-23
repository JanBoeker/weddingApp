const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const encrypt = require("mongoose-encryption");

//////////////////////////// Set schema ////////////////////////////
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "No item added."]
    },
    checked: Boolean
});

//////////////////////////// Plugins for mongoose.js ////////////////////////////
itemsSchema.plugin(encrypt, {
    secret: process.env.SECRET_ITEMS
});

//////////////////////////// Setup Collections ////////////////////////////
const Item = new mongoose.model("Item", itemsSchema);


// Export Mongoose "Item" model
module.exports = mongoose.model("Item", itemsSchema);