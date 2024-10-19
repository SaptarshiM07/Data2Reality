import AWS from 'aws-sdk';


const configureAWS = () => {
  try {
    console.log('Loaded environment variables:', {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
      snsTopicArn: process.env.REACT_APP_AWS_SNSTOPIC_ARN,
    });

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION || 'us-east-2'
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
const snsTopicArn = process.env.REACT_APP_AWS_SNSTOPIC_ARN; // Store snsTopicArn in a variable

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
};

// Initialize AWS and export clients
initializeAWS();

export { dynamo, documentClient, s3, sns, snsTopicArn }; // Correct export statement