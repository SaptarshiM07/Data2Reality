export const UsersTableSchema = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'UIN', KeyType: 'HASH' }  // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'UIN', AttributeType: 'S' },  // UIN as string (S)
    { AttributeName: 'Email', AttributeType: 'S' },  // Email as string (S)
    
  ],
  GlobalSecondaryIndexes: [  // Example of a global secondary index
    {
      IndexName: 'EmailIndex',
      KeySchema: [
        { AttributeName: 'Email', KeyType: 'HASH' }  // Partition key
      ],
      Projection: {
        ProjectionType: 'ALL'  // Projection type can be adjusted based on your needs
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
   
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};


//add the project table

export const ProjectsTableSchema = {
  TableName: 'Projects',
  KeySchema: [
    { AttributeName: 'projectID', KeyType: 'HASH' }  // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'projectID', AttributeType: 'S' },
    { AttributeName: 'requesterUIN', AttributeType: 'S' }  // Add UIN attribute definition
  ],
  GlobalSecondaryIndexes: [  // Define a global secondary index on UIN
    {
      IndexName: 'requesterUINIndex',
      KeySchema: [
        { AttributeName: 'requesterUIN', KeyType: 'HASH' }  // Partition key
      ],
      Projection: {
        ProjectionType: 'ALL'  // Specify what attributes to project
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};




// add student table

export const ProposalsTableSchema = {
  TableName: 'Proposals',
  KeySchema: [
    { AttributeName: 'proposalID', KeyType: 'HASH' }  // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'proposalID', AttributeType: 'S' },
    { AttributeName: 'applicantUIN', AttributeType: 'S' },
    { AttributeName: 'projectID', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [  // Define global secondary indexes
    {
      IndexName: 'applicantUINIndex',
      KeySchema: [
        { AttributeName: 'applicantUIN', KeyType: 'HASH' }  // Partition key
      ],
      Projection: {
        ProjectionType: 'ALL'  // Specify what attributes to project
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'projectIDIndex',
      KeySchema: [
        { AttributeName: 'projectID', KeyType: 'HASH' }  // Partition key
      ],
      Projection: {
        ProjectionType: 'ALL'  // Specify what attributes to project
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};
