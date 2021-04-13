const path=require("path")
const router = require("express").Router();
// const router = require("express").Router({mergeParams:true});
const methodNotAllowed = require("../errors/methodNotAllowed")

// TODO: Implement the /dishes routes needed to make the tests pass
const controller = require("./dishes.controller");

router
  .route("/:dishId")
  .get(controller.read)
    .put(controller.update)
  .all(methodNotAllowed)
  
  //   .delete(controller.delete)
  
  router.route("/")
  .get(controller.list)
.post(controller.create)
.all(methodNotAllowed)

module.exports = router;
