import sgMail from "@sendgrid/mail";
import fs from "fs";
import { readFile } from "fs";
import { pdfFilePath } from "./fs-tools.js";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendRegistrationEmail = async (recipientAddress, pdf) => {
  fs.readFile(pdfFilePath, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // const buffer = await streamToBuffer(pdf);
      const attachment = data.toString("base64");

      // send email to recipient

      const msg = {
        to: recipientAddress,
        from: process.env.SENDER_EMAIL,
        subject: "This is my first email with Sendgrid! Yeeeeeeeeeeee!",
        text: "I am here to test the Sendgrid API",
        html: "<strong>I am super proud of myself </strong>",
        attachments: [
          {
            content: attachment,
            filename: "test.pdf",
            type: "application/pdf",
            disposition: "attachment"
          }
        ]
      };
      await sgMail.send(msg);
    }
  });
};
