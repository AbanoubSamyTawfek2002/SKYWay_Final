import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { Contact } from '../models/Contact.js';

export const submitContact = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Save to DB
  const contact = await Contact.create({ name, email, subject, message });

  // Send Email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `SkyWay Contact <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'admin@skyway.com',
      subject: `New Support Request: ${subject || 'No Subject'}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
        Time: ${new Date().toLocaleString()}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Support ticket created and email sent successfully', contact });
  } catch (error) {
    console.error('Email Error:', error);
    // We still return success because contact was saved to DB
    res.status(201).json({ message: 'Ticket created, but email notification failed.', contact });
  }
};
