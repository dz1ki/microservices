import * as bunyan from "bunyan";
import * as path from "path";

const levelInfo = "info";
const pathSave = "../../logs/allLogs.log";

function loggerConfig(name: string) {
  const streams: bunyan.Stream[] = [
    {
      level: levelInfo,
      stream: process.stdout,
    },
    {
      level: levelInfo,
      path: path.join(__dirname, pathSave),
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
