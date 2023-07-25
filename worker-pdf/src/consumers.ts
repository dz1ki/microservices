import { JobName } from "./types";
import { generateInvoiceJob } from "./jobs/generateInvoice";
import { channel } from ".";
import { buildLogger } from "./libs/logger";

export const invoiceConsumer = () => {
  const logger = buildLogger("invoiceConsumer");
  channel.consume(JobName.GenerateInvoice, async (msg) => {
    logger.info(
      `Message from ${JobName.GenerateInvoice} queue received being processed... `
    );

    const data = JSON.parse(msg.content.toString());

    const invoice = await generateInvoiceJob(data.objectForPDF, data.ownerInfo);

    const { replyTo, correlationId } = msg.properties;

    channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(invoice)), {
      correlationId,
    });

    logger.info(`Message sent to the queue: ${JobName.InvoiceGenerated}`);

    channel.ack(msg);
  });
};
