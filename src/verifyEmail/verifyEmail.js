import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const verifyEmail = async (token, email) => {
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
    subject: "Email Verification",
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:8001/verify/${token} 
           Thanks`
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