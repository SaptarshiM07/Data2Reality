import { documentClient } from '../awsConfig.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadUpdate = (Status) => async (req, res) => {

    if (req.path === '/save' || req.path === '/submit') {
            try {
                const { 
                    //Employer fields
                    projectID,
                    requesterUIN, 
                    requesterName, 
                    requesterTitle, 
                    requesterDepartment, 
                    requesterEmail,
                    requestTitle, 
                    proposalDeadline,
                    startDate, 
                    endDate, 
                    keywords, 
                    projectSummary, 
                    desiredOutcomes, 
                    collaborators, 
                    specificLocation, 
                    locationDetails, 
                    projectRestrictions, 
                    availableResources, 
                    studentFunding, 
                    fundingDetails, 
                    alternateContact, 
                    specialInstructions,

                    //Student part of the form
                    proposalID,
                    applicantName,
                    applicantEmail,
                    applicantUIN,
                    proposalTitle,
                    status,
                    degreeProgram,
                    experience,
                    ableToMeetRequirements,
                    unmetRequirements,
                    proposalSummary,
                    anticipatedOutcomes,
                    applicationStatus,

                } = req.body;

                const UserType = req.headers['usertype'];
                console.log(UserType);

                // Access the uploaded file URLs
                const proposalvideofileUrl = req.proposalvideofileUrl || 'No proposal video file uploaded';
                const resumefileUrl = req.resumefileUrl || 'No resume file uploaded';
                const supplementalfileUrl = req.supplementalfileUrl || 'No supplemental file uploaded';

                console.log(proposalvideofileUrl);

                // Generate or use existing projectID and proposalID
                const newProjectID = projectID || uuidv4();
                const newProposalID = proposalID || uuidv4();

                // Create params object for DynamoDB operation

                let params;

                if (UserType === 'Employer') {
                    // Create a new project object for Employer
                    const newProject = {
                        projectID: newProjectID,
                        requesterUIN,
                        requesterName,
                        requesterTitle,
                        requesterDepartment,
                        requesterEmail,
                        requestTitle,
                        proposalDeadline,
                        startDate,
                        endDate,
                        keywords,
                        projectSummary,
                        desiredOutcomes,
                        collaborators,
                        specificLocation,
                        locationDetails,
                        projectRestrictions,
                        availableResources,
                        studentFunding,
                        fundingDetails,
                        alternateContact,
                        specialInstructions,
                        proposalVideo: proposalvideofileUrl,
                        supplementalUpload: supplementalfileUrl,
                        projectStatus: Status
                    };

                    // Set DynamoDB params for Employer
                    params = {
                        TableName: 'Projects',
                        Item: newProject
                    };
                } else if (UserType === 'Student') {
                    // Create a new proposal object for Student
                    const newProposal = {
                        proposalID:newProposalID,
                        projectID:newProjectID,
                        requestTitle,
                        applicantName,
                        applicantEmail,
                        applicantUIN,
                        proposalTitle,
                        status,
                        degreeProgram,
                        experience,
                        ableToMeetRequirements,
                        unmetRequirements,
                        proposalSummary,
                        anticipatedOutcomes,
                        resumeUpload:resumefileUrl,
                        supplementalUpload:supplementalfileUrl,
                        applicationStatus,
                        proposalStatus: Status
                    };

                    // Set DynamoDB params for Student
                    params = {
                        TableName: 'Proposals',
                        Item: newProposal
                    };
                } else {
                    // Handle unexpected usertype
                    return res.status(400).json({ error: 'Invalid user type.' });
                }

                // Save to DynamoDB
                await documentClient.put(params).promise();

                // Set notification message based on user type
                const notification = UserType === 'Student' ? 'Proposal submitted successfully' : 'Project created successfully.';
                res.status(200).json({ message: notification });
            } catch (error) {
                console.error('Error during upload update:', error);
                res.status(500).json({ error: 'Internal server error.' });
            }

    }

    else if (req.path === '/withdraw') {
                console.log("I am here");
                const { projectID, userType, UIN } = req.body;
                let queryParams = {};
                let proposalID = null;

                try {
                    if (userType === 'Student') {
                        // Query to get the proposalID using the GSI
                        queryParams = {
                            TableName: 'Proposals',
                            IndexName: 'ProjectApplicantIndex', // GSI name
                            KeyConditionExpression: 'projectID = :projectId and applicantUIN = :applicantUIN',
                            ExpressionAttributeValues: {
                                ':projectId': projectID,
                                ':applicantUIN': UIN
                            }
                        };

                    // Query for the project or proposal
                    const queryResult = await documentClient.query(queryParams).promise();

                    if (queryResult.Items.length === 0) {
                        return res.status(404).json({ success: false, message: 'Record not found' });
                    }

                    
                        // For Students, get the proposalID and update the proposal status
                        proposalID = queryResult.Items[0].proposalID; // Assuming proposalID is in the result
                        console.log("Proposal ID retrieved:", proposalID); // Add logging for debugging

                        const updateParams = {
                            TableName: 'Proposals',
                            Key: {
                                'proposalID': proposalID // Primary key to update the correct item
                            },
                            UpdateExpression: 'set #status = :status',
                            ExpressionAttributeNames: {
                                '#status': 'proposalStatus' // Field to update
                            },
                            ExpressionAttributeValues: {
                                ':status': Status // Status value to set
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };

                        const updateResult = await documentClient.update(updateParams).promise();
                        console.log('Update successful:', updateResult);
                        return res.status(200).json({ success: true, message: 'Proposal status updated successfully' });
                    } 
                    
                    
                    
                    else if (userType === 'Employer') {
                        // For Employers, update the project status
                        const updateParams = {
                            TableName: 'Projects',
                            Key: {
                                'projectID': projectID // Primary key to update the correct item
                            },
                            UpdateExpression: 'set #status = :status',
                            ExpressionAttributeNames: {
                                '#status': 'projectStatus' // Field to update
                            },
                            ExpressionAttributeValues: {
                                ':status': Status // Status value to set
                            },
                            ReturnValues: 'UPDATED_NEW'
                        };

                        const updateResult = await documentClient.update(updateParams).promise();
                        console.log('Update successful:', updateResult);
                        return res.status(200).json({ success: true, message: 'Project status updated successfully' });
                    }
                } catch (queryError) {
                    console.error('Error querying proposals or projects:', queryError);
                    return res.status(500).json({ success: false, message: 'Error querying proposals or projects' });
                }

        }
    }
