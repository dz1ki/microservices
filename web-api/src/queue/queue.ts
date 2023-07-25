import { v4 as uuidv4 } from "uuid";
import { promises, rejectAndClearPromiseByTimeout } from "../helpers/promises";
import { JobName, ParramMessageQueue } from "../types";
import { channel } from "./index";
import { buildLogger } from "../libs/logger";

const ASYNC_TASK_TIMEOUT = 7000;

export async function sendToQueueAsync(
  firstTaskName: JobName,
  secondTaskName: JobName,
  message: ParramMessageQueue
) {
  const logger = buildLogger("queue-sendToQueueAsync");
  const correlationId = uuidv4();

  const promise = new Promise((resolve, reject) => {
    promises.set(correlationId, { resolve, reject });
  });

  channel.sendToQueue(firstTaskName, Buffer.from(JSON.stringify(message)), {
    correlationId: correlationId,
    replyTo: secondTaskName,
  });

  const currentPromise = promises.get(correlationId);

  if (currentPromise) {
    const rejectData = {
      message: `Service ${secondTaskName} not responding`,
      statusCode: 408,
    };

    rejectAndClearPromiseByTimeout(
      correlationId,
      currentPromise,
      rejectData,
      ASYNC_TASK_TIMEOUT
    );
  }

  logger.info(`Message is sent to the queue: ${firstTaskName}`);

  return promise;
}
