

/**
 * Sets up a route with common middleware and a specified handler.
 * @param {Object} router - The Express router instance.
 * @param {string} path - The route path.
 * @param {Function} handler - The final handler function for the route.
 */

import { authenticateToken } from '../authentication.js';
import { uploadProfileResume, uploadResume, uploadSupplementalFile, uploadVideo} from '../multer_uploadFile.js';
import { fileuploads3, proposalvideoUploads3, resumeUploads3, supplementalUploads3 } from '../s3_fileHandling.js';

export const setupRoute = (router, path, handler) => {
    router.post(
      path,
      authenticateToken,
  
      // Multer upload middleware
      async (req, res, next) => {
        const userType = req.headers['usertype']; // Get user type from request body
        console.log(userType);
  
        try {
          let errorOccurred = false;
  
          const handleError = (err) => {
            if (!res.headersSent && !errorOccurred) {
              errorOccurred = true;
              return res.status(400).json({ error: err.message });
            }
          };
  
          if (userType === 'Student') {
            console.log('i am here'); // Remove this for testing only
            await uploadResume(req, res).catch(handleError);
            // await uploadSupplementalFile(req, res).catch(handleError);
          } else if (userType === 'Employer') {
            //await uploadVideo(req, res).catch(handleError);
            await uploadSupplementalFile(req,res).catch(handleError);
            // console.log('Here is proposal Video file:', req.proposalvideoFile);
          }
  
          if (!errorOccurred) {
            next();
          }
        } catch (err) {
          console.error('Error during file upload:', err);
          if (!res.headersSent) {
            return res.status(400).json({ error: err.message });
          }
        }
      },
  
      // S3 Upload middleware
      async (req, res, next) => {
        const userType = req.headers['usertype']; // Get user type from request body
        console.log(userType);
  
        try {
          let errorOccurred = false;
  
          const handleError = (err) => {
            if (!res.headersSent && !errorOccurred) {
              errorOccurred = true;
              return res.status(400).json({ error: err.message });
            }
          };
  
          if (userType === 'Student') {
            await resumeUploads3(req, res).catch(handleError);
            // await supplementalUploads3(req, res).catch(handleError);
          } else if (userType === 'Employer') {
            //await proposalvideoUploads3(req, res).catch(handleError);
            await supplementalUploads3(req,res).catch(handleError);
          }
  
          if (!errorOccurred) {
            next();
          }
        } catch (err) {
          console.error('Error during S3 upload:', err);
          if (!res.headersSent) {
            return res.status(500).json({ error: 'Failed to upload files to S3' });
          }
        }
      },
  
      // Final handler
      (req, res) => {
        console.log(`POST ${path}`);
        handler(req, res); // Call the appropriate handler function
      }
    );
  };