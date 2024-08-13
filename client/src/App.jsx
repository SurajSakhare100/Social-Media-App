// index.js
import React from 'react';
import Navbar from './components/Navbar.jsx';
import { Outlet } from 'react-router-dom';

export default function App(
) {
  return (

    <div className='w-full h-screen dark:bg-black'>
      <Navbar />
      <Outlet />
    </div>
  )

}