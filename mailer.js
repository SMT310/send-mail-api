import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: true,
    auth: {
        user: process.env.SMTP_USER, // sonchymto310@gmail.com
        pass: process.env.SMTP_PASS  // Your App Password
    },
});

export async function sendMail({ to, subject, text, html, replyTo }) {
    const mailOptions = {
        from: `"Your App" <${process.env.SMTP_USER}>`,
        to,                                           
        subject,
        text,
        html
    };

    // Add replyTo only if it’s defined and not empty
    if (replyTo && replyTo.trim() !== '') {
        mailOptions.replyTo = replyTo;
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}