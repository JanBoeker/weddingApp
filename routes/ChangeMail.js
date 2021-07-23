const express = require("express");
const router = express.Router();
const User = require("../db/User");

router.get("/change-email", (req, res) => {
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
                res.render("change-email", {
                    category: users[0].category
                });
            }
        });
    } else {
        res.redirect("/login");
    }
});

//////////////////////////// change email ////////////////////////////
router.post("/change-email", function (req, res) {

    if (req.isAuthenticated()) {
        User.findOne({
            _id: req.session.passport.user
        }, (err, user) => {

            // Check if error connecting
            if (err) {
                res.json({
                    success: false,
                    message: err
                }); // Return error
            } else {
                // Check if user was found in database
                if (!user) {
                    res.render("answer", {
                        alert: "Fehler",
                        route: "/change-password",
                        message: "Nutzer nicht gefunden."
                    });
                } else {
                    user.username = req.body.newemail;
                    user.save(err => {
                        if (err) {
                            res.render("answer", {
                                alert: "Fehler",
                                route: "/change-email",
                                message: "Etwas ist schief gegangen! Bitte versuchen Sie es erneut."
                            });
                        } else {
                            res.render("answer", {
                                alert: "Geschafft!",
                                route: "/change-email",
                                message: "Die Email-Adresse wurde erfolgreich geändert."
                            });
                        }
                    });
                }
            }
        });
    }

});

// Export module
module.exports = router;