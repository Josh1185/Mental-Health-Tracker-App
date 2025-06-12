import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleSuccess() {
  // This page is shown when the user successfully authenticates with Google.
  // It will redirect to the dashboard after a short delay.

  const navigate = useNavigate();

  // Check for the token in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      console.log('Google authentication successful. Token:', token);

      // This will be added later when the dashboard is implemented

      /* 
      localStorage.setItem('authToken', token);
      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      */

    } else {
      // If no token is found, redirect to the login page
      navigate('/login');
    }
  }, [navigate]);

  return (
    
    <p>Authenticating with Google...</p>
  );
}