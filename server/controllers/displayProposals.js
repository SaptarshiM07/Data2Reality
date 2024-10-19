import { documentClient } from '../awsConfig.js';

const PROPOSALS_TABLE = 'Proposals'; // Replace with your actual table name
const PROJECT_ID_INDEX = 'projectIDIndex';
const APPLICANT_UIN_INDEX = 'applicantUINIndex';
const PROJECTID_APPLICANTID_INDEX = 'ProjectApplicantIndex'

export const displayProposals  = async (req, res) => {
  const { ProjectID } = req.query; // Get projectID and userInfo from query parameters
  const {UIN, UserType} = req.user;

  console.log("This is my Information:", req.user)
  console.log("This is my project", req.query);

  console.log("This is test", req.query );

 

  console.log("ProjectID:", ProjectID, "Type:", typeof ProjectID);
  console.log("Applicant UIN:", UIN, "Type:", typeof UIN);

  // Set params based on user type
  let params;

  if (UserType === 'Employer') {
    // Employer: Fetch all proposals for the given projectID
    params = {
      TableName: PROPOSALS_TABLE,
      IndexName: PROJECT_ID_INDEX,
      KeyConditionExpression: 'projectID = :projectId',
      ExpressionAttributeValues: {
        ':projectId': ProjectID,
      },
    };
  } else if (UserType === 'Student') {
    // Student: Fetch only the first proposal for the given projectID and applicantUIN
    params = {
      TableName: PROPOSALS_TABLE,
      IndexName: PROJECTID_APPLICANTID_INDEX,
      KeyConditionExpression: 'projectID = :projectId and applicantUIN = :applicantUIN',
      ExpressionAttributeValues: {
        ':projectId': ProjectID,
        ':applicantUIN': UIN,
      },
      Limit: 1, // Limit to fetch only one proposal
    };
  } else {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  try {
    // Fetch proposals based on the constructed params
    const data = await documentClient.query(params).promise();
    const proposals = data.Items || []; // Ensure it's an array // in case a project has only 1 proposal, send as single item array else for stduent it will send a single proposal.

    // Log the fetched proposals
    console.log("Fetched Proposals:", proposals);

    // Send the response
    res.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
};