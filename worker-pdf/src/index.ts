import * as amqp from "amqplib";
import * as config from "config";
import { JobName } from "./types";
import { Channel } from "amqplib";
import { invoiceConsumer } from "./consumers";
import { buildLogger } from "./libs/logger";

const logger = buildLogger("start-RabbitMQ");

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
  channel.assertQueue(JobName.GenerateInvoice, {
    durable: false,
  });
  channel.prefetch(1);
}

async function startRabbitMQService() {
  try {
    channel = await connectToRabbitMQ();
    initializeQueue(channel);
    invoiceConsumer();
  } catch (error) {
    logger.fatal("Error starting RabbitMQ Service: ", error);
  }
}

startRabbitMQService();
