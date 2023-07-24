export type Task = {
  taskName: string;
  cost: number;
};
export type Owner = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  address: string;
  phone: string;
};

export type InvoiceRequest = {
  email: string;
  completedTasks: Task[];
};

export type ObjectForPDF = {
  clientEmail: string;
  name: string;
  address: string;
  scope: string;
  firstName: string;
  lastName: string;
  summCost: number;
  completedTasks: Task[];
  dateFormatDDMMYYYY: string;
  invoiceId: string;
};

export enum JobName {
  GenerateInvoice = "generateInvoice",
  SendInvoice = "sendInvoice",
}

export type ParramMessageQueue = {
  objectForPDF: ObjectForPDF;
  ownerInfo: Owner;
};
