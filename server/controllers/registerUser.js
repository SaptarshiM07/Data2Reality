import { documentClient } from '../awsConfig.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmailVerification } from './sendEmailVerification.js';

// Function to check if a record with UIN or Email already exists
const checkIfExists = async (tableName, key, value) => {
  let params;

  if (key === 'Email') {
    // Query using the secondary index for Email
    params = {
      TableName: tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: `#${key} = :${key}`,
      ExpressionAttributeNames: {
        [`#${key}`]: key
      },
      ExpressionAttributeValues: {
        [`:${key}`]: value
      }
    };
  } else {
    // Query using the primary key for UIN
    params = {
      TableName: tableName,
      Key: {
        [key]: value
      }
    };
  }

  console.log(`Querying DynamoDB with params: ${JSON.stringify(params)}`);

  try {
    let data;
    if (key === 'Email') {
      data = await documentClient.query(params).promise();
      console.log(`Query result for Email: ${JSON.stringify(data)}`);
      return data.Items.length > 0; // Returns true if item exists, false if not
    } else {
      data = await documentClient.get(params).promise();
      console.log(`GetItem result for UIN: ${JSON.stringify(data)}`);
      return !!data.Item; // Returns true if item exists, false if not
    }
  } catch (err) {
    console.error(`Error checking if ${key} ${value} exists:`, err);
    throw err; // Throw error for caller to handle
  }
};

// Function to hash password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error; // Throw error for caller to handle
  }
};

export const registerUser = async (req, res) => {
  const { UIN, FirstName, MiddleInitals, LastName, Email, Password, UserType } = req.body; // added UserType  //removed Confirm_Password

  console.log('Received UserType:', UserType); // Debugging statement

  try {
    // Check if UIN or Email already exists in User table
    const isDuplicate = await checkIfExists('Users', 'UIN', UIN) || await checkIfExists('Users', 'Email', Email);

    if (isDuplicate) {
      return res.status(400).json({ error: `${UserType} with this UIN or Email already exists` });
    } 

    // Hash the password
    const hashedPassword = await hashPassword(Password);

    const params = {
      TableName: 'Users',
      Item: {
        UIN,
        FirstName,
        MiddleInitals,
        LastName,
        UserType,
        Email,
        Password: hashedPassword // hashed password
      }
    };

    await documentClient.put(params).promise();
    res.status(201).json({ message: `${UserType} registered successfully` });
  } catch (err) {
    console.error(`Error registering ${UserType}:`, err);
    res.status(500).json({ error: `Could not register ${UserType}`, details: err });
  }
};