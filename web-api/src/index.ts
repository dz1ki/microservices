import * as express from "express";
import sequelize from "./models";
import * as config from "config";
import { router } from "./routes/index";
import * as swaggerUI from "swagger-ui-express";
import * as YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";
import * as bunyan from "bunyan";
import * as path from "path";

export const logBunyan = bunyan.createLogger({
  name: "Invoice",
  streams: [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "info",
      path: path.join(__dirname, "../logs/invoice-info.log"),
    },
  ],
});

const apiSpec = YAML.load("./src/docs/openApi.yaml");
const port: number = config.get("app.port") || 5000;
const app: express.Application = express();
app.use(express.json());
app.use("/api", swaggerUI.serve, swaggerUI.setup(apiSpec));
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true,
  })
);
app.use((err, req, res, next) => {
  logBunyan.warn("The request failed.", err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});
app.use("/", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(port, () => console.log("Server started on port " + port));
  } catch (error) {
    logBunyan.fatal("Server startup error.", error);
  }
};
start();
