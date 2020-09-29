var express = require("express");
var router = express.Router({ mergeParams: true });
var middleware = require("../middlewares");
var controller = require("../controllers/rateController");

router.post("/", middleware.isLoggedIn, controller.postRate);
router.put(
  "/:rate_id",
  middleware.isLoggedIn,
  middleware.checkUserRate,
  controller.uppdateRate
);
router.delete(
  "/:rate_id",
  middleware.isLoggedIn,
  middleware.checkUserRate,
  controller.deleteRate
);
module.exports = router;
