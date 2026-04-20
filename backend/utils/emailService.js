import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

// This should be your actual Gmail address for SMTP fallback
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

// This is your verified Resend sender address
const fromAddress = "Hiring Team <noreply@hire-ly.tech>";

const transport465 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

const transport587 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

export const sendMailWithFallback = async (mailOptions) => {
  const resolvedMail = {
    ...mailOptions,
    from: mailOptions.from || fromAddress,
  };

  if (resendClient) {
    await resendClient.emails.send(resolvedMail);
    return;
  }

  // Fallback to SMTP if Resend is not configured
  try {
    await transport465.sendMail(resolvedMail);
  } catch (error) {
    console.warn("SMTP 465 failed, retrying on 587:", error?.message || error);
    await transport587.sendMail(resolvedMail);
  }
};

export const sendInterviewEmail = async (to, jobTitle, interviewLink) => {
  const mailOptions = {
    from: fromAddress,
    to: to,
    subject: "AI Interview Invitation",
    html: `
     <h2>Congratulations!</h2>
     <p>You passed the MCQ test for ${jobTitle}</p>
     <p>Start your AI Interview here:</p>
     <a href="${interviewLink}">${interviewLink}</a>
   `,
  };

  await sendMailWithFallback(mailOptions);
};
