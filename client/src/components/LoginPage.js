import React, { useState } from 'react';
import { Container, Typography, TextField, Button, IconButton, InputAdornment, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../img/logodtr.png';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [capsLock, setCapsLock] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const endpointpath = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${endpointpath}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('Login successful!');
        localStorage.setItem('token', data.token);
        console.log(data.token);
        navigate('/dashboard');
      } else {
        setResponseMessage('Error: ' + data.msg);
      }
    } catch (error) {
      setResponseMessage('An error occurred: ' + error.message);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 2000); // Show password for 2 seconds
  };

  const handleCapsLock = (e) => {
    setCapsLock(e.getModifierState("CapsLock"));
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
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5" align="center" sx={{ color: "#550000", fontWeight: 'bold' }}>
            Welcome to Data2Reality !!
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleCapsLock}
              onKeyUp={handleCapsLock}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handlePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {capsLock && (
              <Typography variant="caption" sx={{ color: "#550000", fontWeight: 'bold' }}>
                Caps Lock is on
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          {responseMessage && (
            <Typography sx={{ color: responseMessage.includes('successful') ? 'green' : 'red', mt: 2 }}>
              {responseMessage}
            </Typography>
          )}
          <Typography align="center" variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            New to Data2Reality? <Link to="/register" style={{ color: '#550000', fontWeight: 'bold' }}>Create an Account</Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

