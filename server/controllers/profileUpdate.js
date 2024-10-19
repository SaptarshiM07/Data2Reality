import { documentClient } from '../awsConfig.js';

export const profileUpdate =  async (req, res) => {
    try {
        const {
            UIN,
            FirstName,
            MiddleInitials,
            LastName,
            Email,
            Password,
            UserType,
            Secondary_Role,
            User_Dept,
            Employer_Title,
            Student_Status,
            Student_Degree
        } = req.body;

        //console.log(req)

        const resumeUrl  = req.fileUrl || '';

        //console.log(resumeUrl)

        // Prepare the item to be replaced
        const item = {
            UIN,
            FirstName,
            MiddleInitials,
            LastName,
            Email,
            Password,
            UserType,
            Secondary_Role,
            User_Dept,
            Employer_Title,
            Student_Status,
            Student_Degree,
            Student_Resume: resumeUrl // Include new or updated attributes
        };

        // Replace the item in DynamoDB
        const params = {
            TableName: 'Users',
            Item: item
        };

        await documentClient.put(params).promise();

        res.status(200).json({ message: 'Profile updated successfully.', item });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};