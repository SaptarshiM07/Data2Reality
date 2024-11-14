import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Radio,
  FormControlLabel,
  Typography,
  Container,
  RadioGroup,
  Box,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../img/logodtr.png';
import { styled } from '@mui/material/styles';

const endpointpath = process.env.REACT_APP_API_BASE_URL;

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [capsLockOnConfirm, setCapsLockOnConfirm] = useState(false);
  const navigate = useNavigate();

  const handleUserTypeChange = (e) => setUserType(e.target.value);

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
        if (!validatePassword(value)) errorMessage = 'Password must be 8-20 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character (!, @, #, $, %, ^, &, *)';
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
        if (!validateEmail(value)) errorMessage = 'Email must be a valid tamu.edu address (Ex: hello@tamu.edu)';
        break;
      default:
        break;
    }

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
    setIsLoading(true);

    try {
      const response = await fetch(`${endpointpath}/api/sendEmailVerification`, {
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
        setOpenDialog(true);
        setTimeout(() => {
          setOpenDialog(false);
          navigate('/');
        }, 3000);
      } else {
        const errorData = await response.json();
        alert('Failed to send verification email: ' + errorData.error);
      }
    } catch (error) {
      alert('There was an error sending the verification email!');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFormValidity = () => {
    const fields = Object.keys(formData);
    return fields.every((field) => validateField(field, formData[field]));
  };

  useEffect(() => {
    setIsFormValid(checkFormValidity());
  }, [formData]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleCapsLockKey = (e, setCapsLock) => {
    if (e.getModifierState) {
      setCapsLock(e.getModifierState('CapsLock'));
    }
  };

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
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'white',
          boxShadow: 1,
          display: 'flex',
          alignItems: 'center',
          height: '60px',
        }}
      >
        <img
          src={logo}
          alt="TAMU Logo"
          style={{
            width: '300px',
            maxHeight: '50px',
            objectFit: 'contain',
            marginLeft: '0.2%',
            marginTop: '1%',
          }}
        />
      </Box>

      {/* Loading overlay */}
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Registration Form */}
      <Container
        maxWidth={false} // Disable the default maxWidth
        sx={{
          textAlign: 'center',
          border: '5px solid #550000',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#D1D1D1',
          padding: '16px',
          marginTop: '32px',
          marginBottom: '32px',
          maxWidth: '600px'
          
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#550000' }}>
          Registration Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={sectionHeaderStyle}>
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

          <Typography variant="h6" gutterBottom sx={sectionHeaderStyle}>
            User Information:
          </Typography>

          <StyledTextField
            label="UIN"
            name="UIN"
            value={formData.UIN}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.UIN}
            helperText={touchedFields.UIN ? formErrors.UIN : ''}
          />

          <StyledTextField
            label="First Name"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.FirstName}
            helperText={touchedFields.FirstName ? formErrors.FirstName : ''}
          />

          <StyledTextField
            label="Last Name"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.LastName}
            helperText={touchedFields.LastName ? formErrors.LastName : ''}
          />

          

          <StyledTextField
            label="Middle Initials (Optional)"
            name="MiddleInitials"
            value={formData.MiddleInitials}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.MiddleInitials}
            helperText={touchedFields.MiddleInitials ? formErrors.MiddleInitials : ''}
          />

          <Typography variant="h6" gutterBottom sx={sectionHeaderStyle}>
            Login Credentials:
          </Typography>

          <StyledTextField
            label="Email Address"
            name="Email"
            type="email"
            value={formData.Email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.Email}
            helperText={touchedFields.Email ? formErrors.Email : ''}
          />

          <StyledTextField
            label="Password"
            name="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.Password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.Password}
            helperText={
              <div>
                {touchedFields.Password && formErrors.Password && (
                <Typography component="div" variant="body2" color="error" display="block">
                  Password must:
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>Be 8-20 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one lowercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character (!, @, #, $, %, ^, &, *)</li>
                  </ul>
                </Typography>
                )}
                 {capsLockOn && (
                  <Typography component="div" sx={{ color: '#550000', fontSize: '0.875rem', marginTop: '4px' }}>
                    Caps Lock is on
                  </Typography>
                )}
              </div>
            }
            onKeyDown={(e) => handleCapsLockKey(e, setCapsLockOn)}
            onKeyUp={(e) => handleCapsLockKey(e, setCapsLockOn)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ?  <Visibility />: <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            label="Confirm Password"
            name="Confirm_Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.Confirm_Password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.Confirm_Password}
            helperText={
              touchedFields.Confirm_Password && formErrors.Confirm_Password && (
                <Typography component="span" color="error" display="block">
                  {formErrors.Confirm_Password}
                </Typography>
              )
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button
              type="button"
              variant="contained"
              sx={buttonStyles.cancel}
              onClick={() =>
                setFormData({
                  UIN: '',
                  FirstName: '',
                  MiddleInitials: '',
                  LastName: '',
                  Email: '',
                  Password: '',
                  Confirm_Password: ''
                })
              }
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={buttonStyles.publish}
              disabled={!isFormValid}
            >
              Register
            </Button>
          </Box>
        </form>
      </Container>

      {/* Dialog for showing email verification prompt */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Email Verification</DialogTitle>
        <DialogContent>
          <Typography>Please check your email ({formData.Email}) for the verification link to activate your account.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};


// Define custom styles for the buttons and headers
const buttonStyles = {
  cancel: {
    border: '3px solid #550000',
    backgroundColor: '#f5f5f5',
    color: '#000',
    fontWeight: 'bold',
  },
  publish: {
    border: '3px solid #550000',
    backgroundColor: '#4caf50',
    color: '#000',
    fontWeight: 'bold',
  },
};

const sectionHeaderStyle = {
  fontWeight: 'bold',
  backgroundColor: '#550000',
  color: 'white',
  padding: '8px',
};

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: '16px 0',
  width: '100%', // Ensures the width remains consistent
  '& .MuiInputBase-root': {
    fontSize: '1rem', // Set a fixed font size
    padding: '10px 14px', // Set a fixed padding
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'grey',
    fontStyle: 'italic',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px', // Set a consistent border width
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px', // Prevents the border from changing thickness on focus
  },
}));

