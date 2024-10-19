import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { ProfileForm } from './ProfileEdit'; // Assuming you have a ProfileForm component
import '../../css/ProfilePage.css';


const endpointpath = process.env.REACT_APP_API_BASE_URL;

export const ProfileCard = ({ onUpdate }) => {

  const [userData, setUserData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [secondaryRole, setSecondaryRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${endpointpath}/api/user/data`, {
          headers: {
            'authorization': token
          }
        });
        console.log(response)

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setSecondaryRole(data.Secondary_Role || null);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

 


  const handleAddRole = async () => {
    if (!userData) return; // Ensure userData is not null
    const newRole = userData.UserType === 'Student' ? 'Employer' : 'Student';
    try {
      const response = await fetch(`${endpointpath}/api/user/addrole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ ...userData, Secondary_Role: newRole }),
      });

      if (response.ok) {
        setSecondaryRole(newRole);
        if (onUpdate) {
          onUpdate(); // Call onUpdate to refresh user data
        }
      } else {
        console.error('Failed to add role');
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  if (!userData) {
    return null; // Handle case where userData is still loading
  }

  return (
    <div className="container">
      <div className="left-pane">
        <Card style={{ width: '80%' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                bgcolor="primary.main"
                color="primary.contrastText"
                p={1}
                borderRadius="4px"
                display="flex"
                alignItems="center"
                mr={1}
              >
                <Typography variant="body2">{userData?.UserType}</Typography>
              </Box>
              {secondaryRole && (
                <Box
                  bgcolor="secondary.main"
                  color="secondary.contrastText"
                  p={1}
                  borderRadius="4px"
                  display="flex"
                  alignItems="center"
                  mr={1}
                >
                  <Typography variant="body2">{secondaryRole}</Typography>
                </Box>
              )}
              {/*}
              {!secondaryRole && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddRole}
                >
                  Add Role
                </Button>
              )}
              */}
            </Box>
            <Typography variant="h6">
              {userData?.FirstName} {userData?.LastName}
            </Typography>
            <Typography variant="body2">{userData?.Email}</Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Edit Primary Role
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>

      {isEditOpen && (
        <div className="right-pane">
          <ProfileForm onClose={handleEditClose} />
        </div>
      )}
    </div>
  );
};
