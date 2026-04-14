import nodemailer from "nodemailer";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const transport465 = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
});

const transport587 = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
});

export const sendMailWithFallback = async (mailOptions) => {
    const resolvedMail = {
        ...mailOptions,
        from: mailOptions.from || process.env.EMAIL_FROM || process.env.EMAIL_USER
    };

    if (resendClient) {
        await resendClient.emails.send({
            from: resolvedMail.from,
            to: resolvedMail.to,
            subject: resolvedMail.subject,
            html: resolvedMail.html,
            text: resolvedMail.text,
            cc: resolvedMail.cc,
            bcc: resolvedMail.bcc,
            reply_to: resolvedMail.replyTo
        });
        return;
    }

    try {
        await transport465.sendMail(resolvedMail);
    } catch (error) {
        console.warn("SMTP 465 failed, retrying on 587:", error?.message || error);
        await transport587.sendMail(resolvedMail);
    }
};

export const sendInterviewEmail = async (to, jobTitle, interviewLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "AI Interview Invitation",
        html: `
     <h2>Congratulations!</h2>
     <p>You passed the MCQ test for ${jobTitle}</p>
     <p>Start your AI Interview here:</p>
     <a href="${interviewLink}">${interviewLink}</a>
   `
    };

    await sendMailWithFallback(mailOptions);
};