import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import { Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DevNetAnimation from './components/DevNetAnimation.jsx';

export default function App() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const [animation, setAnimation] = useState(true)
  setTimeout(() => {
    setAnimation(false)
  }, 3000);
  return (
    <>
      {
        animation ? <DevNetAnimation /> :
          <GoogleOAuthProvider clientId={clientId}>
            <div className='w-full h-screen text-black dark:text-white dark:bg-black'>
              <Navbar />
              <Outlet />
            </div>
          </GoogleOAuthProvider>
      }
    </>

  );
}
