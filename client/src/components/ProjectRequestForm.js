
import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl,
  FormLabel, Container, Box
} from '@mui/material';
import ReactPlayer from 'react-player';
import '../css/ProjectForm.css';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { newProjectDialogForm } from '../jsx/newProjectDialogForm';

const endpointpath = process.env.REACT_APP_API_BASE_URL;

export const ProjectRequestForm = ({ open, handleClose, userData}) => {

  
  const [formData, setFormData] = useState({
    requesterUIN: '',
    requesterName: '',
    requesterTitle: '',
    requesterDepartment: '',
    requesterEmail: '',
    requestTitle: '',
    proposalDeadline: '',
    startDate: '',
    endDate: '',
    keywords: '',
    projectSummary: '',
    desiredOutcomes: '',
    collaborators: '',
    specificLocation: 'NO',
    locationDetails: '',
    projectRestrictions: '',
    availableResources: '',
    studentFunding: 'No Funding Available',
    fundingDetails: '',
    alternateContact: '',
    specialInstructions: '',
    proposalVideo: '',
  });

  const [videoFile, setVideoFile] = useState(null);
  const [formErrors, setFormErrors] = useState({}); // to be added later
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // to be added later
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  

// Update form data when userData changes
useEffect(() => {
  if (userData) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      requesterUIN: userData.UIN,
      requesterName: `${userData.FirstName} ${userData.MiddleInitials||''} ${userData.LastName}`,
      requesterTitle: userData.Employer_Title || '',
      requesterDepartment: userData.User_Dept || '',
      requesterEmail: userData.Email,
    }));
  }
}, [userData]);






 // behaviour when user goes from one field to another 
const handleChange = (e) => {
  const { name, value } = e.target; // Extract the name and value from the input element
  setFormData({
    ...formData, // Spread the existing formData
    [name]: value, // Update the specific field that changed
  });
  setTouchedFields({ ...touchedFields, [name]: true }); // Mark the field as touched for validation purposes
};





  // Function to create form payload
const createFormPayload = (formData, videoFile) => {
  const formPayload = new FormData();
  
  // Append each field from formData to formPayload
  for (const [key, value] of Object.entries(formData)) {
    formPayload.append(key, value);
  }
  
  // Append video file if present
  if (videoFile) {
    formPayload.append('proposalVideo', videoFile);
  }
  
  return formPayload;
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formPayload = createFormPayload(formData, videoFile);
    //sends to the request ednpoint for processing.
    try {
      const response = await fetch(`${endpointpath}/api/submit`, {
        method: 'POST',
        body: formPayload,
        headers: {
          'authorization': localStorage.getItem('token'),
          'usertype': userData.UserType,
        },
      });

      if (response.ok) {
        console.log('Project published successfully');
        console.log(formData);
        // if successful navigate back to the dashboard.
      } else {
        console.error('Failed to publish project');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }finally{
      handleClose();
       //Reload the page after 2 seconds
       setTimeout(() => {
        window.location.reload();
    }, 1000);
    }
  };



  const handleSave = async (e) => {
    e.preventDefault();

    

    const formPayload = createFormPayload(formData, videoFile);

    //sends to the request ednpoint for processing.
    try {
      const response = await fetch(`${endpointpath}/api/save`, {
        method: 'POST',
        body: formPayload,
        headers: {
          'authorization': localStorage.getItem('token'),
          'usertype': userData.UserType,
        },
      });

      if (response.ok) {
        console.log('Project saved successfully');
        console.log(formData);
        
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }finally {
      handleClose();
       // Reload the page after 2 seconds
       setTimeout(() => {
        window.location.reload();
    }, 1000);
    }
  };

 



  return (
    <>
      {newProjectDialogForm({
        openDialog: open,
        handleDialogClose: handleClose,
        formData: formData,
        handleChange: (e) => setFormData({ ...formData, [e.target.name]: e.target.value }),
        handleSave: handleSave,
        handleSubmit: handleSubmit,
      })}
    </>
  );
};

