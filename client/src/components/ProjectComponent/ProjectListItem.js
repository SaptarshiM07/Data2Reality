import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Modal } from '@mui/material';
import ReactPlayer from 'react-player';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const ProjectListItem = ({ project, onSelect, userType}) => {
  const [open, setOpen] = useState(false); // State to control modal visibility

  const handleOpen = () => setOpen(true); // Open modal function
  const handleClose = () => setOpen(false); // Close modal function


  // Determine the status tag based on projectStatus
  const getStatusTag = (status) => {
    switch (status) {
      case 'Saved':
        return { color: 'yellow', text: 'Saved', textColor: '#550000' };
      case 'Submitted':
        return { color: 'green', text: 'Published', textColor: 'white' };
      case 'Withdrawn':
        return { color: '#550000', text: 'Closed', textColor: 'white' };
      default:
        return null;
    }
  };

  const statusTag = getStatusTag(project.projectStatus);

  return (
    <Box
      display="flex"
      alignItems="center"
      padding={1}
      marginBottom={2}
      onClick={() => onSelect(project.projectID)}
      style={{ cursor: 'pointer', position: 'relative' }} // Set position relative for absolute positioning
    >

      <Box flex="1" marginLeft={2}>
        <Typography fontWeight="bold" variant="subtitle1">
          {project.requestTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Proposal Deadline: {project.proposalDeadline}
        </Typography>
      </Box>

      {/* Status Tag */}
      {userType === 'Employer' && statusTag && (
          <Box
            bgcolor={statusTag.color}
            padding="4px 8px"
            borderRadius="4px"
            color={statusTag.textColor}
            fontWeight="bold"
            style={{
              whiteSpace: 'nowrap',
              boxShadow: statusTag.text === 'Saved' ? '0px 0px 4px rgba(0, 0, 0, 0.2)' : 'none', // Shadow for better readability
            }}
          >
            {statusTag.text}
          </Box>

      )}

      
       

      {/* Video play button */}
      {/* {project.proposalVideoUrl && project.proposalVideoUrl !== '' && project.proposalVideoUrl !== 'No Proposal Video Available' && (
        <IconButton
        style={{
          position: 'absolute',
          top: '50%', // Center vertically
          right: '10px',
          transform: 'translateY(-50%)', // Adjust for the button height
          backgroundColor: 'white', // Optional: background for visibility
          borderRadius: '50%',
        }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          handleOpen(); // Open the modal
        }}
      >
          <PlayArrowIcon />
        </IconButton>
      )} */}

      {/* Modal for video playback
      <Modal open={open} onClose={handleClose}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor="rgba(0, 0, 0, 0.8)" // Dark background
          padding={2}
        >
          <Box width="80%" maxWidth="800px">
            <ReactPlayer
              url={project.proposalVideoUrl}
              width="100%"
              height="auto"
              controls // Show video controls
            />
          </Box>
        </Box>
      </Modal> */}
    </Box>
  );
};

export default ProjectListItem;