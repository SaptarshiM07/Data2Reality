import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ProjectListItem from './ProjectListItem';

const ITEMS_PER_PAGE = 5; // Projects per page

const ProjectList = ({ projects, onSelect, userType }) => {
  const [filters, setFilters] = useState({
    Saved: false,
    Submitted: false,
    Withdrawn: false,
    Cancelled: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const getColor = (label) => {
    switch (label) {
      case 'Saved':
        return '#DAA520'; // Background color for "Saved"
      case 'Published':
        return 'green'; // Background color for "Published"
      case 'Cancelled':
        return '#B22222'; // Background color for "Cancelled"
      case 'Closed':
        return '#550000'; // Background color for "Closed"
      default:
        return 'gray'; // Default color
    }
  };

  // Mapping from button labels to project statuses
  const statusMapping = {
    Saved: 'Saved',
    Published: 'Submitted',
    Cancelled: 'Withdrawn',
    Closed: 'Closed',
  };

  // Toggle filter state
  const toggleFilter = (label) => {
    const status = statusMapping[label];
    setFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Filter projects based on active filters
  const filteredProjects = projects.filter((project) => {
    if (!filters.Saved && !filters.Submitted && !filters.Withdrawn && !filters.Closed) return true; // No filters applied
    return filters[project.projectStatus];
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page changes
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Box width="100%" padding={2}>
      <Typography variant="h6" gutterBottom>
        Projects
      </Typography>

      {/* Filter Buttons */}
      {userType === "Employer" && (
      <Box display="flex" gap={1} marginBottom={2}>
        {['Saved', 'Published', 'Cancelled', 'Closed'].map((label) => (
          <Button
            key={label}
            variant="contained"
            size="small"
            onClick={() => toggleFilter(label)}
            style={{
              backgroundColor: filters[statusMapping[label]]
                ? getColor(label) // Dynamically set active color
                : 'gray', // Default inactive color
              color: 'white', // Always white text
              fontWeight: 'bold', // Make text bold
            }}
          >
            {filters[statusMapping[label]] ? '✖' : '＋'} {label.toUpperCase()}
          </Button>
        ))}
      </Box>
      )}

      {/* Render Project Items */}
      {paginatedProjects.map((project) => (
        <Box key={project.projectID} borderBottom="1px solid #ccc" paddingY={2}>
          <ProjectListItem project={project} onSelect={onSelect} userType={userType} />
        </Box>
      ))}

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{ marginRight: '8px' }}
        >
          Previous
        </Button>
        <Typography variant="body1">
              {totalPages === 0 ? (
          'No projects to display'
        ) : (
          `Page ${currentPage} of ${totalPages}`
        )}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0 }
          style={{ marginLeft: '8px' }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectList;