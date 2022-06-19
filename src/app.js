import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import db from "./config/database.js";

const app = express();
app.use(bodyParser.json());
app.use("/", routes);
app.database = db;

function setupApp(flag) {
  if (flag === 1) {
    db.on("error", console.log.bind(console, "DB connection error."));
    db.once("open", () => {
      console.log("Successful connection with DB");
    });
    return app;
  } else if (flag === 0) {
    return app;
  }
}

export default setupApp;
