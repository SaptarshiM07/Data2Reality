import { documentClient } from '../awsConfig.js';


export const getUserStats = async (req,res) => {

    // const { userType } = res.user
    console.log("I am here\n", req.user);
    const { UIN, UserType } = req.user;
    console.log(UIN);
    console.log(UserType);
    
    try {
        // Define parameters to scan the Projects table
        
        const params = {
          TableName: 'Projects',
          FilterExpression: 'requesterUIN = :uin', // Filter by UIN
          ExpressionAttributeValues: {
            ':uin': UIN,
          },
        };
    
        const data = await documentClient.scan(params).promise();
        const projects = data.Items;
        console.log(projects);
    
        // Calculate stats
        const stats = {
          savedProjects: projects.filter(p => p.projectStatus === 'Saved').length,
          publishedProjects: projects.filter(p => p.projectStatus === 'Submitted').length,
          //proposalsReceived: projects.reduce((total, project) => total + (project.proposalsReceived || 0), 0),
          proposalsReceived: 0,
          closedProjects: projects.filter(p => p.projectStatus === 'Withdrawn').length,
        };
    
        res.status(200).json(stats);
      } catch (error) {
        console.error('Error fetching project stats:', error);
        res.status(500).json({ message: 'Error fetching project stats' });
      }

};