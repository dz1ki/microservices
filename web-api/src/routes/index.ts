import * as express from "express";
import { invoices } from "./invoices";

export const router: express.IRouter = express.Router();

router.use("/", invoices);
