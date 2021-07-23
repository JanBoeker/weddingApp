const express = require("express");
const router = express.Router();
const User = require("../db/User");
const Post = require("../db/Blog");

router.get("/compose-blogpost", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("compose-blogbost", {
            category: "A"
        });
    } else {
        res.redirect("aktuelles");
    }
});

//////////////////////////// add a new blogpost ////////////////////////////
router.post("/new-post", function (req, res) {

    if (req.isAuthenticated()) {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category
        });

        newPost.save();
        res.redirect("/aktuelles");
    }

});

// Export module
module.exports = router;