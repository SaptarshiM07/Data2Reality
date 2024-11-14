import { documentClient } from '../awsConfig.js';
import crypto from 'crypto';
import sendEmail from '../sendEmail.js';  // Import the SendGrid email function
import dotenv from 'dotenv';

dotenv.config(); 



const endpointpath = process.env.ENDPOINT_PATH || 'http://localhost:3000';

export const sendEmailVerification = async (req, res) => {
    const { Email, FirstName, LastName, UIN, MiddleInitials, Password, UserType } = req.body;

    // Check if all required fields are provided
    if (!Email || !FirstName || !LastName || !UIN || !Password) {
        return res.status(400).json({ error: "All required fields must be provided." });
    }

    try {
        // Generate a verification token with 5-minute expiration
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 5 * 60 * 1000;  // 5 minutes in the future

        // Store the user data temporarily in the `PendingUsers` table
        const params = {
            TableName: 'PendingUsers',
            Item: {
                Email,                        // Primary key (email as identifier)
                FirstName,
                LastName,
                UIN,
                MiddleInitials: MiddleInitials || '',
                Password,                    // Ensure you hash this in a real application
                UserType,
                RegisteredAt: Date.now(),
                Token: token,                // Save the verification token
                TokenExpires: expires,       // Save the expiration time for the token
                Verified: false,             // Initially false, user is not yet verified
            },
        };

        // Save user in PendingUsers table
        await documentClient.put(params).promise();

        // Construct the verification URL
        const verificationUrl = `${endpointpath}/verifyEmail?token=${token}&email=${Email}`;

        // Send the verification email using SendGrid
        await sendEmail(
            Email,                         // Recipient email
            'Email Verification',          // Subject
            `Hi ${FirstName},<br>Please click the link below to verify your email address:<br><a href="${verificationUrl}">${verificationUrl}</a><br>This link will expire in 5 minutes.` // HTML body
        );

        // Respond with success
        res.json({ message: 'Verification email sent!' });

    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};