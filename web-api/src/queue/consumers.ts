import { Channel } from "amqplib";
import * as amqp from "amqplib";
import { promises } from "../helpers/promises";
import { JobName } from "../types";
import { buildLogger } from "../libs/logger";

export function consumeInvoices(channel: Channel) {
  const logger = buildLogger("queue-consumeInvoices");
  channel.consume(JobName.InvoiceGenerated, (msg: amqp.ConsumeMessage) => {
    const correlationId = msg.properties.correlationId;

    const promise = promises.get(correlationId);

    if (promise) {
      const result = JSON.parse(msg.content.toString());

      promise.resolve(Buffer.from(result.data));

      logger.info(`Message from ${JobName.InvoiceGenerated} queue processed.`);

      promises.delete(correlationId);
    } else {
      logger.warn(
        `No promise found for correlationId("Maybe communication failed with microservice(worcer-pdf)"): ${correlationId}`
      );
    }
    channel.ack(msg);
  });
}
