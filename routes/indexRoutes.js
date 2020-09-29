var express = require("express");
var controller = require("../controllers/indexController");
var router = express.Router();
var passport = require("passport");

router.get("/", controller.goIndexPage);
router.get("/search", controller.search);
router.get("/sort", controller.sort);
router.get("/register", controller.register);
router.post("/register", controller.postRegister);
router.get("/login", controller.login);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/individual",
    failureRedirect: "/login",
  }),
  controller.postLogin
);
router.get("/logout", controller.logout);

module.exports = router;
