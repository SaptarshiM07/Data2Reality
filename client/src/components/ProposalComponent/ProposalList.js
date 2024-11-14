import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ProposalCard from './ProposalCard';

export const ProposalList = ({ proposals, fetchProposals }) => {
  const itemsPerPage = 5;  // Define how many items to show per page
  const [currentPage, setCurrentPage] = useState(1);  // State for the current page
  const [expandedProposalId, setExpandedProposalId] = useState(null);

  // Calculate the total number of pages
  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleExpand = (proposalId) => {
    // Toggle the expansion state, collapsing if already expanded
    setExpandedProposalId((prevId) => (prevId === proposalId ? null : proposalId));
  };

  // Get the proposals for the current page
  const currentProposals = proposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("I am here in Proposal List");

  return (
    <Box width="100%" height="100%" padding={2} overflow="auto">
      <Typography variant="h6" gutterBottom>Proposals</Typography>
      
      {currentProposals.length > 0 ? (
        currentProposals.map((proposal) => (
          <Box
            key={proposal.proposalID}
            borderBottom="1px solid #ccc" // Add a border between items
            paddingY={2} // Add some vertical padding for spacing
          >
            <ProposalCard
          proposal={proposal}
          proposals={proposals}
          fetchProposals={fetchProposals}
          isExpanded={expandedProposalId === proposal.proposalID} // Pass expanded state
          onToggleExpand={() => handleToggleExpand(proposal.proposalID)} // Pass toggle function
        />
      </Box>
    ))
      ) : (
        <Typography variant="body2">No proposals found.</Typography>
      )}

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <Button
          variant="outlined"
          disabled={currentPage === 1}  // Disable previous button on the first page
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Typography variant="body2">Page {currentPage} of {totalPages}</Typography>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}  // Disable next button on the last page
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
