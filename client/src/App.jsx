import React from 'react';
import Navbar from './components/Navbar.jsx';
import { Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className='w-full h-screen text-black dark:text-white dark:bg-black'>
        <Navbar />
        <Outlet />
      </div>
    </GoogleOAuthProvider>
  );
}
