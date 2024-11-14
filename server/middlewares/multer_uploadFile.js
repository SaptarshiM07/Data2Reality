// import multer from 'multer';

// // Define storage for uploaded files
// const storage_pdf = multer.memoryStorage(); // Store files in memory (you can change this to disk storage if needed)
// const storage_docx = multer.memoryStorage();

// // Configure multer
// const upload_pdf = multer({
//   storage: storage_pdf,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // Limit file size to 10MB (adjust as needed)
//   },
//   fileFilter: (req, file, callback) => {
//     if (file.mimetype !== 'application/pdf') {
//       return callback(new Error('Only PDF files are allowed'));
//     }
//     callback(null, true);
//   },
// });


// // Configure multer
// const upload_pdf = multer({
//   storage: storage_pdf,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // Limit file size to 10MB (adjust as needed)
//   },
//   fileFilter: (req, file, callback) => {
//     if (file.mimetype !== 'application/pdf') {
//       return callback(new Error('Only PDF files are allowed'));
//     }
//     callback(null, true);
//   },
// });

// // Configure multer to store files in memory for video files
// const storage_mp4 = multer.memoryStorage();

// const upload_mp4 = multer({
//   storage: storage_mp4,
//   limits: {
//     fileSize: 50 * 1024 * 1024, // Limit file size to 50MB (adjust as needed)
//   },
//   fileFilter: (req, file, callback) => {
//     if (file.mimetype !== 'video/mp4') {
//       return callback(new Error('Only MP4 files are allowed'));
//     }
//     callback(null, true);
//   },
// });

// // Single file upload with field name 'Student_Resume'
// export const uploadFile = (req, res, next) => {
//   //console.log("Multer file upload:", req.body) //to check the req.body
//   upload_pdf.single('Student_Resume')(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred (e.g. file size limit exceeded)
//       return res.status(400).json({ error: err.message });
//     } else if (err) {
//       // An unknown error occurred
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     // No error occurred, proceed to the next middleware/route handler
//     console.log('Resume upload successful');
//     next();
//   });
// };




// //For employer proposal submission and students resume and supplemental material submission
// // Single file upload with field name 'proposalVideo'
// export const uploadVideo= (req, res, next) => {
//   //console.log("Multer file upload:", req.body) //to check the req.body
//   upload_mp4.single('proposalVideo')(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred (e.g. file size limit exceeded)
//       return res.status(400).json({ error: err.message });
//     } else if (err) {
//       // An unknown error occurred
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     // No error occurred, proceed to the next middleware/route handler
//     if (req.file) {
//       // An .mp4 video file was uploaded
//       console.log('Video file uploaded:', req.file.originalname);
//     } else if (req.body.proposalVideo) {
//       // No file was uploaded, but a URL or other value is present in the proposalVideo field
//       console.log('ProposalVideo is a URL or non-file value:', req.body.proposalVideo);
//     } else {
//       // Neither a file nor a URL was provided
//       console.log('No video file uploaded and no URL provided.');
//     }
//     next();
//   });
// };

// export const uploadResume= (req, res, next) => {
//   //console.log("Multer file upload:", req.body) //to check the req.body
//   upload_mp4.single('proposalVideo')(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred (e.g. file size limit exceeded)
//       return res.status(400).json({ error: err.message });
//     } else if (err) {
//       // An unknown error occurred
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     // No error occurred, proceed to the next middleware/route handler
//     if (req.file) {
//       // An .mp4 video file was uploaded
//       console.log('Video file uploaded:', req.file.originalname);
//     } else if (req.body.proposalVideo) {
//       // No file was uploaded, but a URL or other value is present in the proposalVideo field
//       console.log('ProposalVideo is a URL or non-file value:', req.body.proposalVideo);
//     } else {
//       // Neither a file nor a URL was provided
//       console.log('No video file uploaded and no URL provided.');
//     }
//     next();
//   });
// };

