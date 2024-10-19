import { documentClient } from '../awsConfig.js';

// Example endpoint handler in Express.js
export const addRole = async (req, res) => {
  const { UIN, ...attributesToUpdate } = req.body; // Assuming UIN is included in req.body

  // Construct the item to be put in the table
  const item = { UIN, ...attributesToUpdate };

  // Construct params for documentClient.put
  const params = {
    TableName: 'Users', // Replace with your DynamoDB table name
    Item: item, // The entire item to be stored in the table
    ReturnValues: 'ALL_OLD' // Returns the old item attributes before the update
  };

  try {
    const data = await documentClient.put(params).promise();
    console.log('Item updated successfully:', data);
    res.status(200).json({ message: 'Item updated successfully', oldData: data.Attributes });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};