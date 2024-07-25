const authControllers = require("../controllers/authControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/admin-login", authControllers.admin_login);
router.get("/get-user", authMiddleware, authControllers.getUser);
router.post("/provider-register", authControllers.provider_register);
router.post("/provider-login", authControllers.provider_login);

module.exports = router;
