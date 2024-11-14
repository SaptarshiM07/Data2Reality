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
            <Typography variant="body2" color="textSecondary" textAlign="justify">
              The Texas A&M Institute of Data Science created the DATA2REALITY Project Matching Program to connect skilled students with Texas A&M staff and faculty needing specialized support in data science, artificial intelligence, and machine learning.
            </Typography>
          </Box>
          <IconButton className="flip-icon" onClick={handleFlip}>
            <Add />
          </IconButton>
        </Box>

        {/* Back Side */}
        <Box className="flip-card-back">
          <Box className="card-content">
            <Typography variant="body2" color="textSecondary" textAlign="justify">
              Faculty, staff, and researchers have data science challenges and projects that require additional support without a single mechanism to find students to work on those projects. The DATA2REALITY program fills that service gap through a special project request-proposal portal that facilitates the matching of skilled students with projects.
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