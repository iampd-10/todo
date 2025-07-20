// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// export const verifyEmail = async (token, email, username, password) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.email,
//       pass: process.env.password,
//     },
//   });

//   const mailConfigurations = {
//     from: process.env.email,
//     to: email,
//     subject: "Email Verification",
//     text: `Hi ${username},
//            You have recently visited 
//            our website and entered your email.
//            Please follow the given link to verify your email
//            http://localhost:8001/user/verify/${token} 
//            and your login Password is ${password} 
//            please don't share with anyone.
//            Please make sure to verify
//            This is for mock practice not a real verification 
//            Thanks`,
//   };

//   transporter.sendMail(mailConfigurations, function (error, info) {
//     if (error) {
//       console.error("Error sending email:", error);
//       throw new Error(error);
//     }
//     console.log(`Email send successfully to ${username}`);
//     console.log(info);
//   });
// };

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyEmail = async (token, email, userName, password) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname,"template.hbs"),
    "utf-8"
  );
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ token, userName, password });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const mailConfigurations = {
    from: process.env.email,
    to: email,
    subject: `Email Verification for ${userName} on account creation`,
    html: htmlToSend,
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error);
    }
    console.log("Email Sent Successfully");
    console.log(info);
  });
};