const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const { authGuard } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authGuard, (req, res) => {
  res.json(req.user);
});
router.post("/logout", authGuard, logout);

module.exports = router;
