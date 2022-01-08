const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "20mb" }));

app.use(express.static("public"));

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/store", require("./routes/store"));
app.use("/category", require("./routes/category"));
app.use("/product", require("./routes/product"));

app.listen(process.env.PORT || 3000, () => {
  console.log("App is runing on port " + process.env.PORT || 3000);
});
