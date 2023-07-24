import { JobName } from "./types";
import { generateInvoiceJob } from "./jobs/generateInvoice";
import { channel, logBunyan } from ".";

export const receiveFromQueue = async () => {
  await channel.consume(JobName.SendInvoice, async (msg) => {
    logBunyan.info(
      `Message from ${JobName.SendInvoice} queue received being processed... `
    );
    const data = JSON.parse(msg.content.toString());
    const invoice = await generateInvoiceJob(data.objectForPDF, data.ownerInfo);
    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(invoice)),
      {
        correlationId: msg.properties.correlationId,
      }
    );

    logBunyan.info(`Invoice sent to the queue: ${JobName.SendInvoice}`);
    channel.ack(msg);
  });
};
