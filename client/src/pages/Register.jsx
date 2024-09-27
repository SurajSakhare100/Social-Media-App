import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../index.js";
import axios from "axios";
import GoogleLogin from "../components/GoogleLogin.jsx";
import { handleSuccessPopup } from "../PopUp.js";

function Register() {
  const [username, setUsername] = useState('');
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [locationParam, setLocationParam] = useState(''); // New state for location
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromVerification = queryParams.get('email') ? window.atob(queryParams.get('email')) : '';
  // Pre-fill the email if it's provided via the query parameter
  useEffect(() => {
     if(emailFromVerification===""){
     setTimeout(() => {
      navigate('/verify/email');
     }, 200);
     }
      if (emailFromVerification) {
          setEmail(emailFromVerification);
      }
  }, [emailFromVerification]);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register user with additional details
      const formData = new FormData();
      formData.append("email", email);  
      formData.append("username", username);
      formData.append("profileName", profileName);
      formData.append("password", password);
      formData.append("profilePicture", avatar);
      formData.append("location", locationParam); // Add location to form data
      
      await registerUser(formData);
      handleSuccessPopup("you registerd succsefully")

      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-black dark:text-white">
            Register
          </h2>
        </div>

        <div className="text-black sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label
                htmlFor="profileName"
                className="block text-sm font-medium leading-6 dark:text-white"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="profileName"
                  name="profileName"
                  type="text"
                  autoComplete="profileName"
                  required
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="johndev123"
                  className="pl-2 block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 dark:text-white"
              >
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Dev"
                  className="pl-2 block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 dark:text-white"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={emailFromVerification}
                  required
                  placeholder="john123@gmail.com"
                  className="w-full p-2 mb-4  rounded focus:outline-none focus:ring-2 py-1.5  bg-gray-100  border-black cursor-not-allowed
                  "
                  disabled={true} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 dark:text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to={"/updatepassword"}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="******"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium leading-6 dark:text-white"
              >
                Add Avatar
              </label>
              <div className="mt-2">
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md font-bold dark:bg-white dark:hover:bg-slate-500 bg-slate-700 px-3 py-1.5 text-sm leading-6 dark:text-black text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
          <h1 className="text-lg text-center mb-2 font-semibold">Or</h1>
          <GoogleLogin />
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
