import nodemailer from "nodemailer";

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

    try {
        await transport465.sendMail(mailOptions);
    } catch (error) {
        console.warn("SMTP 465 failed, retrying on 587:", error?.message || error);
        await transport587.sendMail(mailOptions);
    }
};