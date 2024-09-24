import React, { useEffect, useState } from 'react';
import CreatePost from '../components/CreatePost';
import Suggestion from '../components/Suggestion';
import Profile from "/profile.png";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostPage from './PostPage';
import AddStory from '../components/AddStory';

function Home() {
    const user = useSelector((state) => state.user);

    return (
        <div className='w-full h-full pt-20 pb-10 md:pt-24 overflow-y-auto flex flex-col md:flex-row  px-4 md:px-20 gap-6 bg-[#F4F2EE] dark:bg-black dark:text-white' >

            <div className='hidden md:block w-fit '>
                <Link to={`user/${user?._id}`} className='flex flex-col gap-4 md:flex-row items-center justify-center bg-white p-6 border-b rounded-xl border-gray-200 shadow-md'>
                    <div className='flex-shrink-0 flex flex-col justify-center items-center'>
                        <div className='w-36 h-36 md:w-40 md:h-40 lg:w-56 lg:h-56  '>
                            <img
                                src={user?.profilePicture || Profile}
                                alt="profile"
                                className='w-full h-full rounded-full object-cover border-2 border-gray-300'
                            />
                        </div>
                        <div>
                            <h1 className='text-2xl font-semibold text-center'>{user?.profileName}</h1>
                            <h1 className='text-lg text-gray-600  text-center'>{user?.bio}</h1>
                        </div>
                    </div>
                </Link>
            </div>

            <div className='flex-1 md:px-20'>
                <div className='my-4'>
                    <AddStory/>
                </div>
                <div className='mb-6'>
                    <CreatePost />
                </div>
                <PostPage />
            </div>


            <div className='hidden md:block w-full md:w-1/4'>
                <Suggestion />
            </div>
        </div>
    );
}

export default Home;
