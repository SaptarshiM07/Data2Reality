import { documentClient } from '../awsConfig.js';

const PROJECTS_TABLE = 'Projects'; // Replace with your actual table name

export const displayProjects = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
  const { UIN, UserType, FirstName, LastName, Email } = req.user;


  // debug the output
  console.log(UserType);
  console.log(UIN);
  console.log(FirstName)
  console.log(LastName)

  // Base params for querying projects
  let params = {
    TableName: PROJECTS_TABLE,
    Limit: parseInt(limit),
    ExclusiveStartKey: req.query.exclusiveStartKey ? JSON.parse(req.query.exclusiveStartKey) : null,
  };

  // If UserType is not 'Student', apply the filter on requesterUIN for Employers
  if (UserType === 'Employer') {
    params.IndexName = 'requesterUINIndex';
    params.KeyConditionExpression = 'requesterUIN = :uin';
    params.ExpressionAttributeValues = {
      ':uin': UIN,
    };
  }

  // Base params for counting total projects
  let countParams = {
    TableName: PROJECTS_TABLE,
    Select: 'COUNT',
  };

  // Apply filtering for countParams if UserType is Employer
  if (UserType === 'Employer') {
    countParams.IndexName = 'requesterUINIndex';
    countParams.KeyConditionExpression = 'requesterUIN = :uin';
    countParams.ExpressionAttributeValues = {
      ':uin': UIN,
    };
  }

  console.log(params);

  try {
    let totalProjects;

    // Fetch total count of projects based on user type
    if (UserType === 'Student') {
      const countData = await documentClient.scan(countParams).promise();
      totalProjects = countData.Count;
    } else if (UserType === 'Employer') {
      const countData = await documentClient.query(countParams).promise();
      totalProjects = countData.Count;
    }

    console.log(totalProjects);

    // Fetch the projects for the current page
    const fetchProjects = async (exclusiveStartKey) => {
      if (exclusiveStartKey) {
        params.ExclusiveStartKey = exclusiveStartKey;
      }
      try {
        let data;

        // For Students, use scan, for Employers, use query
        if (UserType === 'Student') {
          data = await documentClient.scan(params).promise();
        } else if (UserType === 'Employer') {
          data = await documentClient.query(params).promise();
        }

        console.log(data);
        return data;
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw new Error('Failed to fetch projects');
      }
    };

    // Initially fetch projects for the current page
    let projectsData = await fetchProjects(null);
    let projects = projectsData.Items;

    // If paginating (i.e., if page is greater than 1), keep fetching until the desired page is reached
    for (let i = 1; i < page; i++) {
      if (projectsData.LastEvaluatedKey) {
        projectsData = await fetchProjects(projectsData.LastEvaluatedKey);
        projects = projectsData.Items;
      } else {
        break; // Stop if there are no more projects to fetch
      }
    }

    // Send the response with the fetched projects
    res.json({
      projects,
      totalProjects, // Include total number of projects in the response
      currentPage: parseInt(page),
      hasMore: !!projectsData.LastEvaluatedKey,
      UserType, // Check if there are more pages available
      UserInfo: {UIN, FirstName, LastName, Email, UserType}
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};