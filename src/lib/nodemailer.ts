"use-server";
import nodemailer from 'nodemailer';
import { EMAIL_PASS, EMAIL_USER } from '@/config';
interface SendEmailProps{
    to:string,
    subject:string,
    html:string,
}
export async function sendEmail({ to, subject, html }:SendEmailProps) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      to,
      subject,
      html,
    });
    console.log('Email send success');
  } catch (e) {
    console.error('Failed to send email', e);
  }
}
