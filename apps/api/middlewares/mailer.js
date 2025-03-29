const AWS = require('aws-sdk');

// Initialize AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,  
});

const SES = new AWS.SES();

// Helper function to send emails (generic)
const sendEmail = async (to, subject, body) => {
  const params = {
    Source: process.env.S3_FROM_EMAIL, // The 'From' email address
    Destination: {
      ToAddresses: [to], // Recipient email address
    },
    Message: {
      Subject: { Data: subject }, // Email subject
      Body: {
        Text: { Data: body }, // Email body
      },
    },
  };

  try {
    const emailSent = await SES.sendEmail(params).promise();
    console.log('Email sent successfully:', emailSent);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };








