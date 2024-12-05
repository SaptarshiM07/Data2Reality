import { documentClient } from '../awsConfig.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendEmail from '../sendEmail.js';

dotenv.config();

const endpointPath = process.env.ENDPOINT_PATH || 'http://localhost:3000'; //need to change it client domain in AWS ALB

export const sendEmailVerification = async (req, res) => {
    const { Email, FirstName, LastName, UIN, MiddleInitials, Password, UserType } = req.body;

    // Validate required fields
    if (!Email || !FirstName || !LastName || !UIN || !Password) {
        return res.status(400).json({ error: "All required fields must be provided." });
    }

    try {
        // Generate a verification token with 5-minute expiration
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes in the future

        // Store user data temporarily in the PendingUsers table
        const params = {
            TableName: 'PendingUsers',
            Item: {
                Email,
                FirstName,
                LastName,
                UIN,
                MiddleInitials: MiddleInitials || '',
                Password, // Ensure you hash this in production
                UserType,
                RegisteredAt: Date.now(),
                Token: token,
                TokenExpires: expires,
                Verified: false, // User is initially unverified
            },
        };

        await documentClient.put(params).promise();

        // Construct verification URL
        const verificationUrl = `${endpointPath}/verifyEmail?token=${token}&email=${Email}`;

        // Email content
        const subject = 'Email Verification';
        const bodyHtml = `
            <p>Hi ${FirstName},</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link will expire in 5 minutes.</p>
        `;

        // Send verification email
        await sendEmail(Email, subject, bodyHtml);

        // Respond with success
        res.json({ message: 'Verification email sent!' });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};