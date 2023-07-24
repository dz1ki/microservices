import { Company } from "../models/company";
import { Client } from "../models/client";
import { v4 as uuidv4 } from "uuid";
import { JobName, ObjectForPDF, Task } from "../types";
import { ownerInfo } from "../data/constants";
import { sendToQueue } from "../queue/invoiceQueue";
import { logBunyan } from "../index";

function getSumm(completedTasks: Task[]) {
  return completedTasks.reduce((accum: number, element: { cost: number }) => {
    accum = element.cost + accum;
    return accum;
  }, 0);
}

function getFormatedDate() {
  const dateNow: Date = new Date();
  return (
    dateNow.getDate() +
    "." +
    ("0" + (dateNow.getMonth() + 1)) +
    "." +
    dateNow.getFullYear()
  );
}

export async function generate(clientEmail: string, completedTasks: Task[]) {
  const invoiceId: string = uuidv4();
  const client: Client = await Client.findOne({
    where: { email: clientEmail },
    include: [
      {
        model: Company,
        attributes: ["name", "address", "scope"],
        required: false,
        as: "company",
      },
    ],
  });
  if (!client) {
    throw { message: "Invalid email", statusCode: 400 };
  }
  const { firstName, lastName }: Client = client;
  const { name, address, scope }: Company = client.company;
  const summCost = getSumm(completedTasks);
  const dateFormatDDMMYYYY = getFormatedDate();
  const objectForPDF: ObjectForPDF = {
    clientEmail,
    name,
    address,
    scope,
    firstName,
    lastName,
    summCost,
    completedTasks,
    dateFormatDDMMYYYY,
    invoiceId,
  };
  const message = { objectForPDF, ownerInfo };

  const resultJobs = await sendToQueue(
    JobName.GenerateInvoice,
    JobName.SendInvoice,
    message
  );

  return { message: resultJobs, statusCode: 200 };
}
