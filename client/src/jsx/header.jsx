// Header.js
import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';


import { SideDrawer } from '../components/SideDrawer'; // Assuming you have this component
import MenuIcon from '@mui/icons-material/Menu'; // If you're using Material UI's MenuIcon
import burger from '../img/burger icon.png';
import logoutImage from '../img/logout button.png';
import submitnewproject from '../img/project button.png';
import logo from '../img/logodtr.png';


const goHome = () => {
    window.location.href = '/dashboard'; 
}



const Header = ({ userData, handleLogout, handleNewProjectClick, drawerOpen, toggleDrawer }) => {
  return (
    <div style={{
      display: 'flex', 
      alignItems: 'left', 
      justifyContent: 'space-between', 
      padding: '10px 30px', 
      backgroundColor: 'white', 
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: '0',
      width: '100%',
      zIndex: 1000
    }}>
      
      <div>
      {/* Burger Icon Button outside SideDrawer */}
      <Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}  // Open the drawer when clicking the icon
          sx={{ padding: '0', backgroundColor: 'transparent' }}
        >
          <img src={burger} alt="Menu" style={{ width: '36px', height: '36px' }} />
        </IconButton>
      </Box>

      {/* SideDrawer component to control drawer */}
      <SideDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}  // Pass the toggle function to SideDrawer
        userData={userData}
      />
    </div>

         <Box
        sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'left', 
            alignItems: 'left', // Vertically center the logo
            height: '50px',  // Fixed height for the banner
            overflow: 'hidden'  // Ensure no overflow if the image exceeds the height
        }} 
        >
        <img 
            src={logo} 
            onClick={goHome}
            alt="Data2Reality Logo" 
            style={{
            maxHeight: '100%',  // Ensure the image doesn't exceed the container's height
            objectFit: 'contain',
            cursor: 'pointer'  // Adds a pointer cursor on hover for better UX
            }} 
        />
        </Box>

      {/* Right Side - Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Submit New Project Button */}
        {userData && userData.UserType === 'Employer' && (
          <Button 
            onClick={handleNewProjectClick}
            style={{
              backgroundImage: `url(${submitnewproject})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100px',  // Adjust to fit your image dimensions
              height: '36px',  // Adjust to fit your image dimensions
              border: 'none',
              marginRight: '10px',  // Adjust spacing between buttons
              cursor: 'pointer',  // Pointer for better UX
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',  // Shadow effect
              borderRadius: '5px',  // Optional: smooth out edges
            }}
          >
            {/* Optional: If you want text over the image, add it here */}
          </Button>
        )}

        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          style={{
            backgroundImage: `url(${logoutImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100px',  // Adjust to fit your image dimensions
            height: '36px',  // Adjust to fit your image dimensions
            border: 'none',
            cursor: 'pointer',  // Pointer for better UX
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',  // Shadow effect
            borderRadius: '5px',  // Optional: smooth out edges
            cursor: 'pointer',
          }}
        >
          {/* Optional: If you want text over the image, add it here */}
        </Button>
      </Box>

    </div>
  );
};

export default Header;