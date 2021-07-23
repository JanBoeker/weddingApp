const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const encrypt = require("mongoose-encryption");

//////////////////////////// Set schema ////////////////////////////
const userSchema = new mongoose.Schema({
    username: String,
    category: String,
    password: String,
    secret: String
});

//////////////////////////// Plugins for mongoose.js ////////////////////////////
// Mongoose plugin: https://mongoosejs.com/docs/plugins.html
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

//////////////////////////// Setup passport.js ////////////////////////////
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Export Mongoose "User" model
module.exports = mongoose.model('User', userSchema);
