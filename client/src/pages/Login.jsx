import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../app/slices/userSlice.js';
import GoogleLogin from '../components/GoogleLogin.jsx';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Local state for error messages
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch(null)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        try {
            dispatch(loginUser({ email, password }))
            if (!user.isAuthenticated) {
                navigate('/')
            }
            navigate('/')
        } catch (error) {
            setError('An error occurred during login.'); // Set error message for API errors
            console.error('Error occurred during login:', error);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-5xl font-bold leading-9 tracking-tight text-black dark:text-white">
                    Log In
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-600 text-center">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john123@gmail.com"
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                Password
                            </label>
                            <div className="text-sm">
                                <Link to="/updatepassword" className="font-semibold text-indigo-600 hover:text-indigo-500">
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
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Log In
                        </button>
                    </div>

                </form>
                <h1 className="text-lg text-center mb-2 font-semibold">Or</h1>
                <GoogleLogin />
                <p className="mt-10 text-center text-sm text-gray-500">
                    Not Registered yet?{' '}
                    <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
