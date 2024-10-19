import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ projectsPerPage, totalProjects, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProjects / projectsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <MuiPagination
      count={pageNumbers.length}
      page={currentPage}
      onChange={(event, value) => paginate(value)}
      color="primary"
      shape="rounded"
      size="large"
    />
  );
};

export default Pagination;