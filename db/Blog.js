const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const encrypt = require("mongoose-encryption");

//////////////////////////// Set schema ////////////////////////////
const blogPostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "No title added."]
    },
    content: {
        type: String,
        required: [true, "No content added."]
    },
    category: String
});

//////////////////////////// Plugins for mongoose.js ////////////////////////////
blogPostsSchema.plugin(encrypt, {
    secret: process.env.SECRET_POSTS
});

//////////////////////////// Setup Collections ////////////////////////////
const Post = new mongoose.model("BlogPost", blogPostsSchema);

// Export Mongoose "Blog" model
module.exports = mongoose.model("Post", blogPostsSchema);