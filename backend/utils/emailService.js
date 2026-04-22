import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

// This should be your actual Gmail address for SMTP fallback
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

// Preferred sender for Resend (must be from a verified domain)
const resendFromAddress = process.env.RESEND_FROM || process.env.EMAIL_FROM || "";

// Sender used when falling back to SMTP
const smtpFromAddress = process.env.EMAIL_FROM || smtpUser || "";

const extractEmail = (value = "") => {
  const trimmed = String(value).trim();
  const match = trimmed.match(/<([^>]+)>/);
  return (match?.[1] || trimmed).toLowerCase();
};

const isGmailAddress = (value = "") => extractEmail(value).endsWith("@gmail.com");

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
  if (resendClient) {
    const resendFrom = mailOptions.from || resendFromAddress;

    if (!resendFrom) {
      throw new Error(
        "RESEND_FROM (or EMAIL_FROM) is required when RESEND_API_KEY is configured"
      );
    }

    if (isGmailAddress(resendFrom)) {
      throw new Error(
        "Resend sender must be on a verified domain. Do not use a gmail.com from address"
      );
    }

    await resendClient.emails.send({
      ...mailOptions,
      from: resendFrom,
    });
    return;
  }

  if (!smtpFromAddress && !mailOptions.from) {
    throw new Error(
      "EMAIL_USER or EMAIL_FROM is required for SMTP fallback when Resend is not configured"
    );
  }

  const resolvedMail = {
    ...mailOptions,
    from: mailOptions.from || smtpFromAddress,
  };

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
