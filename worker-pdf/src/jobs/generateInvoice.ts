import * as PDFDocument from "pdfkit";
import { generatePDF } from "../utils/generatePDF";
import { ObjectForPDF, Owner } from "../types";
import { logBunyan } from "..";

export async function generateInvoiceJob(
  objectForPDF: ObjectForPDF,
  ownerInfo: Owner
) {
  return await new Promise(async (resolve, reject) => {
    const doc: PDFDocument = new PDFDocument({
      margin: 20,
      bufferPages: true,
    });
    const buffers: any[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("error", (error) => {
      logBunyan.error("Pdf generation error", error);
      reject(error);
    });
    doc.on("end", async () => {
      resolve(Buffer.concat(buffers));
    });

    await generatePDF(objectForPDF, ownerInfo, doc);
    doc.end();
  });
}
