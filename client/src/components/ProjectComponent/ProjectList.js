import React from 'react';
import { Box, Typography } from '@mui/material';
import ProjectListItem  from './ProjectListItem';

const ProjectList = ({ projects, onSelect }) => (
  <Box width="100%" height="100%" padding={2} overflow="auto">
    <Typography variant="h6" gutterBottom>Recorded Projects</Typography>
    {projects.map((project) => (
       <Box
       key={project.projectID}
       borderBottom="1px solid #ccc" // Add a border between items
       paddingY={2} // Add some vertical padding for spacing
     >
      <ProjectListItem key={project.projectID} project={project} onSelect={onSelect} />
      </Box>
    ))}
  </Box>
  
);


export default ProjectList;
