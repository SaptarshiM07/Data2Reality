import { ses } from './awsConfig.js';

/**
 * Send an email using AWS SES.
 * @param {string} toEmail - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} bodyHtml - HTML body content.
 */
const sendEmail = async (toEmail, subject, bodyHtml) => {
    const params = {
        Source: 'your_verified_email@verifieddomain.com', // Use your verified email
        Destination: {
            ToAddresses: [toEmail],
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: bodyHtml,
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

export default sendEmail;