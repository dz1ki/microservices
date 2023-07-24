import { v4 as uuidv4 } from "uuid";
import { JobName, ParramMessageQueue } from "../types";
import { channel } from "./index";
import { logBunyan } from "..";

export const promises = new Map();

export async function sendToQueue(
  generateInvoice: JobName,
  sendInvoice: JobName,
  message: ParramMessageQueue
) {
  const correlationId = uuidv4();

  const promise = new Promise((resolve, reject) => {
    promises.set(correlationId, { resolve, reject });
  });
  channel.sendToQueue(sendInvoice, Buffer.from(JSON.stringify(message)), {
    correlationId: correlationId,
    replyTo: generateInvoice,
  });

  const promiseGet = promises.get(correlationId);

  if (promiseGet) {
    setTimeout(() => {
      promiseGet.reject({
        message: "Service 'generate pdf' not responding",
        statusCode: 408,
      });
      promises.delete(correlationId);
    }, 17000);
  }
  logBunyan.info(
    `Data for generation Invoice is sent to the queue: ${sendInvoice}`
  );

  return promise;
}
