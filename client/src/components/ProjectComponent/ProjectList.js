import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ProjectListItem from './ProjectListItem';

const ITEMS_PER_PAGE = 3;

const ProjectList = ({ projects, onSelect, userType }) => {
  const [filters, setFilters] = useState({
    Saved: false,
    Published: false,
    Closed: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Function to toggle filter state
  const toggleFilter = (status) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // Mapping function for Employer statuses
  const getStatusMapping = (status) => {
    if (userType === 'Employer') {
      if (status === 'Submitted') return 'Published';
      if (status === 'Withdrawn') return 'Closed';
    }
    return status;
  };

  // Get the filtered projects based on the active filters
  const filteredProjects = projects.filter((project) => {
    const mappedStatus = getStatusMapping(project.projectStatus);
    if (!filters.Saved && !filters.Published && !filters.Closed) return true; // No filter active
    return filters[mappedStatus];
  });

  // Pagination logic for filtered projects
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box width="100%" height="100%" padding={2} overflow="auto">
      <Box display="flex" alignItems="center" marginBottom={2}>
        <Typography variant="h6" gutterBottom>
          Recorded Projects
        </Typography>

        <Box marginLeft={2} display="flex" gap={1}>
          {['Saved', 'Published', 'Closed'].map((status) => (
            <Button
              key={status}
              variant="contained"
              size="small"
              onClick={() => toggleFilter(status)}
              style={{
                backgroundColor:
                  status === 'Saved'
                    ? 'yellow'
                    : status === 'Published'
                    ? 'green'
                    : '#550000',
                color: 'black',
                opacity: filters[status] ? 1 : 0.6, // Dim the button if it's not active
              }}
            >
              {filters[status] ? '✖' : '＋'} {status}
            </Button>
          ))}
        </Box>
      </Box>

      {paginatedProjects.length > 0 ? (
        paginatedProjects.map((project) => (
          <Box
            key={project.projectID}
            borderBottom="1px solid #ccc"
            paddingY={2}
          >
            <ProjectListItem
              key={project.projectID}
              project={project}
              onSelect={onSelect}
              userType={userType}
            />
          </Box>
        ))
      ) : (
        <Typography variant="body1">No projects found for selected filters.</Typography>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={page === currentPage ? 'contained' : 'outlined'}
              color="primary"
              size="small"
              style={{ margin: '0 4px' }}
            >
              {page}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProjectList;