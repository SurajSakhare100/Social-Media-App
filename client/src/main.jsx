import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import Profile from './pages/Profile.jsx';
import Follows from './pages/Follows.jsx';
import ChatBox from './pages/ChatBox.jsx';
import ChatDashBoard from './pages/ChatDashBoard.jsx';
import GoogleLogin from './components/GoogleLogin.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import EmailVerificationForm from './pages/EmailVerificationForm.jsx';

const GoogleAuthProvider=()=>{
  return(
<GoogleOAuthProvider clientId='228681980-jf2buslu6k39bon3ca4e4absmb103592.apps.googleusercontent.com'>
  <Register/>
</GoogleOAuthProvider>

  )
}
const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <GoogleAuthProvider />,
      },
      {
        path: '/chat/:receiverId',
        element: <ChatBox />,
      },
      {
        path: '/mychat/:user',
        element: <ChatDashBoard />,
      },
      {
        path: '/updatepassword',
        element: <UpdatePassword />,
      },
      {
        path: '/verify/email',
        element: <EmailVerificationForm />,
      },
      {
        path:'/user/:id',
        element:<Profile/>
      },
      {
        path:'/follows/:type/:id',
        element:<Follows/>
      }

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
