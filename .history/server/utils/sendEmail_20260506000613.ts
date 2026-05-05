import nodemailer from "nodemailer";

const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
}) => {
  let transporter;
  let useEthereal = false;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      // Test the connection
      await transporter.verify();
    } catch (error: any) {
      console.error(`[SMTP ERROR] Custom SMTP failed: ${error.message}`);
      console.log("Falling back to Ethereal Mail for testing.");
      useEthereal = true;
    }
  } else {
    useEthereal = true;
  }

  if (useEthereal) {
    // Generate test account automatically for local/preview development without breaking
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(
      "Using Ethereal for email testing (no real SMTP provided or auth failed). Check logs for email preview URL.",
    );
  }

  const message = {
    from: `${process.env.FROM_NAME || "SkyWay"} <${process.env.FROM_EMAIL || "noreply@skyway.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter!.sendMail(message);

  if (useEthereal) {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

export default sendEmail;
