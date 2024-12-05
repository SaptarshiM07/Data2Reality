import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar } from '@mui/material';
import { Save, PieChart, Assessment, CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectRequestForm } from './ProjectRequestForm';
import Header from '../jsx/header';
import  FlipCard from '../jsx/descriptionFlipcard';

const endpointpath = process.env.REACT_APP_API_BASE_URL;

export const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    savedProjects: 0,
    publishedProjects: 0,
    proposalsReceived: 0,
    closedProjects: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${endpointpath}/api/user/data`, {
          headers: { authorization: token },
        });

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

    const fetchStats = async () => {
      try {
        const response = await fetch(`${endpointpath}/api/stats`, {
          method: 'GET',
          headers: { authorization: token },
        });
        if (response.ok) {
          const statsData = await response.json();
          setStats(statsData);
          console.log(statsData)
        } else {
          console.error('Failed to fetch project stats');
        }
      } catch (error) {
        console.error('Error fetching project stats:', error);
      }
    };

    fetchUserData();
    fetchStats();
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNewProjectClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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

    <Container style={{ marginTop: '80px' }}>
      {/* Welcome Box */}
      <Box sx={{ mb: 4, textAlign: 'center', backgroundColor: '#f5f5f5', py: 3, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Welcome, {userData ? userData.FirstName : 'User'}!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Here are some stats:
        </Typography>
      </Box>

      {/* Three-Column Layout */}
      <Grid container spacing={4}>
          {/* First Column - FlipCard */}
          <Grid item xs={12} md={4}>
            <FlipCard />
          </Grid>

          {/* Second Column - Saved Projects & Projects Published */}
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Card sx={{ textAlign: 'center', p: 1, backgroundColor: '#f0f4c3', minHeight: '120px' }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#9e9d24', m: '0 auto', mb: 1 }}>
                      <Save />
                    </Avatar>
                    <Typography variant="h6">{stats.savedProjects}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Saved Projects
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item>
                <Card sx={{ textAlign: 'center', p: 1, backgroundColor: '#e3f2fd', minHeight: '120px' }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#1976d2', m: '0 auto', mb: 1 }}>
                      <PieChart />
                    </Avatar>
                    <Typography variant="h6">{stats.publishedProjects}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Projects Published
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>


              <Grid item>
                <Card sx={{ textAlign: 'center', p: 1, backgroundColor: '#f3e5f5', minHeight: '120px' }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#8e24aa', m: '0 auto', mb: 1 }}>
                      <CheckCircle />
                    </Avatar>
                    <Typography variant="h6">{stats.closedProjects}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Projects Closed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Third Column - Proposals Received & Projects Closed */}
          <Grid item xs={12} md={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Card sx={{ textAlign: 'center', p: 1, backgroundColor: '#e8f5e9', minHeight: '120px' }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#388e3c', m: '0 auto', mb: 1 }}>
                      <Assessment />
                    </Avatar>
                    <Typography variant="h6">{stats.proposalsReceived}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Proposals Received
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <ProjectRequestForm open={dialogOpen} handleClose={handleDialogClose} userData={userData} />
    </>
  );
};