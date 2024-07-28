// index.js
import React from 'react';
import { store } from './app/store/store.js';
import Navbar from './components/Navbar.jsx';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';

export default function App(
) {
  return (

    <Provider store={store}>
      <Navbar />
      <Outlet />
    </Provider>
  )

}