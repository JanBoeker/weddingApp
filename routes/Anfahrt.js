const express = require("express");
const router = express.Router();
const User = require("../db/User");

router.get("/standesamt", (req, res) => {
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
          res.render("standesamt", {
            category: users[0].category
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  });
  
  router.get("/truderinger-wirtshaus", (req, res) => {
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
          res.render("truderinger-wirtshaus", {
            category: users[0].category
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  });
  
  router.get("/feuerwehr", (req, res) => {
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
          res.render("feuerwehr", {
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