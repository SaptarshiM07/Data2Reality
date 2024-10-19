// middleware/auth.js
import jwt from 'jsonwebtoken';
import { documentClient } from '../awsConfig.js'; // Ensure this path is correct

const secretKey = process.env.JWT_SECRET; // Use your actual secret key

export const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;

    // Fetch user data from DynamoDB
    const params = {
      TableName: 'Users',
      IndexName: 'EmailIndex', // Assuming you're using a GSI for Email
      KeyConditionExpression: 'Email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const data = await documentClient.query(params).promise();

    if (data.Items.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach user data to request object for use in subsequent middleware
    req.user = data.Items[0];

    console.log('Authentication successful for email:', email);

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('Token has expired:', err);
      return res.status(401).json({ error: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      console.error('Invalid token:', err);
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      console.error('Token validation error:', err);
      return res.status(500).json({ error: 'Internal server error during token validation' });
    }
  }
};