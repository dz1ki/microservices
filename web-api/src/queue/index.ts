import * as amqp from "amqplib";
import * as config from "config";
import { promises } from "./invoiceQueue";
import { JobName } from "../types";
import { Channel } from "amqplib";
import { logBunyan } from "..";

export let channel: Channel;

export async function consumeInvoices(channel: Channel) {
  channel.consume(JobName.GenerateInvoice, (msg: amqp.ConsumeMessage) => {
    const correlationId = msg.properties.correlationId;

    const promise = promises.get(correlationId);

    if (promise) {
      const result = JSON.parse(msg.content.toString());
      promise.resolve(Buffer.from(result.data));
      logBunyan.info(
        `Message from ${JobName.GenerateInvoice} queue processed.`
      );
      promises.delete(correlationId);
    } else {
      logBunyan.warn(
        `No promise found for correlationId("Maybe communication failed with microservice(worcer-pdf)"): ${correlationId}`
      );
    }
    channel.ack(msg);
  });
}

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
  await channel.assertQueue(JobName.GenerateInvoice, { exclusive: true });
  await consumeInvoices(channel);
}

async function startRabbitMQService() {
  try {
    channel = await connectToRabbitMQ();
    await initializeQueue(channel);
  } catch (error) {
    logBunyan.fatal("Error starting RabbitMQ Service: ", error);
  }
}

startRabbitMQService();
