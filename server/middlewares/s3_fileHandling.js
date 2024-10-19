import { s3 } from '../awsConfig.js';
import fs from 'fs';

/*for s3 upload next middle ware*/ //need to make this consistent with other codes
export const fileuploads3 = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileName = file.originalname;
  const fileContent = file.buffer;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `profile_resumes/${fileName}`,
    Body: fileContent,
    ContentType: 'application/pdf',
    ACL: 'public-read'
  };

  try {
    // Check if the bucket exists
    const bucketExists = await s3.headBucket({ Bucket: params.Bucket }).promise().then(() => true).catch(() => false);

    // Create the bucket if it does not exist
    if (!bucketExists) {
      await s3.createBucket({ Bucket: params.Bucket }).promise();
      console.log('Bucket created:', params.Bucket);
    }

    const data = await s3.upload(params).promise();
    console.log('File uploaded to S3:', data.Location);

    // Clean up the temporary file stored by multer
    if (file.path) {
      fs.unlinkSync(file.path); // Delete the temporary file
    }

    // Add the S3 URL to the request object to pass it to subsequent middleware or handlers
    req.fileUrl = data.Location;

    console.log('S3 file upload successful');
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

//VideoUploadtoS3
/*for s3 upload next middle ware*/
export const proposalvideoUploads3 = async (req, res) => {
  return new Promise(async (resolve, reject) => {
        const file = req.proposalvideoFile;
        if (!file) {
          console.log('No video uploaded or proposalVideo is a URL.');
          
          // Check if there's an existing URL in the form data
          if (req.body.proposalVideo) {
            req.fileUrl = req.body.proposalVideo; // Use the provided video URL
            console.log('Using provided video URL:', req.fileUrl);
          } else {
            req.fileUrl = 'No Proposal Video Available'; // Default message
            console.log(req.fileUrl);
          }

          return resolve(); // Skip the upload step
        }

        const fileName = file.originalname;
        const fileContent = file.buffer;

        const { requesterUIN, requesterName, requestTitle } = req.body;
        //const timestamp = Date.now();
        

        //const targetFolder = req.path.includes('/submit') ? 'submitted' : 'draft';
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `project_proposal_videos/${requesterUIN}_${requesterName}/${requestTitle}/${fileName}`,
          Body: fileContent,
          ContentType: 'video/mp4',
          ACL: 'public-read'
        };

        try {
          // Check if the bucket exists
          const bucketExists = await s3.headBucket({ Bucket: params.Bucket }).promise().then(() => true).catch(() => false);

          // Create the bucket if it does not exist
          if (!bucketExists) {
            await s3.createBucket({ Bucket: params.Bucket }).promise();
            console.log('Bucket created:', params.Bucket);
          }

          const data = await s3.upload(params).promise();
          console.log('Video uploaded to S3:', data.Location);

          // Clean up the temporary file stored by multer
          if (file.path) {
            fs.unlinkSync(file.path); // Delete the temporary file
          }

          // Add the S3 URL to the request object to pass it to subsequent middleware or handlers
          req.proposalvideofileUrl = data.Location;

          console.log('S3 Video upload successful');
          resolve(); // Pass control to the next middleware or route handler
        } catch (error) {
          console.error('Error uploading Video to S3:', error);
          reject(new Error('Error uploading proposal Video file to S3.'));
        }
      });

};


