import { documentClient } from '../awsConfig.js';
import { registerUser } from './registerUser.js';  // Import the registerUser controller

export const checkEmailVerification = async (req, res) => {
  const { token, email } = req.query;

  // Check if token and email are provided
  if (!token || !email) {
    return res.status(400).json({ error: "Token and Email are required." });
  }

  try {
    // Retrieve the token details from DynamoDB (PendingUsers table)
    const params = {
      TableName: 'PendingUsers',
      Key: { Email: email },
    };

    const result = await documentClient.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({ error: "Verification token not found." });
    }

    const { Token, TokenExpires, Verified } = result.Item;

    // Check if the email is already verified
    if (Verified) {
      return res.status(400).json({ error: "Email is already verified." });
    }

    // Check if the provided token matches and hasn't expired
    if (token !== Token || Date.now() > TokenExpires) {
      return res.status(400).json({ error: "Invalid or expired verification token." });
    }

    // Mark the email as verified in DynamoDB
    const updateParams = {
      TableName: 'PendingUsers',
      Key: { Email: email },
      UpdateExpression: "set Verified = :verified",
      ExpressionAttributeValues: { ":verified": true },
    };

    await documentClient.update(updateParams).promise();

    // Manually update result.Item in-memory after updating the database
    result.Item.Verified = true;

    // Register the user after email verification
    await registerUser(result.Item);  // Pass user data to registerUser

    // Optionally, remove the user from the 'PendingUsers' table after successful registration
    const deletePendingUserParams = {
      TableName: 'PendingUsers',
      Key: { Email: email },
    };

    await documentClient.delete(deletePendingUserParams).promise();

    // Respond with success message
    return res.json({ message: "Email verified successfully and user registered!" });

  } catch (err) {
    console.error('Error verifying email or registering user:', err);
    return res.status(500).json({ error: "Internal server error" });
  }
};