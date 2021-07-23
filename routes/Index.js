const express = require("express");
const router = express.Router();
const User = require("../db/User");

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        User.find({
            _id: req.session.passport.user
        }, (err, users) => {
            if (err) {
                console.log(err);
                res.render("start", {
                    category: "B"
                });
            } else {
                res.render("start", {
                    category: users[0].category
                });
            }
        });
    } else {
        res.render("login");
    }
});

router.get("/start", (req, res) => {
    if (req.isAuthenticated()) {
        User.find({
            _id: req.session.passport.user
        }, (err, users) => {
            if (err) {
                console.log(err);
                res.render("start", {
                    category: "B"
                });
            } else {
                res.render("start", {
                    category: users[0].category
                });
            }
        });

    } else {
        res.redirect("/login");
    }
});

// Export module
module.exports = router;