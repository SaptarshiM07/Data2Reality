import React from 'react';
import { Dialog,
         DialogTitle, 
         DialogContent, 
         DialogActions, 
         Button, 
         TextField, 
         IconButton,
         Typography, 
         FormControl,
         InputLabel,
         Select,
         MenuItem,
         Box
         } from '@mui/material';
//import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { Delete as DeleteIcon } from '@mui/icons-material';




export const newProjectDialogForm = ({
openDialog, 
handleDialogClose,
formData, 
handleChange, 
handleSave, 
handleSubmit, 
handleFileChange,
handleDeleteFile,
videoInputRef,
documentInputRef,
}) => {

return (
            <Dialog 
                open={openDialog} 
                onClose={handleDialogClose}
                PaperProps={{
                sx: {
                    border: '5px solid #550000',  // Set border color and width
                    margin: 1,   
                    background: '#D1D1D1'                 // Add margin around the dialog
                    },
                }}
            >
                    
            <DialogTitle
                    variant = "h5"
                    sx={{
                        fontWeight: 'bold',          // Make text bold
                        color: '#550000',
                        textAlign: 'center',  // Center-align the text
                    }}
            >Project Form
            </DialogTitle>


            <DialogContent>
                <form>
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
                                flexShrink: 0,
                                marginBottom: '10px'
                                }}
                            >
                                Upload Supplemental File (.pdf)
                            </Typography>
                            
                            {/* File Input and Label */}
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
                                <Button variant="contained" component="span" sx={{backgroundColor: '#550000'}}>
                                    Choose File
                                </Button>
                                </label>
                            

                            {/* Display File Name and Delete Icon */}
                            {formData.supplementalUpload ? (
                                    // If a file is chosen, show the file name and delete icon
                                    <>
                                    <Typography sx={{ marginRight: '4px', marginLeft: '8px'}}>
                                        {formData.supplementalUpload.name}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleDeleteFile('supplementalUpload')}
                                        size="small"
                                        sx={{ color: 'red' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    </>
                                ) : (
                                    // If no file is chosen, show "No file chosen"
                                    <Typography sx={{ color: 'gray' , marginLeft: '8px'}}>
                                    No file chosen
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        

                        {/*Proposal Video Upload*/}
                        {/* <Box sx={{ marginTop: '20px', alignItems: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#550000',
                                color: 'white',
                                padding: '8px',
                                flexShrink: 0,
                                marginBottom: '10px'
                                }}
                            >
                                Upload Proposal Video (.mp4)
                            </Typography> */}

                            {/* File Input and Label */}
                            {/* <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                                <input
                                type="file"
                                name="proposalVideo"
                                accept="video/mp4"
                                onChange={handleFileChange}
                                ref={videoInputRef}
                                style={{ display: 'none' }}
                                id="proposalVideoInput"
                                />
                                <label htmlFor="proposalVideoInput">
                                <Button variant="contained" component="span" sx={{backgroundColor: '#550000'}}>
                                    Choose File
                                </Button>
                                </label> */}

                                {/* Display File Name and Delete Icon */}
                                {/* {formData.proposalVideo ? (
                                    // If a file is chosen, show the file name and delete icon
                                    <>
                                    <Typography sx={{ marginRight: '4px', marginLeft: '8px'}}>
                                        {formData.proposalVideo.name}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleDeleteFile('proposalVideo')}
                                        size="small"
                                        sx={{ color: 'red' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    </>
                                ) : (
                                    // If no file is chosen, show "No file chosen"
                                    <Typography sx={{ color: 'gray' , marginLeft: '8px'}}>
                                    No file chosen
                                    </Typography>
                                )}
                            </Box>
                        </Box> */}

                    </>
                </form>
            </DialogContent>



            <DialogActions>

                    <Box display="flex" justifyContent="space-between" padding={2}>

                        {/*Cancel Button*/}
                        <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="100px"
                        >

                            <Button
                                onClick={handleDialogClose}
                                sx={buttonStyles.cancel}
                                variant="contained"
                            >
                            Cancel
                            </Button>

                        </Box>



                        {/*Save Button*/}
                        <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="100px"
                        >
                            <Button
                            onClick={handleSave}
                            sx={buttonStyles.save}
                            variant="contained"
                            >
                            Save
                            </Button>

                        </Box>



                        {/*Submit Button*/}
                        <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="100px"
                        >
                        
                            <Button
                            onClick={handleSubmit}
                            sx={buttonStyles.publish}
                            variant="contained"
                            >
                            Publish
                            </Button>
                        
                        </Box>

                    </Box>
            </DialogActions>


            </Dialog>
        );
};

// Define custom styles for the buttons
const buttonStyles = {
    cancel: {
      border: '3px solid #550000',
      backgroundColor: '#f5f5f5', // Light grey
      color: '#000', // Black text
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
      border: '3px solid #550000', // maroon border
      backgroundColor: '#550000', // maroon background
      color: '#fff', // Black text
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