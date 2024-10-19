/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Radio,
  FormControlLabel,
  Typography,
  Container,
  RadioGroup,
  Grid,
  Box,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { CountdownDialog } from './CountDownDialog';
import logo from '../img/logodtr.png';


export const RegistrationForm = () => {
  const [userType, setUserType] = useState('Student');
  const [formData, setFormData] = useState({
    UIN: '',
    FirstName: '',
    MiddleInitials: '',
    LastName: '',
    Email: '',
    Password: '', 
    Confirm_Password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setFormData({
      UIN: '',
      FirstName: '',
      MiddleInitials: '',
      LastName: '',
      Email: '',
      Password: '',
      Confirm_Password: ''
    });
    setTouchedFields({});
  };

  // Validation functions
  const validateUIN = (value) => /^\d{9}$/.test(value);
  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    return passwordRegex.test(value);
  };
  const validateName = (value) => /^[A-Z][a-z]+$/.test(value); // for both First and Last name
  const validateInitials = (value) => /^[A-Z]+$/.test(value);
  const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@tamu\.edu$/.test(value);

  const validateField = (fieldName, value) => {
    let errorMessage = '';
    switch (fieldName) {
      case 'UIN':
        if (!validateUIN(value)) errorMessage = 'UIN must be a 9-digit number';
        break;
      case 'Password':
        if (!validatePassword(value)) errorMessage = 'Password must be 8-20 characters long, with at least one uppercase letter, one lowercase letter, one numeral, and one special character';
        break;
      case 'Confirm_Password':
        if (value !== formData.Password) errorMessage = "Passwords don't match";
        break;
      case 'FirstName':
        if (!validateName(value)) errorMessage = 'First name must start with an uppercase letter (Ex: John)';
        break;
      case 'LastName':
        if (!validateName(value)) errorMessage = 'Last name must start with an uppercase letter (Ex: Doe)';
        break;
      case 'MiddleInitials':
        if (value && !validateInitials(value)) errorMessage = 'Middle initials must be in uppercase (Ex: A)';
        break;
      case 'Email':
        if (!validateEmail(value)) errorMessage = 'Email must be a valid tamu.edu address (Ex: hello@tamu.edu';
        break;
      default:
        break;
    }

    console.log('Field:', fieldName, 'Value:', value, 'Error:', errorMessage);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: errorMessage,
    }));

    return errorMessage === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (touchedFields[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Show loading screen
    try {
      const endpointpath = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${endpointpath}/api/sendVerificationEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          UserType: userType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Assume success message is returned
        setIsLoading(false); // Hide loading screen
        alert("Verification email sent. Please check your email to verify.");
      } else {
        const errorData = await response.json();
        console.error('Failed to send verification email: ', errorData);
        alert('Failed to send verification email: ' + errorData.error);
      }
    } catch (error) {
      console.error('There was an error sending the verification email!', error);
      alert('There was an error!');
    }
    setIsLoading(false); // Hide loading screen
  };

  const checkFormValidity = () => {
    const fields = Object.keys(formData);
    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      if (!validateField(fieldName, formData[fieldName])) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    console.log('formData:', formData);
    setIsFormValid(checkFormValidity());
  }, [formData]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Top Banner with Logo */}
{/* Top Banner with Logo */}
<Box
  sx={{
    width: '100%',
    backgroundColor: 'white',
    boxShadow: 1,
    display: 'flex',
    alignItems: 'center', // Vertically centers the content
    height: '60px', // Fixed height for the banner
  }}
>
  <img
    src={logo}
    alt="TAMU Logo"
    style={{
      width: '300px', // Desired width
      maxHeight: '50px', // Restrict the max height to avoid overflowing
      objectFit:'contain',
      marginLeft: '0.2%', // Keeps a 2% gap from the left edge
      marginTop:'1%'
    }}
  />
</Box>

      {/* Login Form Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingY: 4,
        }}
      >
        {/* Loading overlay */}
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

    <Container
    maxWidth="xs" // Increase the maxWidth from 'xs' to 'md' for a wider container
    sx={{
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      padding: '16px',
      marginTop: '32px',
    }}
    >
        <Typography variant="h4" gutterBottom>
          Registration Form
        </Typography>

        <form onSubmit={handleSubmit}>
      
            <Typography variant="h6" gutterBottom>
              User Status: 
            </Typography>
  
            <RadioGroup
              aria-label="userType"
              name="userType"
              value={userType}
              onChange={handleUserTypeChange}
              row
            >
            <FormControlLabel value="Student" control={<Radio />} label="Student" />
            <FormControlLabel value="Employer" control={<Radio />} label="Employer" />
            </RadioGroup>

            <Typography variant="h6" gutterBottom>
            User Information:
            </Typography>


            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="UIN"
              label="UIN"
              name="UIN"
              value={formData.UIN}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.UIN}
              helperText={touchedFields.UIN ? formErrors.UIN : ''}
              sx={{ marginBottom: '16px' }}
            />

            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="LastName"
                label="Last Name"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!formErrors.LastName}
                helperText={touchedFields.LastName ? formErrors.LastName : ''}
              /> 
        
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="FirstName"
              label="First Name"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.FirstName}
              helperText={touchedFields.FirstName ? formErrors.FirstName : ''}
            />
          
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="MiddleInitials"
              label="Middle Initials (Optional)"
              name="MiddleInitials"
              value={formData.MiddleInitials}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.MiddleInitials}
              helperText={touchedFields.MiddleInitials ? formErrors.MiddleInitials : ''}
            />
    

            <Typography variant="h6" gutterBottom>
              Login Credentials:
            </Typography>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Email"
              label="Email Address"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.Email}
              helperText={touchedFields.Email ? formErrors.Email : ''}
              sx={{ marginBottom: '16px' }}
              />

            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Password"
            label="Password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.Password}
            helperText={touchedFields.Password ? formErrors.Password : ''}
            sx={{ marginBottom: '16px' }}
            />

            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Confirm Password"
            label="Confirm Password"
            name="Confirm_Password"
            value={formData.Confirm_Password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.Confirm_Password}
            helperText={touchedFields.Confirm_Password ? formErrors.Confirm_Password : ''}
            sx={{ marginBottom: '16px' }}
            />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => setFormData({
                    UIN: '',
                    FirstName: '',
                    MiddleInitials: '',
                    LastName: '',
                    Email: '',
                    Password: '',
                    Confirm_Password: ''
                  })}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isFormValid}
                >
                  Register
                </Button>
          </Box>
        </form>
  {/* CountdownDialog component */}
  <CountdownDialog open={openDialog} setOpen={setOpenDialog} />
</Container>
</Box>
</Box>

);
};
