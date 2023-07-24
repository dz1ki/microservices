import { logBunyan } from "..";
import { generate } from "../service/invoices";
import { InvoiceRequest } from "../types";
import { Request, Response } from "express";

export async function generateInoice(request: Request, response: Response) {
  try {
    const { email, completedTasks }: InvoiceRequest = request.body;
    const result = await generate(email, completedTasks);
    response.status(result.statusCode || 200).send(result.message);
  } catch (error) {
    logBunyan.warn("GenerateInoice, controller error", error);
    response
      .status(error.statusCode || 500)
      .json(error.message || "Server error");
  }
}
