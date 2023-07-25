import * as express from "express";
import { generateInoice } from "../controllers/invoices";

export const invoices: express.IRouter = express.Router();

invoices.post("/generateInvoice", generateInoice);
