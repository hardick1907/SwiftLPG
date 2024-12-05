import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({

  service: "Gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error configuring email transporter:", error);
  } else {
    console.log("Email transporter ready");
  }
});
