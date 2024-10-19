import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, IconButton, Grid } from '@mui/material';
import { Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProjectRequestForm } from './ProjectRequestForm';
import Header from '../jsx/header';


export const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const navigate = useNavigate();




  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log(token)

      if (!token) {
        return;
      }

      try {
        const endpointpath = process.env.REACT_APP_API_BASE_URL
        const response = await fetch(`${endpointpath}/api/user/data`, {
          headers: {
            'authorization': token
          }
        });
        console.log(response)

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleNewProjectClick = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  return (
   <>

   <Header
        userData={userData}
        handleLogout={handleLogout}
        handleNewProjectClick={handleNewProjectClick}
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
  

    <Grid container>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mx={2}>
          <Typography component="h1" variant="h5">
            Dashboard
          </Typography>
          
        </Box>
        <Box mx={2}>
          {userData ? (
            <div>
              <Typography variant="h6">Welcome, {userData.Firstname}</Typography>
              <Typography variant="body1">Email: {userData.Email}</Typography>
              <Typography variant="body1">User Type: {userData.UserType}</Typography>
            </div>
          ) : (
            <Typography variant="body1">Loading user data...</Typography>
          )}
          
        </Box>
      </Grid>
    </Grid>
    {/* Render the ProjectRequestForm dialog */}
    <ProjectRequestForm open={dialogOpen} handleClose={handleDialogClose} userData={userData}/>
    </>
  );
};

