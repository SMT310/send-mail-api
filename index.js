import express from 'express';
import cors from 'cors';
import { sendMail } from './mailer.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/send-mail', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate incoming fields
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields: name, email, message' });
    }

    // Map form data to email fields
    const mailData = {
        to: process.env.SMTP_USER,
        subject: `New Message from ${name}`,
        text: `From: ${name} (${email})\n\n${message}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
        replyTo: email 
    };

    try {
        await sendMail(mailData);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server live at http://localhost:${port}`);
});