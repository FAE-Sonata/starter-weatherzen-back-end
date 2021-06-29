const router = require("express").Router({ mergeParams: true });
const controller = require("./observations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);
router.route("/:observation_id")
    .put(controller.update);

module.exports = router;