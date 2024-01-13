const expres = require("express");
const { registerUser, authUser } = require("../controllers/userController");

const router = expres.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
