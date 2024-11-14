import React, { useState, useEffect, useCallback, useRef } from 'react';
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

export const ProjectRequestForm = ({ open, handleClose, userData }) => {
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
    supplementalUpload: ''
  });

  // Refs for file inputs
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const navigate = useNavigate();

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        requesterUIN: userData.UIN,
        requesterName: `${userData.FirstName} ${userData.MiddleInitials || ''} ${userData.LastName}`,
        requesterTitle: userData.Employer_Title || '',
        requesterDepartment: userData.User_Dept || '',
        requesterEmail: userData.Email,
      }));
    }
  }, [userData]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0] || null;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: file,
    }));
  };

  const handleDeleteFile = (fileType) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fileType]: null,
    }));

    // Reset the appropriate file input
    if (fileType === 'supplementalUpload' && documentInputRef.current) {
      documentInputRef.current.value = ''; // Reset document input
    }
    if (fileType === 'proposalVideo' && videoInputRef.current) {
      videoInputRef.current.value = ''; // Reset video input
    }
  };

  const createFormPayload = (formData) => {
    const formPayload = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      console.log(`Appending field: ${key}, Value: ${value}`);
      formPayload.append(key, value);
    }
    return formPayload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = createFormPayload(formData);

    // Log formData before sending to the server
    console.log('Form Data to be submitted:', Object.fromEntries(formPayload.entries()));
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
      } else {
        console.error('Failed to publish project');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      handleClose();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formPayload = createFormPayload(formData);

    // Log formData before sending to the server
    console.log('Form Data to be saved:', Object.fromEntries(formPayload.entries()));
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
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      handleClose();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
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
        handleFileChange: handleFileChange,
        handleDeleteFile: handleDeleteFile,
        videoInputRef,
        documentInputRef,
      })}
    </>
  );
};
