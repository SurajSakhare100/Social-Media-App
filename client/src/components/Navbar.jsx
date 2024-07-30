import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, logout } from "../app/features/user/userSlice.js";
import Profile from "/profile.png";
import navLogo from '../../public/nav-logo.webp';

function Navbar() {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user?.data.data);
    const logoutUser = async () => {
        const resultAction = await dispatch(logout());
        if (logout.fulfilled.match(resultAction)) {
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          const data=  await dispatch(fetchCurrentUser());
        
        };
        fetchData();
    }, [dispatch]);
    return (
        <div className="navbar sticky top-0 z-10 h-16 w-full md:h-20 px-10 bg-white">
            <div className="w-full h-full flex justify-between">
                <Link to="/">
                    <img src={navLogo} alt="nav-logo" className="w-10 md:w-12" />
                </Link>
                <div className="flex justify-between md:gap-10">
                    <div className="navbar-start flex items-center">
                        <div className="md:flex md:ml-4 md:w-80 w-60">
                            <div className="w-full relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className={`input ${isSearchVisible ? '' : 'hidden'} md:block w-full md:w-80 h-8 md:h-10 border-1 border-black`}
                                />
                                <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setIsSearchVisible(!isSearchVisible)} />
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end flex items-center gap-4">
                        <button className="btn btn-ghost btn-circle hidden md:block">
                            <Link to={`/mychat/${user?._id}`} className="indicator">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="badge badge-xs badge-primary indicator-item"></span>
                            </Link>
                        </button>
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User Avatar"
                                        src={user ? user.profilePicture : Profile}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                {user ? (
                                    <>
                                        <li>
                                            <Link to={`/login`}>login</Link>
                                        </li>
                                        <li>
                                            <Link to={`/user/${user._id}`}>Profile</Link>
                                        </li>
                                        <li>
                                            <Link to={`/mychat/${user._id}`}>Chat</Link>
                                        </li>
                                        <li className="cursor-pointer" onClick={logoutUser}>
                                            <span>Logout</span>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <label className="swap swap-rotate hidden md:flex items-center">
                            <input type="checkbox" className="hidden" />
                            <svg
                                className="swap-off h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>
                            <svg
                                className="swap-on h-6 w-6 fill-current text-gray-900 dark:text-gray-200"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
