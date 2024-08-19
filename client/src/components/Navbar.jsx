import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Profile from "/profile.png";
import navLogo from '../../public/nav-logo.webp';
import { getCurrentUser ,logoutUser} from "../index.js";
import ThemeToggle from "./ThemeToggle.jsx";

function Navbar() {
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const [user,setUser]=useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                console.log(userData)
                if(userData.length==0){
                    setUser(null);
                }
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user or posts:', error);
            }
        };

        fetchUser();
    }, []);
    const logoutUserBtn = async () => {
        try {
            const data =await logoutUser();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    return (
        <div className="fixed top-0 z-10 w-full h-16 md:h-20 px-4 md:px-10 bg-white  shadow-md dark:border-gray-50 border-1 border-b dark:bg-black dark:text-white">
        <div className="w-full h-full flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
                <Link to="/">
                    <img
                        src={navLogo}
                        alt="nav-logo"
                        className="h-8 md:h-12 object-contain"
                    />
                </Link>
            </div>
            
            {/* Search Bar and Other Actions */}
            <div className="flex items-center justify-between md:gap-10">
                {/* Search Input */}
                
                
                {/* Navigation Buttons */}
                <div className="flex items-center gap-4">
                <div className="relative flex items-center flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search"
                        className={`input ${isSearchVisible ? 'block' : 'hidden'} w-56 md:w-80 h-8 md:h-10 border border-black rounded-md pl-2 `}
                    />
                    <FaSearch
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                    />
                </div>
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
                    
                    {/* User Avatar and Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                                <img
                                    alt="User Avatar"
                                    src={user ? user.profilePicture : Profile}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            {user ? (
                                <>
                                    <li><Link to={`/user/${user._id}`}>Profile</Link></li>
                                    <li><Link to={`/mychat/${user._id}`}>Chat</Link></li>
                                    <li className="cursor-pointer" onClick={logoutUserBtn}><span>Logout</span></li>
                                </>
                            ) : (
                                <li><Link to="/login">Login</Link></li>
                            )}
                        </ul>
                    </div>
                    
                    {/* Dark Mode Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </div>
    </div>
    
    );
}

export default Navbar;
