const express = require("express");
const { LoginDataSchema } = require("../middleware/validators/auth");

const router = express.Router();
const { login } = require("../query/auth");
const def = require("../controller/default");
const { registerUser} = require("../query/user");

router.post("/login", LoginDataSchema, async (req, res) => {
  const { username, password } = req.body;
  login(username, password).then((user) => {
    res.json(user);
  });
});
router.post("/signup", def(registerUser));


module.exports = router;
