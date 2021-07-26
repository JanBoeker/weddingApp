const express = require("express");
const router = express.Router();
const User = require("../db/User");
const Guest = require("../db/Guest");
const passport = require("passport");

router.get("/register", (req, res) => {
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
        res.render("register");
    }
});

//////////////////////////// register a new user ////////////////////////////
router.post("/register", function (req, res) {

    User.register({
        username: req.body.username,
        category: req.body.category
    },
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.render("answer", {
                    alert: "Error: ",
                    route: "/login",
                    message: err
                });
            } else {
                passport.authenticate("local")(req, res, function () {

                    const userID = req.session.passport.user;
                    const newGuest = new Guest({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        category: req.body.category,
                        foreignID: userID
                    });

                    newGuest.save();

                    res.redirect("/start");
                });
            }
        }
    );

});

// Export module
module.exports = router;