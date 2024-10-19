import React, { useState, useEffect } from 'react';
import { Box, Grid, Button  } from '@mui/material';
import  ProjectDetails from './ProjectDetails'; // display details of the selected project
import ProjectList  from './ProjectList'; // display th list of projects
import Pagination  from './Pagination'; // import from Pagination.js to display the page grid
import ProposalList from '../ProposalComponent/ProposalList';
import '../../css/MainProjectComponent.css';
import { ProjectRequestForm } from '../ProjectRequestForm';
import Header from '../../jsx/header';

const endpointpath = process.env.REACT_APP_API_BASE_URL;

export const MainProjectComponent = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectID, setSelectedProjectID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const projectsPerPage = 6; // defining first 10 projects.
  const [UserType, setUserType] = useState(null);
  const [UserData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog

  
  

  useEffect(() => {
    const fetchProjects = async (page) => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${endpointpath}/api/projects?page=${page}&limit=${projectsPerPage}`, {
          headers: {
            'authorization': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
          setTotalProjects(data.totalProjects); // Assuming backend returns totalProjects
          setUserType(data.UserType);
          setUserData(data.UserInfo); // UserData from authorization to be passed to Project Details
          if (data.projects.length > 0) {
            setSelectedProjectID(data.projects[0].projectID);
          }
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects(currentPage);
  }, [currentPage]);




  //below are some functions for top portions of web opeartions
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNewProjectClick = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };


  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const selectedProject = projects.find(project => project.projectID === selectedProjectID);

  console.log("This is the selected projectid to be sent to proposal List:",selectedProject);

  return (

    
    <>
     <Header
        userData={UserData}
        handleLogout={handleLogout}
        handleNewProjectClick={handleNewProjectClick}
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />

    <div className="container">

    
  <div className="left-pane">
    <Box className="content-container">
      {/* Render Project Details if a project is selected */}
      {selectedProject ? (
        <ProjectDetails project={selectedProject} userType={UserType} userInfo={UserData} />
      ) : (
        <div>No Project Selected</div>
      )}

    </Box>
  </div>

      <div className="right-pane">
      <Box display="flex" flexDirection="column" height="100%" width="100%" boxSizing="border-box">
    <ProjectList projects={projects} onSelect={setSelectedProjectID} />
    <Box mt={2} width="100%" display="flex" justifyContent="center"> {/* Optional: adds margin-top */}
      <Pagination
        projectsPerPage={projectsPerPage}
        totalProjects={totalProjects}
        paginate={paginate}
        currentPage={currentPage}
      />
    </Box>
  </Box>
</div>
    </div>
     {/* Render the ProjectRequestForm dialog */}
     <ProjectRequestForm open={dialogOpen} handleClose={handleDialogClose} userData={UserData}/>
    </>
  );
};