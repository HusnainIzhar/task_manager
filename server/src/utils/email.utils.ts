import nodemailer from "nodemailer";
require("dotenv").config();

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send welcome email to new users
export const sendWelcomeEmail = async (
  options: EmailOptions
): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "Task Manager <noreply@taskmanager.com>",
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${options.email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
