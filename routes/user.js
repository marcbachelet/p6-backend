const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const passwordCtrl = require("../middleware/password");
const limiter = require("../middleware/ratelimit");

router.post("/signup", limiter, passwordCtrl, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
