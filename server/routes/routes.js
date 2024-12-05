// userRoutes.js
import express from 'express';
import { registerUser } from '../controllers/registerUser.js';
import { authenticateUser } from '../controllers/authenticateUser.js';


import { authenticateToken } from '../middlewares/authentication.js';
import { uploadProfileResume, uploadResume, uploadSupplementalFile, uploadVideo} from '../middlewares/multer_uploadFile.js';
import { fileuploads3, proposalvideoUploads3, resumeUploads3, supplementalUploads3 } from '../middlewares/s3_fileHandling.js';
//import { uploadVideoFile } from '../middlewares/multerS3.js';

import { profileUpdate } from '../controllers/profileUpdate.js';
import { addRole } from '../controllers/addRole.js';
import { uploadUpdate } from '../controllers/uploadUpdate.js';

import { displayProjects } from '../controllers/displayProjects.js';
import { displayProposals } from '../controllers/displayProposals.js';
import { setupRoute } from '../middlewares/utils/setupRoute.js';
import { updateApplicationStatus } from '../controllers/updateApplicationStatus.js';
import { sendEmailVerification } from '../controllers/sendEmailVerification.js';
import { checkEmailVerification } from '../controllers/checkEmailVerification.js';
import { getUserStats } from '../controllers/getUserStats.js';




const router = express.Router();

router.post('/registerUser', (req, res) => {
  console.log('POST /api/registerUser');
  registerUser(req, res);
});

router.post('/auth/login', (req, res) => {
  console.log('POST /api/auth/login');
  authenticateUser(req, res);
})

router.get('/user/data', authenticateToken, (req, res) => {
  console.log('GET /api/user/data')
  const user = req.user;
  res.json(user);
  //console.log(res);
})

router.get('/stats', authenticateToken, (req, res) => {
  console.log('GET /api/stats');
  getUserStats(req,res);
  //console.log(res);
})

//update userprofile handler 
router.post('/user/studentprofileupdate', authenticateToken, uploadProfileResume, fileuploads3, (req, res) => {
  console.log('POST /api/user/studentprofileupdate');
  // Additional logic after file upload and S3 upload
  console.log(req.body)
  profileUpdate(req, res);
  
});

//update userprofile handler 
router.post('/user/employerprofileupdate', authenticateToken, (req, res) => {
  console.log('POST /api/user/employerprofileupdate');
  // Additional logic after file upload and S3 upload
  console.log(req.body);
  profileUpdate(req, res);
  
});

router.post('/user/addrole', authenticateToken, (req, res) => {
  console.log('POST /api/user/addrole');
  addRole(req, res);
  
})


//following routes are being used to save or publish new projects or edited projects
const saveHandler = uploadUpdate('Saved');
const submitHandler = uploadUpdate('Submitted');
const withdrawHandler = uploadUpdate('Withdrawn');
const closeHandler = uploadUpdate('Closed');

// Set up routes using the setupRoute function
setupRoute(router, '/save', saveHandler);
setupRoute(router, '/submit', submitHandler);

//below route get's the data from projectRequestForm, authenticates it and then sends to uploadVideoFile for file handling, finally 
//uplaods the entire form to Dynamo DB table.



//saving the project
// router.post('/save', authenticateToken, uploadVideo, videouploads3, (req,res) => {
//   console.log('POST /api/save');
//   saveHandler(req, res);
// } );






router.get('/projects', authenticateToken, (req,res) => {
  displayProjects(req, res);
  
} );

router.post('/withdraw', authenticateToken, (req, res) => {
  console.log('POST /api/withdraw');
  withdrawHandler(req, res);
} 
);

router.post('/close', authenticateToken, (req, res) => {
  console.log('POST /api/close');
  closeHandler(req, res);
} 
);


router.get('/displayproposals', authenticateToken, (req,res) => {
  console.log('GET /api/displayproposals')
  displayProposals(req, res);
  
} )

router.post('/applicationStatus', authenticateToken, (req, res) => {
  console.log('POST /api/applicationStatus')
  updateApplicationStatus(req,res);
})

router.post('/sendEmailVerification', (req, res) => {
  console.log('POST /api/sendEmailVerification')
  sendEmailVerification(req,res);
})

router.post('/checkEmailVerification', (req,res) => {
  console.log('POST /api/checkEmailVerification')
  checkEmailVerification(req, res);
})

export default router;
