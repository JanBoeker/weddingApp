const express = require("express");
const router = express.Router();
const User = require("../db/User");
const Guest = require("../db/Guest");

router.get("/gaeste-verwaltung", (req, res) => {

    if (req.isAuthenticated()) {

        Guest.find({
            foreignID: req.session.passport.user
        }, (err, users) => {

            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                res.render("gaeste", {
                    guests: users,
                    category: users[0].category
                });
            }
        });
    } else {
        res.redirect("/login");
    }
});

router.get("/admin", (req, res) => {
    if (req.isAuthenticated()) {

        Guest.find({}, (err, users) => {

            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {

                res.render("admin", {
                    guests: users,
                    category: users[0].category
                });
            }
        });

    } else {
        res.redirect("/login");
    }
});

//////////////////////////// add a new guest ////////////////////////////
router.post("/add-guest", function (req, res) {

    User.find({
        _id: req.session.passport.user
    }, (err, users) => {
        if (err) {
            console.log(err);
            res.redirect("/gaeste-verwaltung");
        } else {
            const userID = req.session.passport.user;

            if (req.isAuthenticated()) {
                const newGuest = new Guest({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    category: users[0].category,
                    foreignID: userID
                });

                newGuest.save();
                res.redirect("/gaeste-verwaltung");
            }
        }
    });
});

// Export module
module.exports = router;