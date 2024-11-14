import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';


const endpointpath = process.env.REACT_APP_API_BASE_URL;
const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const navigate = useNavigate();
  const location = useLocation();

  // Function to extract query parameters (token and email) from the URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    return { token, email };
  };

  useEffect(() => {
    // Extract token and email from URL
    const { token, email } = getQueryParams();

    // Call the backend to verify the token and email
    const verifyEmail = async () => {
      try {
        const response = await fetch(` ${endpointpath}/api/checkEmailVerification?token=${token}&email=${email}`);
        const result = await response.json();

        if (response.ok && result.message === 'Email verified successfully and user registered!') {
          setVerificationStatus('success');
          setTimeout(() => navigate('/'), 2000); // Redirect to login page after 2 seconds
        } else {
          setVerificationStatus('failed');
          setTimeout(() => navigate('/register'), 3000); // Redirect to register page after failure
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('failed');
        setTimeout(() => navigate('/register'), 3000); // Redirect to register page after failure
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      {verificationStatus === 'pending' && (
        <>
          <CircularProgress />
          <Typography variant="h6" mt={2}>Verifying your email...</Typography>
        </>
      )}
      {verificationStatus === 'success' && (
        <Typography variant="h6" color="green">Email verified successfully! Redirecting to login...</Typography>
      )}
      {verificationStatus === 'failed' && (
        <Typography variant="h6" color="red">Email verification failed. Redirecting to registration...</Typography>
      )}
    </Box>
  );
};

export default EmailVerification;