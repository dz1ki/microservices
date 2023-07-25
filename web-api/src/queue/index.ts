import * as amqp from "amqplib";
import * as config from "config";
import { JobName } from "../types";
import { Channel } from "amqplib";
import { consumeInvoices } from "./consumers";
import { buildLogger } from "../libs/logger";

export let channel: Channel;

const logger = buildLogger("queue-index");

async function connect() {
  const connection = await amqp.connect({
    hostname: config.get("amqpConfig.host"),
    port: config.get("amqpConfig.port"),
    username: config.get("amqpConfig.username"),
    password: config.get("amqpConfig.password"),
  });

  return await connection.createChannel();
}

async function initializeQueue(channel: Channel) {
  channel.assertQueue(JobName.InvoiceGenerated, { exclusive: true });
  consumeInvoices(channel);
}

export async function startRabbitMq() {
  try {
    channel = await connect();
    initializeQueue(channel);
  } catch (error) {
    logger.fatal("Error starting RabbitMQ Service: ", error);
  }
}
