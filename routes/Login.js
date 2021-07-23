const express = require("express");
const router = express.Router();
const User = require("../db/User");
const passport = require("passport");

//////////////////////////// show login page ////////////////////////////
router.get("/login", (req, res) => {
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

//////////////////////////// login the new user ////////////////////////////
router.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // use passport to login the user:
    req.login(user, function (err) {

        if (err) {
            console.log(err);
            res.render("answer", {
                alert: "Fehler",
                route: "/login",
                message: err
            });
        } else {
            passport.authenticate("local")(req, res, function (err) {
                res.redirect("/start");
            });
        }
    });
});

//////////////////////////// logout ////////////////////////////
router.get("/logout", function (req, res) {

    // end current session and redirect
    req.logout();
    res.redirect("/");

});

// Export module
module.exports = router;