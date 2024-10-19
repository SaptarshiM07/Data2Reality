import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';

const endpointpath = process.env.REACT_APP_API_BASE_URL;

export const ProfileForm = ({ onClose }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    UIN: '',
    FirstName: '',
    MiddleInitials: '',
    LastName: '',
    Email: '',
    Password: '',
    UserType: '',
    Secondary_Role: '',
    User_Dept: '',
    Employer_Title: '',
    Student_Status: '',
    Student_Degree: '',
    Student_Resume: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploading, setUploading] = useState(false);
  //const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${endpointpath}/api/user/data`, {
          headers: {
            'authorization': token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setFormData({
            UIN: data.UIN,
            FirstName: data.FirstName,
            MiddleInitials: data.MiddleInitials,
            LastName: data.LastName,
            Email: data.Email,
            Password: data.Password,
            UserType: data.UserType,
            Secondary_Role: data.Secondary_Role || '',
            User_Dept: data.User_Dept || '',
            Employer_Title: data.Employer_Title || '',
            Student_Status: data.Student_Status || '',
            Student_Degree: data.Student_Degree || '',
            Student_Resume: data.Student_Resume || null
          });
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const handleFileChange = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData({ ...formData, Student_Resume: file });
    }
  };

  const handleDeleteFile = () => {
    setFormData({ ...formData, Student_Resume: null });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.User_Dept) errors.User_Dept = 'User department is required';

    if (formData.UserType === 'Student') {
      if (!formData.Student_Status) errors.Student_Status = 'Student Status is required';
      if (!formData.Student_Degree) errors.Student_Degree = 'Student Degree is required';
      if (!formData.Student_Resume) {
        errors.Student_Resume = 'Resume is required';
      } else if (formData.Student_Resume && formData.Student_Resume.type !== 'application/pdf') {
        errors.Student_Resume = 'Resume must be a PDF file';
      }
    }

    if (formData.UserType === 'Employer' && !formData.Employer_Title) {
      errors.Employer_Title = 'Employer Title is required';
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isFormValid) return;

      setUploading(true);

      const formPayload = new FormData();
      for (const key in formData) {
        formPayload.append(key, formData[key]);
      }

      try {
        let response;
  
        if (formData.UserType === 'Student') {
          response = await fetch(`${endpointpath}/api/user/studentprofileupdate`, {
            method: 'POST',
            headers: {
              'Authorization': localStorage.getItem('token'),
            },
            body: formPayload,
          });
        } else {
          const { Student_Status, Student_Degree, Student_Resume, ...employer_formData } = formData;
          response = await fetch(`${endpointpath}/api/user/employerprofileupdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify(employer_formData),
          });
        }
  
        if (response.ok) {
          console.log('Profile updated successfully');
          onClose();
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setUploading(false);
      }
    };

  const handleReset = () => {
    setFormData({
      UIN: userData.UIN,
      FirstName: userData.FirstName,
      MiddleInitials: userData.MiddleInitials,
      LastName: userData.LastName,
      Email: userData.Email,
      Password: userData.Password,
      UserType: userData.UserType,
      Secondary_Role: userData.Secondary_Role || '',
      User_Dept: userData.User_Dept || '',
      Employer_Title: userData.Employer_Title || '',
      Student_Status: userData.Student_Status || '',
      Student_Degree: userData.Student_Degree || '',
      Student_Resume: userData.Student_Resume || null
    });
    setFormErrors({});
    setTouchedFields({});
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    onDrop: handleFileChange,
  });

  if (!userData) return <Typography>Loading...</Typography>;

  return (
<Container>
  <Typography variant="h4" gutterBottom>
    Edit Profile
  </Typography>
  <form onSubmit={handleSubmit}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="UIN"
          name="UIN"
          value={formData.UIN}
          onChange={handleChange}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="First Name"
          name="FirstName"
          value={formData.FirstName}
          onChange={handleChange}
          fullWidth
          error={!!formErrors.FirstName}
          helperText={formErrors.FirstName}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Middle Initials"
          name="MiddleInitials"
          value={formData.MiddleInitials}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Last Name"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          fullWidth
          error={!!formErrors.LastName}
          helperText={formErrors.LastName}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          name="Password"
          type="password"
          value={formData.Password}
          onChange={handleChange}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Primary Role"
          name="UserType"
          value={formData.UserType}
          onChange={handleChange}
          fullWidth
          disabled
        />
      </Grid>
      {formData.Secondary_Role && (
        <Grid item xs={12}>
          <TextField
            label="Secondary Role"
            name="Secondary_Role"
            value={formData.Secondary_Role}
            onChange={handleChange}
            fullWidth
            disabled
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          label="User Department"
          name="User_Dept"
          value={formData.User_Dept}
          onChange={handleChange}
          fullWidth
          error={!!formErrors.User_Dept}
          helperText={formErrors.User_Dept}
        />
      </Grid>
      {userData.UserType === 'Student' && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.Student_Status}>
              <InputLabel>Student Status</InputLabel>
              <Select
                name="Student_Status"
                value={formData.Student_Status}
                onChange={handleChange}
              >
                <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
              </Select>
              {formErrors.Student_Status && (
                <Typography variant="caption" color="error">
                  {formErrors.Student_Status}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Student Degree"
              name="Student_Degree"
              value={formData.Student_Degree}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.Student_Degree}
              helperText={formErrors.Student_Degree}
            />
          </Grid>
          <Grid item xs={12}>
            <div {...getRootProps()} style={dropzoneStyles}>
              <input {...getInputProps()} />
              <Typography variant="body1" align="center">
                Drag and drop your resume here or click to select a PDF file
              </Typography>
              </div>
              {formData.Student_Resume && (
                <Box mt={2} display="flex" alignItems="center">
                  <Typography variant="body2">
                    {formData.Student_Resume.name} ({(formData.Student_Resume.size / 1024).toFixed(2)} KB)
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleDeleteFile}
                    style={{ marginLeft: '10px' }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              )}
            
            {formErrors.Student_Resume && (
              <Typography variant="caption" color="error">
                {formErrors.Student_Resume}
              </Typography>
            )}
          </Grid>
        </>
      )}
      {userData.UserType === 'Employer' && (
        <Grid item xs={12}>
          <TextField
            label="Employer Title"
            name="Employer_Title"
            value={formData.Employer_Title}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.Employer_Title}
            helperText={formErrors.Employer_Title}
          />
        </Grid>
      )}
    </Grid>
    <Box mt={2}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid || uploading}
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
      >
        {uploading ? 'Uploading...' : 'Submit'}
      </Button>
      {/*<Button
        variant="outlined"
        color="secondary"
        onClick={handleReset}
        style={{ marginLeft: '10px' }}
      >
        Reset
      </Button>*/}
      <Button
        variant="outlined"
        onClick={onClose}
        style={{ marginLeft: '10px' }}
      >
        Close
      </Button>
    </Box>
  </form>
</Container>

  );
      };

      const dropzoneStyles = {
        border: '2px dashed #ccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        marginTop: '10px',
        };     
        
    