import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const configureAWS = () => {
  try {
    console.log('Loaded environment variables:', {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-2'
    });

    console.log('AWS SDK configured successfully');
  } catch (error) {
    console.error('Error configuring AWS SDK:', error);
    process.exit(1);  // Exit the process with a failure code
  }
};

let dynamo;
let documentClient;
let s3;
let sns;
let ses;

const initializeAWS = () => {
  configureAWS();

  try {
    dynamo = new AWS.DynamoDB();
    documentClient = new AWS.DynamoDB.DocumentClient();
    console.log('DynamoDB clients created successfully');
  } catch (error) {
    console.error('Error creating DynamoDB clients:', error);
    process.exit(1);  // Exit the process with a failure code
  }

  try {
    s3 = new AWS.S3();
    console.log('S3 client created successfully');
  } catch (error) {
    console.error('Error creating S3 client:', error);
    process.exit(1);  // Exit the process with a failure code
  }

  try {
    sns = new AWS.SNS(); // Initialize SNS client
    console.log('SNS client created successfully');
  } catch (error) {
    console.error('Error creating SNS client:', error);
    process.exit(1);  // Exit the process with a failure code
  }

  try {
    ses = new AWS.SES();
    console.log('SES client created successfully');
  }catch (error) {
    console.error('Error creating SES client', error);
    process.exit(1);
  }
};

//initializeAWS(); // no need to call it again.

export { initializeAWS, dynamo, documentClient, s3, sns, ses};