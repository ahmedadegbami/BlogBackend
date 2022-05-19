import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendRegistrationEmail = async (recipientAddress) => {
  // send email to recipient

  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "This is my first email with Sendgrid! Yeeeeeeeeeeee!",
    text: "bla bla bla",
    html: "<strong> bla bla bla in bold </strong>",
  };

  await sgMail.send(msg);
};
