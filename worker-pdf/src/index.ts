import * as amqp from "amqplib";
import * as config from "config";
import { JobName } from "./types";
import { Channel } from "amqplib";
import { receiveFromQueue } from "./invoiceQueue";
import * as bunyan from "bunyan";
import * as path from "path";

export const logBunyan = bunyan.createLogger({
  name: "GeneratePDF",
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
export let channel: Channel;

async function connectToRabbitMQ() {
  const connection = await amqp.connect({
    hostname: config.get("amqpConfig.host"),
    port: config.get("amqpConfig.port"),
    username: config.get("amqpConfig.username"),
    password: config.get("amqpConfig.password"),
  });
  return await connection.createChannel();
}

async function initializeQueue(channel: Channel) {
  await channel.assertQueue(JobName.SendInvoice, {
    durable: false,
  });
  channel.prefetch(1);
}

async function startRabbitMQService() {
  try {
    channel = await connectToRabbitMQ();
    await initializeQueue(channel);
    await receiveFromQueue();
  } catch (error) {
    logBunyan.fatal("Error starting RabbitMQ Service: ", error);
  }
}

startRabbitMQService();
