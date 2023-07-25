import * as express from "express";
import sequelize from "./models";
import * as config from "config";
import { router } from "./routes/index";
import * as swaggerUI from "swagger-ui-express";
import * as YAML from "yamljs";
import * as OpenApiValidator from "express-openapi-validator";
import { startRabbitMq } from "./queue";
import { buildLogger } from "./libs/logger";

const logger = buildLogger("server");
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
  logger.warn("The request failed.", err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});
app.use("/", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await startRabbitMq();
    app.listen(port, () => logger.info("Server started on port " + port));
  } catch (error) {
    logger.fatal("Server startup error.", error);
  }
};
start();