//ResumeUploadtoS3
/*for s3 upload next middle ware*/
export const resumeUploads3 = async (req, res) => {
  return new Promise(async (resolve, reject) => {
      const file = req.resumeFile; //created in the multer middleware
      if (!file) {
        console.log('No resume uploaded');
        
        // Check if there's an existing URL in the form data
        if (req.body.resumeUpload) {
          req.fileUrl = req.body.resumeUpload; // Use the provided video URL
          console.log('Using provided resume URL:', req.fileUrl);
        } else {
          req.fileUrl = 'No Resume Available'; // Default message
          console.log(req.fileUrl);
        }

        return resolve(); // Skip the upload step
      }

      const fileName = file.originalname;
      const fileContent = file.buffer;

      const { applicantUIN, applicantName, requestTitle, requesterUIN, requesterName } = req.body;
      //const timestamp = Date.now();


      //const targetFolder = req.path.includes('/submit') ? 'submitted' : 'draft';

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `applications/${requestTitle}_${requesterUIN}_${requesterName}/${applicantUIN}_${applicantName}/resumes/${fileName}`,
        Body: fileContent,
        ContentType: 'application/pdf',
        ACL: 'public-read'
      };

      try {
        // Check if the bucket exists
        const bucketExists = await s3.headBucket({ Bucket: params.Bucket }).promise().then(() => true).catch(() => false);

        // Create the bucket if it does not exist
        if (!bucketExists) {
          await s3.createBucket({ Bucket: params.Bucket }).promise();
          console.log('Bucket created:', params.Bucket);
        }

        const data = await s3.upload(params).promise();
        console.log('Resume uploaded to S3:', data.Location);

        // Clean up the temporary file stored by multer
        if (file.path) {
          fs.unlinkSync(file.path); // Delete the temporary file
        }

        // Add the S3 URL to the request object to pass it to subsequent middleware or handlers
        req.resumefileUrl = data.Location; //changing the fileUrl name to resumefileUrl

        console.log('S3 Resume upload successful');
        resolve(); // Pass control to the next middleware or route handler
      } catch (error) {
        console.error('Error uploading Resume to S3:', error);
        reject(new Error('Error uploading Resume file to S3.'));
      }
  });
};


//SupplementalUploadtoS3
/*for s3 upload next middle ware*/
export const supplementalUploads3 = async (req, res) => {
  return new Promise(async (resolve, reject) => {

      const file = req.supplementalFile; //created in the multer middleware

      if (!file) {
        console.log('No supplemental file uploaded');
        
        // Check if there's an existing URL in the form data
        if (req.body.supplemntalUpload) {
          req.fileUrl = req.body.supplementalUpload; // Use the provided video URL
          console.log('Using provided supplemental file URL:', req.fileUrl);
        } else {
          req.fileUrl = 'No supplemental file Available'; // Default message
          console.log(req.fileUrl);
        }

        return resolve(); // Skip the upload step
      }

      
      const fileName = file.originalname;
      const fileContent = file.buffer;

      const { applicantUIN, applicantName, requestTitle, requesterUIN, requesterName } = req.body;
      //const timestamp = Date.now();


      const getContentType = (fileName) => {
        // Extract the file extension
        const ext = fileName.split('.').pop().toLowerCase();
      
        // Map extensions to MIME types
        const contentTypeMap = {
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
      
        return contentTypeMap[ext] || 'application/octet-stream'; // Default to a generic binary stream if unknown
      };
      
      //const targetFolder = req.path.includes('/submit') ? 'submitted' : 'draft';

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `applications/${requestTitle}_${requesterUIN}_${requesterName}/${applicantUIN}_${applicantName}/supplemental/${fileName}`,
        Body: fileContent,
        ContentType: getContentType(fileName),
        ACL: 'public-read'
      };

      try {
        // Check if the bucket exists
        const bucketExists = await s3.headBucket({ Bucket: params.Bucket }).promise().then(() => true).catch(() => false);

        // Create the bucket if it does not exist
        if (!bucketExists) {
          await s3.createBucket({ Bucket: params.Bucket }).promise();
          console.log('Bucket created:', params.Bucket);
        }

        const data = await s3.upload(params).promise();
        console.log('Supplemental File uploaded to S3:', data.Location);

        // Clean up the temporary file stored by multer
        if (file.path) {
          fs.unlinkSync(file.path); // Delete the temporary file
        }

        // Add the S3 URL to the request object to pass it to subsequent middleware or handlers
        req.supplementalfileUrl = data.Location; //changing the fileUrl name to resumefileUrl

        console.log('S3 Supplemental file upload successful');
        resolve(); // Pass control to the next middleware or route handler
      } catch (error) {
        console.error('Error uploading supplemental file to S3:', error);
        reject(new Error('Error uploading supplemental file to S3.'));
      }
    });
};