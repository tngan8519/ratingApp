var Rate = require("../models/rate");
var Individual = require("../models/individual");
module.exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
module.exports.checkUserRate = function (req, res, next) {
  Rate.findById(req.params.rate_id, function (err, foundRate) {
    if (err || !foundRate) {
      console.log(err);
      res.redirect("back");
    } else if (foundRate.author.id.equals(req.user._id) || req.user.isAdmin) {
      next();
    } else {
      res.redirect("/individual/" + req.params.id);
    }
  });
};
module.exports.isAdmind = function (req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.redirect("back");
  }
};
