import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { Login } from './components/LoginPage';
import { RegistrationForm } from './components/RegistrationForm';
import { Dashboard } from './components/Dashboard';
import { AuthRoute } from './components/PrivateRoute';
import { ProfileCard } from './components/Profile_Page/ProfileCard';
import { ProjectRequestForm } from './components/ProjectRequestForm';
import { MainProjectComponent } from './components/ProjectComponent/MainProjectComponent';
import EmailVerification from './components/EmailVerification';

function App() {
  return (
    <Router>
      {/* Global styles to remove default margin/padding */}
      <GlobalStyles
        styles={{
          body: { margin: 0, padding: 0, height: '100%', overflowX: 'hidden' },
          html: { margin: 0, padding: 0, height: '100%' },
        }}
      />
      <CssBaseline />

      <Routes>
        <Route path="/" element={<Login />} /> {/* Default to Login */}
        <Route path="/login" element={<Login />} /> {/* Default to Login */}
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/verifyEmail" element={<EmailVerification />} />
        <Route element={<AuthRoute />}>
          {/* Nested protected routes under AuthRoute */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project-form" element={<ProjectRequestForm />} />
          <Route path="/profile" element={<ProfileCard />} />
          <Route path="/projects" element={<MainProjectComponent />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;