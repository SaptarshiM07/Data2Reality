// FlipCard.jsx

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Info, Add } from '@mui/icons-material';
import '../css/descriptionFlipcard.css';

const FlipCard = () => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Box className={`flip-card ${flipped ? 'flipped' : ''}`}>
      <Box className="flip-card-inner">
        {/* Front Side */}
        <Box className="flip-card-front">
          <Box className="card-content">
            <Info fontSize="large" color="primary" />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              About DATA2REALITY Project Matching Program
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="justify" mb={2}>
                The Texas A&M Institute of Data Science created the DATA2REALITY Project Matching Program to connect skilled students with Texas A&M staff and faculty needing specialized support in data science, artificial intelligence, and machine learning.
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="justify" gutterBottom>
                Faculty, staff, and researchers have data science challenges and projects that require additional support without a single mechanism to find students to work on those projects. The DATA2REALITY program fills that service gap through a special project request-proposal portal that facilitates the matching of skilled students with projects.
            </Typography>
          </Box>
          <IconButton className="flip-icon" onClick={handleFlip}>
            <Add />
          </IconButton>
        </Box>

        {/* Back Side */}
        <Box className="flip-card-back">
  <Box className="card-content">
    
    <Typography variant="h6" color="textPrimary" textAlign="center" gutterBottom>
      How it Works
    </Typography>
    <Typography variant="body2" color="textSecondary" textAlign="justify" paragraph>
      <strong>Step 1:</strong> Faculty and staff act as "Employers” and create project requests, which are published on the DATA2REALITY website.
    </Typography>
    <Typography variant="body2" color="textSecondary" textAlign="justify" paragraph>
      <strong>Step 2:</strong> Students can review all the project requests and submit proposals for how they would accomplish that project.
    </Typography>
    <Typography variant="body2" color="textSecondary" textAlign="justify" paragraph>
      <strong>Step 3:</strong> The employer reviews submitted proposals and accepts one or more proposals to work on the project.
    </Typography>
    <Typography variant="body2" color="textSecondary" textAlign="justify" paragraph>
      <strong>Step 4:</strong> The employer connects with the selected student to collaborate on the project.
    </Typography>
  </Box>
  <IconButton className="flip-icon" onClick={handleFlip}>
    <Add />
  </IconButton>
</Box>
      </Box>
    </Box>
  );
};

export default FlipCard;