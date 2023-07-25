import * as bunyan from "bunyan";
import * as path from "path";

function loggerConfig(name: string) {
  const streams: bunyan.Stream[] = [
    {
      level: "info",
      stream: process.stdout,
    },
    {
      level: "info",
      path: path.join(__dirname, "../../logs/allLogs.log"),
    },
  ];
  return {
    name,
    streams,
  };
}
export function buildLogger(name: string) {
  return bunyan.createLogger(loggerConfig(name));
}
