import nodemailer from 'nodemailer';

// Create a Nodemailer transporter using SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',  // This is the username for SendGrid (fixed as 'apikey')
    pass: process.env.SENDGRID_API_KEY,  // Your SendGrid API Key
  },
});

// Send email using the SendGrid transporter
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'saptarshi031998@gmail.com',  // Sender email
    to,  // Recipient email
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;