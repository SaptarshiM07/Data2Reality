import React, { useState, useEffect, useRef} from 'react';
import ReactPlayer from 'react-player';
import {
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Link, 
  IconButton,
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Drawer
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ProposalList } from '../ProposalComponent/ProposalList';


const endpointpath = process.env.REACT_APP_API_BASE_URL;

const ProjectDetails = ({ project, userType, userInfo }) => {

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleClick = () => {
    setOpenDrawer(true);
  };

  

  const handleOpen = () => {
    // Logic to open your modal or handle video playback
  };



  const [formData, setFormData] = useState({
    projectID: '', // Initialize fields to empty strings or default values
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
    proposalVideo: 'Proposal Video not Available',
    supplementalUpload: 'No supplemental file uploaded',
    projectStatus: '',
    closeStatus: 'Open',

    //Student part
    proposalID: '',
    applicantName: '',
    applicantEmail: '',
    applicantUIN: '',
    studentStatus: '',
    degreeProgram: '',
    experience: '',
    ableToMeetRequirements: '',
    unmetRequirements: '',
    proposalSummary: '',
    anticipatedOutcomes: '',
    resumeUpload: null,
    supplementalUpload: null,
    proposalStatus: '',
    applicationStatus: ''
  });

  console.log(formData); //inital blank form data

  const [proposals, setProposals] = useState([]); // State to store fetched proposals
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [status, setStatus] = useState(null);
  
   // Function to fetch proposals for the given projectID

   let isStudent = userInfo?.UserType === 'Student';

   const fetchProposals = async (projectID) => {
    try {
      console.log("Fetching proposals for projectID:", projectID); // Log the projectID being fetched
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found in localStorage.");
        return;
      }
  
      const response = await fetch(`${endpointpath}/api/displayproposals?ProjectID=${projectID}`, {
        method: 'GET',
        headers: {
          'authorization': token,
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      if (data.proposals && data.proposals.length > 0) {
        console.log("Fetched proposals data:", data.proposals); // Log the fetched proposals
        setProposals(data.proposals); // Set proposals only if they exist
      } else {
        console.log("No proposals found for projectID:", projectID); // Log when no proposals found
        setProposals([]); // Reset proposals to an empty array

        if (isStudent) {
            setStatus(null);
        } else {
            setStatus(project?.projectStatus || null);
              } // Reset status if there are no proposals
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching proposals:", err);
      setError('Error fetching proposals');
      setLoading(false);
    }
  }; // this will fetch a set of proposals for a project, it will be called in both student and employer interface.

   

   useEffect(() => {
    if (project) {
      console.log("Project changed:", project); // Log the project when it changes
      fetchProposals(project.projectID); // Fetch proposals when project changes
    }
  }, [project]);
  
  useEffect(() => {
    console.log("Project:", project); // Log project state
    console.log("Proposals:", proposals); // Log proposals state

    
    
    if (project && proposals.length > 0) {
      const proposal = proposals[0]; // Take the first proposal if available
      console.log("Updating form with proposal:", proposal); // Log the proposal being used
  
      // Update the formData state with the project and proposal details
      setFormData({
        projectID: project.projectID,
        requesterUIN: project.requesterUIN || '',
        requesterName: project.requesterName || '',
        requesterTitle: project.requesterTitle || '',
        requesterDepartment: project.requesterDepartment || '',
        requesterEmail: project.requesterEmail || '',
        requestTitle: project.requestTitle || '',
        proposalDeadline: project.proposalDeadline || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        keywords: project.keywords || '',
        projectSummary: project.projectSummary || '',
        desiredOutcomes: project.desiredOutcomes || '',
        collaborators: project.collaborators || '',
        specificLocation: project.specificLocation || 'NO',
        locationDetails: project.locationDetails || '',
        projectRestrictions: project.projectRestrictions || '',
        availableResources: project.availableResources || '',
        studentFunding: project.studentFunding || 'No Funding Available',
        fundingDetails: project.fundingDetails || '',
        alternateContact: project.alternateContact || '',
        specialInstructions: project.specialInstructions || '',
        proposalVideo: project.proposalVideo || '',
        supplementalUpload: project.supplementalUpload || 'No supplemental file uploaded',
        projectStatus: project.projectStatus || '',
        closeStatus: project.closeStatus || '',

  
        // Student part of the form --> will not make sense for employer interface
        proposalID: proposal?.proposalID || '',
        applicantName: `${userInfo.FirstName} ${userInfo.LastName}` || '',
        applicantEmail: userInfo.Email || '',
        applicantUIN: userInfo.UIN || '',
        proposalTitle: proposal?.proposalTitle || '',
        studentStatus: proposal?.studentStatus || 'Undergraduate',
        degreeProgram: proposal?.degreeProgram || '',
        experience: proposal?.experience || '',
        ableToMeetRequirements: proposal?.ableToMeetRequirements || 'YES',
        unmetRequirements: proposal?.unmetRequirements || '',
        proposalSummary: proposal?.Summary || '',
        anticipatedOutcomes: proposal?.anticipatedOutcomes || '',
        resumeUpload: proposal?.resumeUpload || null,
        supplementalUpload: proposal?.supplementalUpload || null,
        applicationStatus: proposal?.applicationStatus || 'In Review',
        proposalStatus: proposal?.proposalStatus || ''
      });
  
      // Log the updated formData
      console.log("Updated formData:", formData);
  
      // Update status state based on the fetched proposal's proposalStatus
      if (isStudent) {
        setStatus(proposal?.proposalStatus || null);
        console.log("proposalStatus updated:", proposal?.proposalStatus || null);
      } else {
        setStatus(project?.projectStatus || null);
        console.log("projectStatus updated:", project?.projectStatus || null);
      }

      
    } else if (project && proposals.length === 0) {
      // Handle case when no proposals exist for the project
      console.log("No proposals found for this project.");
      
      setFormData({
        projectID: project.projectID,
        requesterUIN: project.requesterUIN || '',
        requesterName: project.requesterName || '',
        requesterTitle: project.requesterTitle || '',
        requesterDepartment: project.requesterDepartment || '',
        requesterEmail: project.requesterEmail || '',
        requestTitle: project.requestTitle || '',
        proposalDeadline: project.proposalDeadline || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        keywords: project.keywords || '',
        projectSummary: project.projectSummary || '',
        desiredOutcomes: project.desiredOutcomes || '',
        collaborators: project.collaborators || '',
        specificLocation: project.specificLocation || 'NO',
        locationDetails: project.locationDetails || '',
        projectRestrictions: project.projectRestrictions || '',
        availableResources: project.availableResources || '',
        studentFunding: project.studentFunding || 'No Funding Available',
        fundingDetails: project.fundingDetails || '',
        alternateContact: project.alternateContact || '',
        specialInstructions: project.specialInstructions || '',
        proposalVideo: project.proposalVideo || '',
        supplementalUpload: project.supplementalUpload || 'No supplemental file uploaded',
        projectStatus: project.projectStatus || '',
        closeStatus: project.closeStatus || '',
  
        // Student part of the form: empty since no proposal exists
        proposalID: '',
        applicantName: `${userInfo.FirstName} ${userInfo.LastName}` || '',
        applicantEmail: userInfo.Email || '',
        applicantUIN: userInfo.UIN || '',
        proposalTitle: '',
        studentStatus: 'Undergraduate',
        degreeProgram: '',
        experience: '',
        ableToMeetRequirements: 'YES',
        unmetRequirements: '',
        proposalSummary: '',
        anticipatedOutcomes: '',
        resumeUpload: null,
        supplementalUpload: null,
        applicationStatus: 'In Review',
        proposalStatus: ''
      });
  
      // Reset the status to 'Unknown' when no proposals exist
      // Update status state based on the fetched proposal's proposalStatus
      if (isStudent) {
        setStatus(null);
      } else {
        setStatus(project?.projectStatus || null);
      }
    }
  }, [project, proposals]); // Runs when either project or proposals change

    
  


  //need to check the projectID
  //console.log("This is the sent project:", project);  
  //console.log("This is projectID sent:", formData.projectID); //

  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [formErrors, setFormErrors] = useState({}); // to be added later
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // to be added later
  const [resumeFile, setResumeFile] = useState(null); //setting resume file 
  const [supplementalFile, setSupplementalFile] = useState(null); //setting supplemental file
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState(''); // 'success' or 'error'

  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [dialogAction, setDialogAction] = useState(null); // State for the action type ('cancel' or 'close')


  const documentInputRef = useRef(null);


  // behaviour when user goes from ine field to another 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (name === 'proposalVideo') {
        setVideoFile(file);
        setFormData((prevFormData) => ({
          ...prevFormData,
          proposalVideo: URL.createObjectURL(file),
        }));
      } else if (name === 'resumeUpload') {
        setResumeFile(file);
        setFormData((prevFormData) => ({
          ...prevFormData,
          resumeUpload: URL.createObjectURL(file),
        }));
      } else if (name === 'supplementalUpload') {
        setSupplementalFile(file);
        setFormData((prevFormData) => ({
          ...prevFormData,
          supplementalUpload: URL.createObjectURL(file),
        }));
      }
    }
  };


  const handleFileRemove = () => {
    setFormData({ ...formData, resumeUpload: proposals[0]?.resumeUpload || null});
  };

  const handleDeleteFile = () => {
    setFormData({ ...formData, supplementalUpload: null });
    setSupplementalFile(null);
    documentInputRef.current.value = ''; // Clear file input
  };

  const getFileNameFromURL = (url) => {
    if (url && url.startsWith('https://')) {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }
    return null;
  };



  // Start of form creation and submit/save
  // Function to create form payload
const createFormPayload = (formData, videoFile, resumeFile, supplementalFile) => {
  const formPayload = new FormData();
  
  // Append each field from formData to formPayload
  for (const [key, value] of Object.entries(formData)) {
    formPayload.append(key, value);
  }
  // Append video file if present
  if (videoFile) {
    formPayload.append('proposalVideo', videoFile);
  }
  // Append video file if present
  if (resumeFile) {
    formPayload.append('resumeUpload', resumeFile);
  }

  // Append video file if present
  if (supplementalFile) {
    formPayload.append('supplementalUpload', supplementalFile);
  }
  return formPayload;
};

// Open confirmation dialog
const openDialog = (action) => {
  setDialogAction(action); // Set action type (e.g., 'cancel' or 'close')
  setDialogOpen(true); // Open dialog
};

// Close confirmation dialog
const closeDialog = () => {
  setDialogOpen(false); // Close dialog
};

// Handle confirmation action
const handleDialogConfirm = () => {
  if (dialogAction === 'cancel') {
    handleWithdraw(null, project, userType, userInfo); // Call cancel handler
  } else if (dialogAction === 'close') {
    handleClose(null, project, userType, userInfo); // Call close handler
  }
  setDialogOpen(false); // Close dialog after action
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = createFormPayload(formData, videoFile, resumeFile, supplementalFile);
    console.log(formPayload);
    //sends to the request ednpoint for processing.
    try {
      const response = await fetch(`${endpointpath}/api/submit`, {
        method: 'POST',
        body: formPayload,
        headers: {
          'authorization': localStorage.getItem('token'),
          'usertype': userType,
        },
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        console.log(formData);
        if (userType === 'Employer') {
          setNotification('Project submitted successfully.');
          } else
          {setNotification('Application submitted successfully.');}
        setNotificationType('success');
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
      }, 1000); // 2000ms = 2 seconds
        //navigate('/dashboard'); // if successful navigate back to the dashboard.
      } else {
        console.error('Failed to submit form');
        setNotification('Project submitted successfully.');
        setNotificationType('Success');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }  finally {
      handleDrawerClose(); // Close the dialog box regardless of the outcome
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();

    const formPayload = createFormPayload(formData, videoFile, resumeFile, supplementalFile);
    console.log(formPayload);

    //sends to the request ednpoint for processing.
    try {
      const response = await fetch(`${endpointpath}/api/save`, {
        method: 'POST',
        body: formPayload,
        headers: {
          'authorization': localStorage.getItem('token'),
          'usertype': userType,
        },
      });

      if (response.ok) {
        console.log('Form draft edited successfully');
        console.log(formData);
        if (userType === 'Employer') {
        setNotification('Project saved successfully.');
        } else
        {setNotification('Application saved successfully.');}
        setNotificationType('success');
        
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
      }, 1000); // 2000ms = 2 seconds
        //navigate('/dashboard'); // if successful navigate back to the dashboard.
      } else {
        console.error('Failed to submit form');
        setNotification('Failed to save form.');
        setNotificationType('success');
        
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      handleDrawerClose(); // Close the dialog box regardless of the outcome
    }
  };



  // handle withdraw application function 
  const handleWithdraw = async (e, project, userType, userInfo) => {
    if (e) {
      e.preventDefault(); // Only prevent default if `e` exists
    }

    console.log(`You are about to cancel ${project}`)
  
    try {
      const response = await fetch(`${endpointpath}/api/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('token'), // Include the token from localStorage
        },
        body: JSON.stringify({
          projectID: project.projectID, 
          userType: userType,   
          UIN: userInfo.UIN              
        }),
      });
  
      if (response.ok) {
        console.log('Proposal withdrawn successfully');
        if (userType === 'Employer') {
          setNotification('Project cancelled successfully.');
        } else {
          setNotification('Application withdrawn successfully.');
        }
        setNotificationType('success');
        
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
  
        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('Failed to withdraw/cancel');
        setNotification('Failed to withdraw/cancel');
        setNotificationType('error');
      }
    } catch (error) {
      console.error('Error withdrawing/cancelling:', error);
    } finally {
      handleDrawerClose(); // Close the dialog box regardless of the outcome
    }
  };

 // handle Close project function 

  const handleClose = async (e, project, userType, userInfo) => {
    if (e) {
      e.preventDefault(); // Only prevent default if `e` exists
    }

    console.log(`You are about to close ${project}`)

    try {
      const response = await fetch(`${endpointpath}/api/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('token'), // Include the token from localStorage
        },
        body: JSON.stringify({
          projectID: project.projectID, 
          userType: userType,   
          UIN: userInfo.UIN              
        }),
      });

      if (response.ok) {
        setNotification('Project closed successfully.');
        setNotificationType('success');
        
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('Failed to close project');
        setNotification('Failed to close project.');
        setNotificationType('error');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      handleDrawerClose(); // Close the dialog box regardless of the outcome
    }
  };

 
  

  // console.log("This are me proposal items", proposals);
  return (
    <>
    <Box display="flex" flexDirection="column" height="100vh" alignItems="flex-start" justifyContent="flex-start">
            <Box
              display={notification ? 'block' : 'none'}
              padding={2}
              bgcolor={notificationType === 'success' ? 'green' : 'red'}
              color="white"
              textAlign="center"
              marginBottom={2}
            >
              {notification}
            </Box>

            {/* Conditional video play button */}
            {/* {project.proposalVideoUrl && project.proposalVideoUrl !== '' && project.proposalVideoUrl !== 'No Proposal Video Available' && (
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering any parent onClick
                    handleOpen(); // Open the modal with video
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '50%',
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Box>
            )} */}

            {/* Project details section */}
            <Box flex={1} textAlign="left" alignItems="flex-start" justifyContent="flex-start">
              <Typography variant="h4" gutterBottom>{project.requestTitle}</Typography>
              <Typography variant="body1" paragraph>{project.projectSummary}</Typography>
              <Typography variant="subtitle1">Keywords: {project.keywords}</Typography>
              <Typography variant="subtitle1">Proposal Deadline: {project.proposalDeadline}</Typography>
              <Button
                    variant="outlined"
                    onClick={handleClick}
                    sx={{
                      backgroundColor: status === 'Submitted' ? 'green' : status === 'Saved' ? 'yellow' : 'transparent',
                      color: status === 'Submitted' ? 'white' : status === 'Saved' ? '#550000' : '#550000',
                      border: '2px solid #550000',
                      margin: status !== 'Submitted' && status !== 'Saved' ? '8px' : '0',
                      '&:hover': {
                        backgroundColor: status === 'Submitted' ? 'darkgreen' : status === 'Saved' ? 'gold' : 'transparent',
                      },
                    }}
                  >
                         {
                            status === 'Submitted' ? (
                                                        userType === 'Student' ? 'Show Application' : 'Show Request'
                                                      ) 
                            : status === 'Saved' ? (
                                                       userType === 'Student' ? 'Continue Application' : 'Edit Request'
                                                   ) 
                            : (
                                userType === 'Student' ? 'Apply' : 'Edit Request'
                            )
                          }
              </Button>
   
            </Box>

            <Box flex={3} textAlign="left" alignItems="flex-start" justifyContent="flex-start">
                {/* Proposals section */}
                {userType === 'Employer' &&
                (loading ? (
                  <Typography>Loading proposals...</Typography>
                ) : (
                  <ProposalList proposals={proposals} fetchProposals={fetchProposals} />
                ))}
            </Box>


    <>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleDrawerClose}
        disableBackdropClick // Prevents closing when clicking outside
        
      >
        <Box
          sx={{
            width: 480, // Width of the drawer
            padding: 2,
            borderLeft: '5px solid #550000', // Optional border style
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#550000',
              textAlign: 'center',
              marginBottom: 2,
            }}
          >
            {userType === 'Student' ? 'Proposal Form' : 'Project Form'}
          </Typography>
          <form>
          {userType === 'Student' ? (
            <>
              

              <Typography 
              variant="h6"
              sx={{
                fontWeight: 'bold',          // Make text bold
                backgroundColor: '#550000',    // Brown background
                color: 'white',              // White text color
                padding: '8px',             // Padding for better appearance
              }}>
                Student Information
              </Typography>


              <StyledTextField
                label="Name"
                name="applicantName"
                fullWidth
                margin="normal"
                value={formData.applicantName}
                onChange={handleChange}
                disabled = {true}
              />

              <StyledTextField
                label="Email"
                name="applicantEmail"
                fullWidth
                margin="normal"
                value={formData.applicantEmail}
                onChange={handleChange}
                disabled = {true}
              />

              <Typography variant="h7">Student Status</Typography>
              <Box>
                <label>
                  <input
                    type="radio"
                    name="studentStatus"
                    value="Undergraduate"
                    checked={formData.studentStatus === 'Undergraduate'}
                    onChange={handleChange}
                  /> Undergraduate
                </label>
                <label>
                  <input
                    type="radio"
                    name="studentStatus"
                    value="Graduate"
                    checked={formData.studentStatus === 'Graduate'}
                    onChange={handleChange}
                  /> Graduate
                </label>
              </Box>

              <StyledTextField
                label="Degree Program and Department"
                name="degreeProgram"
                fullWidth
                margin="normal"
                value={formData.degreeProgram}
                onChange={handleChange}
                helperText="Please list your degree program and department (120 character limit)."
                inputProps={{ maxLength: 120 }}
                placeholder="For Ex: MS, Computer Science"
              />

              <StyledTextField
                label="Experience and Background"
                name="experience"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={formData.experience}
                onChange={handleChange}
                helperText="Briefly explain your experience and background (100 word limit)."
                placeholder="For Ex: BTech in Computer Science; 3 years of Computer Vision experience"
              />

              <Typography 
              variant="h6"
              sx={{
                fontWeight: 'bold',          // Make text bold
                backgroundColor: '#550000',    // Brown background
                color: 'white',              // White text color
                padding: '8px',             // Padding for better appearance
              }}>
              Proposal Details
              </Typography>

              <StyledTextField
                label="Proposal Title"
                name="proposalTitle"
                fullWidth
                margin="normal"
                value={formData.proposalTitle}
                onChange={handleChange}
                helperText="Please provide a proposal title (120 character limit)."
                inputProps={{ maxLength: 120 }}
                placeholder="For Ex: Image generation using RAG Pipeline"  // Placeholder text
              />

              <Typography variant="h8">Able to Meet Project Requirements ?</Typography>
              <Box>
                <label>
                  <input
                    type="radio"
                    name="ableToMeetRequirements"
                    value="YES"
                    checked={formData.ableToMeetRequirements === 'YES'}
                    onChange={handleChange}
                  /> Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="ableToMeetRequirements"
                    value="NO"
                    checked={formData.ableToMeetRequirements === 'NO'}
                    onChange={handleChange}
                  /> No
                </label>
                <label>
                  <input
                    type="radio"
                    name="ableToMeetRequirements"
                    value="MAYBE"
                    checked={formData.ableToMeetRequirements === 'MAYBE'}
                    onChange={handleChange}
                  /> Maybe
                </label>
              </Box>

              {formData.ableToMeetRequirements !== 'YES' && (
                <TextField
                  label="Details on Unmet Requirements"
                  name="unmetRequirements"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  value={formData.unmetRequirements}
                  onChange={handleChange}
                  helperText="Explain which requirements cannot be met (100 word limit)."
                  placeholder="For Ex: I am unable to meet the project’s requirements due to limited resources and expertise in the specific technologies required."
                />
              )}

              <TextField
                label="Proposal Summary"
                name="proposalSummary"
                fullWidth
                margin="normal"
                multiline
                rows={6}
                value={formData.proposalSummary}
                onChange={handleChange}
                helperText="Provide a summary of your intended project (350 word limit)."
                placeholder="For Ex: This proposal aims to leverage the Retrieval-Augmented Generation (RAG) pipeline for advanced image generation. By integrating retrieval mechanisms with generative models, we seek to enhance the quality and relevance of generated images. The approach promises improved contextual accuracy and creative outputs for various applications in digital content creation."
              />

              <TextField
                label="Anticipated Products and Outcomes"
                name="anticipatedOutcomes"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={formData.anticipatedOutcomes}
                onChange={handleChange}
                helperText="Describe the expected outcomes at the end of the project (150 word limit)."
                placeholder="For Ex: High-quality, contextually accurate images for marketing and digital platforms, with enhanced creativity and personalization for various industries."
              />

              <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#550000',
                        color: 'white',
                        padding: '8px',
                      }}
                    >
                      Upload Resume (.pdf)
                    </Typography>
                    <input
                      type="file"
                      name="resumeUpload"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />

                    {formData.resumeUpload && (
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        {/* Display file name */}
                        {typeof formData.resumeUpload === "object" ? (
                          <Typography>{formData.resumeUpload.name}</Typography>
                        ) : (
                          <Typography>{formData.resumeUpload}</Typography> // If it's a URL
                        )}

                        {/* Trash bin icon to remove file */}
                        <IconButton onClick={handleFileRemove} sx={{ marginLeft: '8px' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box> 
                    )}

                    {/* Display the link if resumeUpload is a URL */}
                    {formData.resumeUpload && typeof formData.resumeUpload === "string" && (
                      <Link href={formData.resumeUpload} target="_blank" rel="noopener" sx={{ marginTop: '8px', display: 'block' }}>
                        View Uploaded Resume
                      </Link>
                    )}
                  </Box>
          
                    {/* <Box>
                      <Typography>Upload Supplemental File:</Typography>
                      <input
                        type="file"
                        name="supplementalUpload"
                        accept=".pdf, .docx"
                        onChange={handleFileChange}
                      />
                    </Box> */}
          </>
      ) 
          :(
            <>
            <Typography 
              variant="h6"
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#550000',
                color: 'white',
                padding: '8px',
              }}>
              Employer Information
            </Typography>
          
            <StyledTextField
              label="Name"
              name="requesterName"
              fullWidth
              margin="normal"
              value={formData.requesterName}
              onChange={handleChange}
              disabled={true}
            />
          
            <FormControl fullWidth margin="normal">
            <InputLabel>Title</InputLabel>
            <Select
              label="Title"
              name="requesterTitle"
              value={formData.requesterTitle}
              onChange={handleChange}
            >
              {/* Conventional name titles */}
              <MenuItem value=""><em>Select Title</em></MenuItem>
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Dr.">Dr.</MenuItem>
              <MenuItem value="Prof.">Prof.</MenuItem>
            </Select>
          </FormControl>
          
            <StyledTextField
              label="Department"
              name="requesterDepartment"
              fullWidth
              margin="normal"
              value={formData.requesterDepartment}
              onChange={handleChange}
            />
          
            <StyledTextField
              label="Email"
              name="requesterEmail"
              fullWidth
              margin="normal"
              value={formData.requesterEmail}
              onChange={handleChange}
              disabled = {true}
            />
          
            <Typography 
              variant="h6"
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#550000',
                color: 'white',
                padding: '8px',
              }}>
              Project Details
            </Typography>
          
            <StyledTextField
              label="Request Title"
              name="requestTitle"
              fullWidth
              margin="normal"
              value={formData.requestTitle}
              onChange={handleChange}
              helperText="Please provide a detailed and descriptive title (120 character limit)."
              inputProps={{ maxLength: 120 }}
            />
          
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <StyledTextField
                label="Proposal Deadline"
                name="proposalDeadline"
                type="date"
                fullWidth
                margin="normal"
                value={formData.proposalDeadline}
                onChange={handleChange}
                helperText="When are student proposals due?"
                InputLabelProps={{
                  shrink: true, 
                }}
                style={{ flex: 1, marginRight: '8px' }} // Adjust margin for spacing
              />
              
              <StyledTextField
                label="Estimated Start Date"
                name="startDate"
                type="date"
                fullWidth
                margin="normal"
                value={formData.startDate}
                onChange={handleChange}
                helperText="When are you looking to start the project?"
                InputLabelProps={{
                  shrink: true, 
                }}
                style={{ flex: 1, marginRight: '8px' }} // Adjust margin for spacing
              />
              
              <StyledTextField
                label="Estimated End Date"
                name="endDate"
                type="date"
                fullWidth
                margin="normal"
                value={formData.endDate}
                onChange={handleChange}
                helperText="When should the project be completed?"
                InputLabelProps={{
                  shrink: true, 
                }}
                style={{ flex: 1 }} // Last element doesn't need extra margin
              />
            </div>
          
            <StyledTextField
              label="Keywords"
              name="keywords"
              fullWidth
              margin="normal"
              value={formData.keywords}
              onChange={handleChange}
              helperText="Please provide up to five (5) keywords or phrases, separated by a semicolon."
            />
          
            <StyledTextField
              label="Project Summary"
              name="projectSummary"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={formData.projectSummary}
              onChange={handleChange}
              helperText="Provide a summary of the intended project (250 word limit)."
            />
          
            <StyledTextField
              label="Desired Outcomes"
              name="desiredOutcomes"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.desiredOutcomes}
              onChange={handleChange}
              helperText="Describe your desired goals, needs, or outcomes (50 word limit)."
            />
          
            <StyledTextField
              label="Collaborators and Partners"
              name="collaborators"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.collaborators}
              onChange={handleChange}
              helperText="Provide a brief description of any collaborators or partners (50 word limit)."
            />
          
            <Typography variant="h7">Specific Work Location(s) Required?</Typography>
            <Box>
              <label>
                <input
                  type="radio"
                  name="specificLocation"
                  value="YES"
                  checked={formData.specificLocation === 'YES'}
                  onChange={handleChange}
                /> Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="specificLocation"
                  value="NO"
                  checked={formData.specificLocation === 'NO'}
                  onChange={handleChange}
                /> No
              </label>
              <label>
                <input
                  type="radio"
                  name="specificLocation"
                  value="MAYBE"
                  checked={formData.specificLocation === 'MAYBE'}
                  onChange={handleChange}
                /> Maybe
              </label>
            </Box>
          
            {formData.specificLocation === 'YES' && (
              <StyledTextField
                label="Location Details"
                name="locationDetails"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                value={formData.locationDetails}
                onChange={handleChange}
                helperText="Please provide the specific location and any relevant details."
              />
            )}
          
            <StyledTextField
              label="Project Restrictions"
              name="projectRestrictions"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={formData.projectRestrictions}
              onChange={handleChange}
              helperText="Describe any project requirements or limitations (150 word limit)."
            />
          
            <StyledTextField
              label="Available Resources"
              name="availableResources"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.availableResources}
              onChange={handleChange}
              helperText="Please list any resources available for the student to use (100 word limit)."
            />
          
            <Typography variant="h7">Student Funding or Salary</Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems="center">
                <label style={{ marginRight: '16px' }}>
                  <input
                    type="radio"
                    name="studentFunding"
                    value="No Funding Available"
                    checked={formData.studentFunding === 'No Funding Available'}
                    onChange={handleChange}
                  /> No Funding Available
                </label>
                <label style={{ marginRight: '16px' }}>
                  <input
                    type="radio"
                    name="studentFunding"
                    value="Fixed Stipend"
                    checked={formData.studentFunding === 'Fixed Stipend'}
                    onChange={handleChange}
                  /> Fixed Stipend
                </label>
                <label style={{ marginRight: '16px' }}>
                  <input
                    type="radio"
                    name="studentFunding"
                    value="Hourly Wage"
                    checked={formData.studentFunding === 'Hourly Wage'}
                    onChange={handleChange}
                  /> Hourly Wage
                </label>
                <label>
                  <input
                    type="radio"
                    name="studentFunding"
                    value="Graduate Technician/Assistantship"
                    checked={formData.studentFunding === 'Graduate Technician/Assistantship'}
                    onChange={handleChange}
                  /> Graduate Technician/Assistantship
                </label>
              </Box>
          
            {formData.studentFunding !== 'No Funding Available' && (
              <StyledTextField
                label="Funding Details"
                name="fundingDetails"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                value={formData.fundingDetails}
                onChange={handleChange}
                helperText="Provide anticipated salary and funding details (100 word limit)."
              />
            )}
          
            <StyledTextField
              label="Alternate Contact Information"
              name="alternateContact"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.alternateContact}
              onChange={handleChange}
              helperText="Enter name, email, and phone number for alternate contact (50 word limit)."
            />
          
            <StyledTextField
              label="Special Proposal Submission Instructions"
              name="specialInstructions"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              value={formData.specialInstructions}
              onChange={handleChange}
              helperText="Provide any additional instructions or details (100 word limit)."
            />


            {/*Uploaded supplemental document (.pdf)*/}
            <Box sx={{ marginTop: '20px', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#550000',
                  color: 'white',
                  padding: '8px',
                  marginBottom: '10px',
                }}
              >
                Upload Supplemental File (.pdf)
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                <input
                  type="file"
                  name="supplementalUpload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={documentInputRef}
                  style={{ display: 'none' }}
                  id="supplementalUploadInput"
                />
                <label htmlFor="supplementalUploadInput">
                  <Button variant="contained" component="span" sx={{ backgroundColor: '#550000' }}>
                    Choose File
                  </Button>
                </label>

                {project?.supplementalUpload && project.supplementalUpload.startsWith('https://') ? (
                        <Link
                            href={project.supplementalUpload}
                            target="_blank"
                            rel="noopener"
                            sx={{ fontWeight: 'bold', marginLeft: '8px' }}
                          >
                            {getFileNameFromURL(project.supplementalUpload)}
                        </Link>
                
                ):null
                }

                
              </Box>

              {supplementalFile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>

                        <Typography fontWeight={"bold"}>
                            New File Chosen: {supplementalFile.name}
                        </Typography>

                        <IconButton onClick={handleDeleteFile} sx={{ marginLeft: '8px' }}>
                            <DeleteIcon />
                        </IconButton>

                </Box>

              ) : project?.supplementalUpload && project.supplementalUpload.startsWith('https://') ? (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>

                        <Typography fontWeight={"bold"}>
                          Current File: 
                        </Typography>

                        <Link
                            href={project.supplementalUpload}
                            target="_blank"
                            rel="noopener"
                            sx={{ fontWeight: 'bold', marginLeft: '8px' }}
                          >
                            {getFileNameFromURL(project.supplementalUpload)}
                        </Link>

                </Box>
              ) : (
                <Typography sx={{ fontWeight: 'bold', color: 'gray', marginLeft: '8px', marginTop: '8px' }}>
                  No Supplemental file uploaded
                </Typography>
              )}

            </Box>

            {/*
            
            <Box sx={{ marginTop: '20px' }}>
                <Typography 
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#550000',
                    color: 'white',
                    padding: '8px',
                  }}>
                  Upload Supplemental File (.pdf, .docx)
                </Typography>

                <input
                  type="file"
                  name="supplementalUpload"
                  accept=".pdf, .docx"
                  onChange={handleFileChange}
                />

                
                {formData.supplementalUpload && (
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    
                    {typeof formData.supplementalUpload === "object" ? (
                      <Typography>{formData.supplementalUpload.name}</Typography>
                    ) : (
                      <Typography>{formData.supplementalUpload}</Typography> // If it's a URL
                    )}

                    
                    <IconButton onClick={handleSupplementalFileRemove} sx={{ marginLeft: '8px' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}

                
                {formData.supplementalUpload && typeof formData.supplementalUpload === "string" && (
                  <Link href={formData.supplementalUpload} target="_blank" rel="noopener" sx={{ marginTop: '8px', display: 'block' }}>
                    View Uploaded Supplemental File
                  </Link>
                )}
              </Box>

              
              <Box sx={{ marginTop: '20px' }}>
                <Typography 
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: '#550000',
                    color: 'white',
                    padding: '8px',
                  }}>
                  Upload Proposal Video (.mp4)
                </Typography>

                <input
                  type="file"
                  name="proposalVideoUpload"
                  accept="video/mp4"
                  onChange={handleVideoChange}
                />

                
                {formData.proposalVideoUpload && (
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    
                    {typeof formData.proposalVideoUpload === "object" ? (
                      <Typography>{formData.proposalVideoUpload.name}</Typography>
                    ) : (
                      <Typography>{formData.proposalVideoUpload}</Typography> // If it's a URL
                    )}

                    
                    <IconButton onClick={handleVideoRemove} sx={{ marginLeft: '8px' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}

                
                {formData.proposalVideoUpload && typeof formData.proposalVideoUpload === "string" && (
                  <Link href={formData.proposalVideoUpload} target="_blank" rel="noopener" sx={{ marginTop: '8px', display: 'block' }}>
                    View Uploaded Proposal Video
                  </Link>
                )}
              </Box> */}
          </>
          )}
      </form>
    
          {/*<Button onClick={handleDialogClose} color="primary">Cancel</Button>}
          <Button onClick={handleSave} color="primary">Save</Button>
            <Button onClick={handleSubmit} color="primary">Publish</Button>*/}

          <Box display="flex" justifyContent="space-between" padding={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="auto"
            >
              {userType === 'Employer' && status === 'Submitted' && (
              <Button
                  // onClick={(e) => handleWithdraw(e, project, userType, userInfo)}
                  onClick={() => openDialog('cancel')}
                  sx={buttonStyles.cancelProject}
                  variant="contained"
                  disabled={!project || !project.projectID}
                >
                  Cancel Project
                </Button>

              )}
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100px"
            >
              {status !== 'Submitted' && (
                <Button
                  onClick={handleSave}
                  sx={buttonStyles.save}
                  variant="contained"
                >
                  Save
                </Button>
              )}
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100px"
            >
              {status !== 'Submitted' ? (
                <Button
                  onClick={handleSubmit}
                  sx={buttonStyles.publish}
                  variant="contained"
                >
                  {userType === 'Student' ? 'Submit' : 'Publish'}
                </Button>
              ) : null}
            </Box>

            <Box>
              {status === 'Submitted' && (
                <Button
                  // onClick={(e) => handleClose(e, project, userType, userInfo)}
                  onClick={() => openDialog('close')}
                  sx={buttonStyles.close}
                  variant="contained"
                  disabled={!project || !project.projectID}
                >
                  {userType === 'Student' ? 'Withdraw Application' : 'Close Project'}
                </Button>
              )}
            </Box>


          </Box>
        </Box>
        </Drawer>
    </>

    </Box>

    <Dialog open={dialogOpen} onClose={closeDialog}>
    <DialogTitle sx={{ color: '#d32f2f' }}>Warning</DialogTitle>
    <DialogContent>
      <Typography>
        You are about to {dialogAction === 'cancel' ? 'cancel this project' : 'close this project'}. Please confirm your action.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={closeDialog} sx={{ color: '#555' }}>
        Cancel
      </Button>
      <Button
        onClick={handleDialogConfirm}
        sx={{ color: '#fff', backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
      >
        Confirm
      </Button>
    </DialogActions>
    </Dialog>

</>
  );
};

export default ProjectDetails;


// Define custom styles for the buttons
const buttonStyles = {
  cancelProject: {
    border: '3px solid #ff0000', // Red border
    backgroundColor: '#ff4d4d', // Red background
    color: '#fff', // White text
    fontWeight: 'bold',
  },
  save: {
    border: '3px solid #550000', // Yellow border
    backgroundColor: '#fce300', // Yellow background
    color: '#000', // Black text
    fontWeight: 'bold',
  },
  publish: {
    border: '3px solid #550000', // Green border
    backgroundColor: '#4caf50', // Green background
    color: '#000', // Black text
    fontWeight: 'bold',
  },
  close: {
    border: '3px solid #550000', // Maroon border
    backgroundColor: '#550000', // Maroon background
    color: '#fff', // White text
    fontWeight: 'bold',
  },
};

// // for example placeholder inside the textfields
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary, // Text color
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'grey',
    fontStyle: 'italic',
  },
}));

