import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../index.js";
import axios from "axios";
import GoogleLogin from "../components/GoogleLogin.jsx";
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user= await registerUser({
        username,
        email,
        password,
        profilePic:avatar,
      });
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  
  
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-white">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-white"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Dev"
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="john123@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
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
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
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
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md font-bold bg-slate-700 px-3 py-1.5 text-sm  leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
            <div>

            </div>
          </form>
          <h1 className='text-center'>Or</h1>
          <GoogleLogin/>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account? {" "}
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
