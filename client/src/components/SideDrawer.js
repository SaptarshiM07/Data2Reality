import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Avatar, Box, Typography } from '@mui/material';


export const SideDrawer = ({ drawerOpen, toggleDrawer, userData }) => {


  return (
    <div>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >

          <Box sx={{ textAlign: 'center', p: 2 }}>
          <Avatar sx={{ width: 64, height: 64, margin: '0 auto' }}>
            {userData && userData.FirstName && userData.LastName 
              ? `${userData.FirstName[0]}${userData.LastName[0]}` 
              : 'G'}
          </Avatar>
            <Typography variant="h6">{userData ? `${userData.FirstName}  ${userData.LastName}` : 'Guest'}</Typography>
            <Typography variant="body2">{userData ? userData.UserType : ''}</Typography>
          </Box>
          <List>
            <ListItem button onClick={() => window.location.href = '/dashboard'}>
              <ListItemText primary="Home" />
            </ListItem>
            {/* <ListItem button onClick={() => window.location.href = '/profile'}>
              <ListItemText primary="Profile" />
            </ListItem> */}
            <ListItem button onClick={() => window.location.href = '/projects'}>
              <ListItemText primary="Projects" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