// export const uploadSupplemental= (req, res, next) => {
//   //console.log("Multer file upload:", req.body) //to check the req.body
//   upload_mp4.single('proposalVideo')(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred (e.g. file size limit exceeded)
//       return res.status(400).json({ error: err.message });
//     } else if (err) {
//       // An unknown error occurred
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     // No error occurred, proceed to the next middleware/route handler
//     if (req.file) {
//       // An .mp4 video file was uploaded
//       console.log('Video file uploaded:', req.file.originalname);
//     } else if (req.body.proposalVideo) {
//       // No file was uploaded, but a URL or other value is present in the proposalVideo field
//       console.log('ProposalVideo is a URL or non-file value:', req.body.proposalVideo);
//     } else {
//       // Neither a file nor a URL was provided
//       console.log('No video file uploaded and no URL provided.');
//     }
//     next();
//   });
// };


import multer from 'multer';

// Define storage for uploaded files in memory (adjust if needed to disk storage)
const storage = multer.memoryStorage();

// Middleware functions for handling different uploads

// Profile Resume upload
export const uploadProfileResume = (req, res) => {
  uploadPdf.single('Student_Resume')(req, res, (err) => {
    if (err) {
      return reject(err); // Reject the promise with the error
    }
    // Store the uploaded resume file in req.resumeFile
    req.profileresumeFile = req.file;
    console.log('profileresumeFile successfully created!')
    resolve();
  });
};
// resume file upload
export const uploadResume = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log(req.body);
    console.log('checking if i am at uploadResume');
    uploadPdf.single('resumeUpload')(req, res, (err) => {
      if (err) {
        console.error('Multer Error:', err);
        return reject(err); // Reject the promise with the error
      }
      // Store the uploaded resume file in req.resumeFile
      req.resumeFile = req.file;
      console.log('Resume file successfully created!');
      resolve(); // Resolve the promise on success 
    });
  });
};

const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // Limit resume PDF size to 1MB
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      return callback(new Error('Only PDF files are allowed for resumes.'));
    }
    callback(null, true);
  },
});




// Supplemental file upload
export const uploadSupplementalFile = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log(req.body);
    console.log('checking if i am at uploadsupplmental');
    uploadSupplemental.single('supplementalUpload')(req, res, (err) => {
      if (err) {
        return reject(err); // Reject the promise with the error
      }
      req.supplementalFile = req.file;
      console.log('Supplemental file successfully created!');
      resolve(); // Resolve the promise on success
    });
  });
};

const uploadSupplemental = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit supplemental file size to 10MB
  },
  fileFilter: (req, file, callback) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
      return callback(new Error('Only PDF or DOCX files are allowed for supplemental materials.'));
    }
    callback(null, true);
  },
});


//------------------------------------------------------------------


// Middleware to handle video file upload
export const uploadVideo = (req, res) => {
  return new Promise((resolve, reject) => {
    uploadMp4.single('proposalVideo')(req, res, (err) => {
      if (err) {
        return reject(err); // Reject the promise with the error
      }
      // Store the uploaded video file in req.proposalvideoFile
      req.proposalvideoFile = req.file;
      console.log(req.proposalvideoFile)
      console.log('Video file successfully created!');
      resolve(); // Resolve the promise on success
    });
  });
};

const uploadMp4 = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limit video file size to 50MB
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'video/mp4') {
      return callback(new Error('Only MP4 video files are allowed.'));
    }
    callback(null, true);
  },
});


// Helper function to handle errors and log success // not to be used to prevent multiple multiple error response
// const handleMulterError = (err, res, errorMessage) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred (e.g., file size limit exceeded)
//     return res.status(400).json({ error: err.message });
//   } else if (err) {
//     // An unknown error occurred
//     return res.status(500).json({ error: 'Internal server error' });
//   }
//   console.log(errorMessage);
// };

// need to optimize the code later