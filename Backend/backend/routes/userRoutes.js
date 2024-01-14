const expres = require("express");
const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = expres.Router();

router.route("/").post(registerUser).get(protect, allUser);
router.route("/login").post(authUser);

module.exports = router;
