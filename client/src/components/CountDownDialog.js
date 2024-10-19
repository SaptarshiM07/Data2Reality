/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button } from '@mui/material';

const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
};

const dialogStyle = {
  width: 300,
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
};

export const CountdownDialog = ({ open, setOpen }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer;
    if (open) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            handleClose(); // Close dialog and redirect after countdown ends
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [open]);

  const handleClose = () => {
    setOpen(false); // Close the dialog
    // Redirect immediately upon clicking OK
    window.location.href = '/'; // Replace with your login page route
  };

  const handleBackdropClick = (event) => {
    // Prevent closing the dialog on backdrop click
    event.stopPropagation();
  };

  return (
    <Modal open={open} onClose={handleBackdropClick} style={modalStyle}>
      <div style={dialogStyle}>
        <Typography variant="h6">Registration successful!</Typography>
        <Typography variant="body1">Redirecting in {countdown} seconds...</Typography>
        <Typography variant="body2">Click Ok to redirect immediately</Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <Button variant="contained" color="primary" onClick={handleClose} style={{ marginRight: 10 }}>
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
  
};