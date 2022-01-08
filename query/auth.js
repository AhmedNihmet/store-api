const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
const db = require("../database/connection");
const uniqid = require("uniqid");

module.exports = {
  login: (username, password) =>
    db.transaction(async (db) => {
      const [checkUsername] = await db("user")
        .select()
        .where("user.name", username)
        .andWhere("active", 1)
        .andWhere("deleted", 0)
        .limit(1);

      if (!checkUsername || !checkUsername.id) {
        return {
          status: false,
          msg: "Invalid username",
        };
      }
      const [checkPassword] = await db("user")
        .select("user.*")
        .where("user.id", checkUsername.id)
        .andWhere("password", sha1(checkUsername.salt + password))
        .limit(1);

      if (!checkPassword || !checkPassword.id) {
        return {
          status: false,
          msg: "invalid password",
        };
      }
      delete checkPassword.salt;
      delete checkPassword.password;
      const token = jwt.sign({ data: checkPassword }, process.env.JWT_SECRET, {
        expiresIn: "362d",
      });
      return {
        success: true,
        data: {
          user: checkPassword,
          token,
        },
      };
    }),
};
