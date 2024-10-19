
import { documentClient } from '../awsConfig.js';


export const updateApplicationStatus = async (req, res) => {


  const { proposalID, applicationStatus } = req.body;

  try {

    const params = {

            TableName: 'Proposals',
            Key: { proposalID: proposalID },
            UpdateExpression: 'set applicationStatus = :status',
            ExpressionAttributeValues: {
              ':status': applicationStatus,
            }
        }
    // Update the current proposal status
    await documentClient.update(params).promise();

    res.status(200).send('Proposal status updated successfully');
  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).send('Error updating proposal status');
  }
};


