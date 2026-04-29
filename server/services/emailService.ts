import nodemailer from 'nodemailer';

// professional email service
// For production, use actual SMTP details or SendGrid/resend
export const sendOTP = async (email: string, otp: string) => {
  // Mock transporter for development - logs to console
  if (!process.env.SMTP_HOST) {
    console.log('------------------------------------');
    console.log(`EMAIL TO: ${email}`);
    console.log(`SUBJECT: Verify your SkyWay account`);
    console.log(`BODY: Your OTP is ${otp}`);
    console.log('------------------------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"SkyWay Travel" <no-reply@skyway.travel>',
    to: email,
    subject: "Verify your account",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="color: #0ea5e9;">SkyWay Travel</h1>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; padding: 20px; background: #f0f9ff; display: inline-block; border-radius: 10px;">${otp}</div>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });
};
