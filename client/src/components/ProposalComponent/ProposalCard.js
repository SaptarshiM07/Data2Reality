import React, { useState } from 'react';
import {
  Button, Card, CardContent, IconButton, Typography, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControlLabel, Checkbox
} from '@mui/material';
import { Note as NoteIcon } from '@mui/icons-material';
import { sns, snsTopicArn } from '../../awsConfig';
import "../../css/ProposalCard.css";



const endpointpath = process.env.REACT_APP_API_BASE_URL;


const ProposalCard = ({ proposal, proposals, fetchProposals }) => {
  const [expanded, setExpanded] = useState(false);
  const [openDialog, setDialog] = useState(false);
  const [actionType, setActionType] = useState(null);  // To track Accept/Reject action
  const [acceptAndRejectOthers, setAcceptAndRejectOthers] = useState(false);  // For "Accept & Reject Others" checkbox

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAccept = () => {
    setActionType('accept');
    setDialog(true);
  };

  const handleReject = () => {
    setActionType('reject');
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
    setAcceptAndRejectOthers(false); // Reset checkbox state
  };

  const APPLICANT_EMAIL = proposal.applicantEmail

  const sendNotification = async (APPLICANT_EMAIL, status) => {
    try {
        // Step 1: Check if the email is already subscribed
        const listParams = {
            TopicArn: snsTopicArn,
        };

        const subscriptions = await sns.listSubscriptionsByTopic(listParams).promise();

        const isSubscribed = subscriptions.Subscriptions.some(subscription => 
            subscription.Endpoint === APPLICANT_EMAIL && subscription.Protocol === 'email'
        );

        // Step 2: Subscribe if not already subscribed
        if (!isSubscribed) {
            const subscribeParams = {
                Protocol: 'email', 
                TopicArn: snsTopicArn,
                Endpoint: APPLICANT_EMAIL
            };

            const subscriptionResponse = await sns.subscribe(subscribeParams).promise();
            console.log('Subscription created:', subscriptionResponse.SubscriptionArn);
        } else {
            console.log('Email is already subscribed.');
        }

        // Step 3: Publish the notification
        const publishParams = {
            Message: `Your proposal has been ${status} for the ${proposal.requestTitle}.`, // change the body later
            Subject: `Proposal ${status}`,
            TopicArn: snsTopicArn,  // Use your SNS topic ARN
            MessageAttributes: {
                email: {
                    DataType: 'String',
                    StringValue: APPLICANT_EMAIL,
                }
            }
        };

        const publishResponse = await sns.publish(publishParams).promise();
        console.log(`Notification sent: ${status}`, publishResponse);
    } catch (err) {
        console.error('Error sending SNS notification:', err);
    }
};

  const handleConfirmAction = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found in localStorage.");
        return;
      }

      if (actionType === 'reject') {
        // Reject the current proposal
        await fetch(`${endpointpath}/api/applicationStatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': token,
          },
          body: JSON.stringify({
            proposalID: proposal.proposalID,
            applicationStatus: 'Rejected',
          }),
        });

        sendNotification(APPLICANT_EMAIL, 'Rejected');
      }

      if (actionType === 'accept') {
        // Accept the current proposal
        await fetch(`${endpointpath}/api/applicationStatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': token,
          },
          body: JSON.stringify({
            proposalID: proposal.proposalID,
            applicationStatus: 'Accepted',
          }),
        });

        sendNotification(APPLICANT_EMAIL, 'Accepted');

        if (acceptAndRejectOthers) {
          // Reject all other proposals if "Accept & Reject Others" is checked
          const rejectOthers = proposals
            .filter((p) => p.proposalID !== proposal.proposalID && p.applicationStatus === 'In Review')
            .map((otherProposal) => {
              return fetch(`${endpointpath}/api/applicationStatus`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': token,
                },
                body: JSON.stringify({
                  proposalID: otherProposal.proposalID,
                  applicationStatus: 'Rejected',
                }),
              });
            });

          await Promise.all(rejectOthers);

          // Send notifications to all rejected applicants
          proposals.forEach((p) => {
            if (p.proposalID !== proposal.proposalID && p.applicationStatus === 'In Review') {
              sendNotification(p.applicantEmail, 'Rejected');
            }
          });
        }
      }

      // Fetch updated proposals after actions
      fetchProposals(proposal.projectID);

      closeDialog();
    } catch (err) {
      console.error('Error updating proposal status:', err);
    }
  };

  return (
    <>
      <Card className="proposal-card">
        <CardContent onClick={toggleExpand} className="proposal-card-header">
          <Typography variant="h6">{proposal.proposalSummary}</Typography>

          {/* Icon for resume link */}
          <IconButton
            className="resume-icon"
            href={proposal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevent expanding when clicking the icon
          >
            <NoteIcon />
          </IconButton>
        </CardContent>

        {/* Show expanded content if expanded */}
        {expanded && (
          <CardContent className="proposal-card-body">
            <Typography variant="h6">{proposal.proposalTitle}</Typography>
            <Typography variant="body1">Submitted By: {proposal.applicantName}</Typography>
            <Typography variant="body2">Summary: {proposal.summary}</Typography>
            <Typography variant="body2">Experience: {proposal.experience}</Typography>

            {/* Accept/Reject Buttons */}
            <div className="proposal-action-buttons">
            {proposal.applicationStatus === 'In Review' ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleAccept}>
                      Accept
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleReject}>
                      Reject
                    </Button>
                  </>
                        ) : proposal.applicationStatus === 'Accepted' ? (
                          <span style={{ color: 'green' }}>Proposal Accepted</span>
                        ) : (
                          <span style={{ color: 'red' }}>Proposal Rejected</span>
                        )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dialog for Accept/Reject Confirmation */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>
          {actionType === 'accept' ? 'Confirm Proposal Acceptance' : 'Confirm Proposal Rejection'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'accept'
              ? 'Are you sure you want to accept this proposal? You can also choose to reject all other proposals for this project.'
              : 'Are you sure you want to reject this proposal?'}
          </DialogContentText>

          {actionType === 'accept' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptAndRejectOthers}
                  onChange={(e) => setAcceptAndRejectOthers(e.target.checked)}
                  color="primary"
                />
              }
              label="Accept & Reject All Others"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            {actionType === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProposalCard;