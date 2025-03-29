const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY, 
    region: process.env.S3_REGION, 
});

// Create SES service object
const ses = new AWS.SES();

const sendEmail = async (toEmail, subject, body) => {
    const params = {
        Source: process.env.S3_FROM_EMAIL, // Verified email in SES
        Destination: {
            ToAddresses: [toEmail], // Recipient email address
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: body, // HTML body content
                    Charset: 'UTF-8',
                },
                Text: {
                    Data: body, // Plain text body content
                    Charset: 'UTF-8',
                },
            },
        },
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;