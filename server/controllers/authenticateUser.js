import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { documentClient } from '../awsConfig.js';

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual JWT secret

export const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Email received = ", email);
  console.log('Password received =', password);

  const params = {
    TableName: 'Users',
    IndexName: 'EmailIndex', // Use the Global Secondary Index
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const data = await documentClient.query(params).promise();
    console.log(data)
  
    if (!data.Items) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = data.Items[0];
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign(
      { email: user.Email },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};