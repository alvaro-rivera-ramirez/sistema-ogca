const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const APP_ROUTES = require("./src/routes/index.routes");
const {
  app: { port, domain },
} = require("./src/config/constants");
class Server {
  constructor() {
    this.app = express();

    this.config();
    this.routes();
  }

  config() {
    this.app.set("PORT", port);
    this.app.use(morgan("dev"));
    this.app.use(
      cors()
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  middlewares() {}

  routes() {
    this.app.use(express.static(path.join(__dirname, "out")));
    this.app.use("/api", APP_ROUTES);
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname,"out", 'index.html'));
    });
  }

  listen() {
    this.app.listen(this.app.get("PORT"), (err) => {
      if (err) console.log("Server Fail");
      else console.log(`Server at running on port ${this.app.get("PORT")}`);
    });
  }
}

module.exports = Server;
