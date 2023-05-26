const router = require("express").Router({mergeParams: true});
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const dishesRouter = require("../dishes/dishes.router");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router 
  .route("/:orderId")
  .get(controller.read)
  .post(controller.create)
  .delete(controller.destroy)
  .put(controller.update)
  .all(methodNotAllowed);


module.exports = router;

