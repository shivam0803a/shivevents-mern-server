const nodemailer = require("nodemailer");

const sendMail = async ({ email, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "kumarshivam4800@gmail.com",
        pass: "wopcisxmzprkzfvm",
      },
    });

    const mailOptions = {
      from: "kumarshivam4800@gmail.com",
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error while sending the mail" + error);
    return error;
  }
};

module.exports = sendMail;
