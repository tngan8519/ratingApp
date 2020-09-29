var express = require("express");
var controller = require("../controllers/individualController");
var router = express.Router();
var upload = require("../middlewares/upload");
var middleware = require("../middlewares");

router.get("/", controller.showPage);
router.post(
  "/",
  middleware.isLoggedIn,
  middleware.isAdmind,
  upload.single("img"),
  controller.postNewIndividual
);
router.get(
  "/new",
  middleware.isLoggedIn,
  middleware.isAdmind,
  controller.showCreateIndividualForm
);

router.get("/:id", controller.showDetail);
router.get("/:id/edit", controller.showEditIndividualForm);
router.put(
  "/:id",
  middleware.isLoggedIn,
  middleware.isAdmind,
  upload.single("img"),
  controller.updateIndividual
);
router.delete(
  "/:id",
  middleware.isLoggedIn,
  middleware.isAdmind,
  controller.deleteIndividual
);
module.exports = router;
