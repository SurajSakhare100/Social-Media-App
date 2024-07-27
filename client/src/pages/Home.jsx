import React from 'react';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Suggestion from '../components/Suggestion';
import { useSelector } from 'react-redux';
import Profile from "/profile.png";
import { Link } from 'react-router-dom';

function Home() {
    const user = useSelector((state) => state.user.userDetails);
    console.log(user)
    return (
        <div className='flex flex-col md:flex-row pt-6 px-4 md:px-20 gap-6 bg-[#F4F2EE]'>

            <div className='hidden md:block w-full md:w-1/4 '>
                <Link to={`user/${user?._id}`} className='flex flex-col gap-4 md:flex-row items-center justify-center bg-white p-6 border-b rounded-xl border-gray-200 shadow-md'>
                    <div className='flex-shrink-0 flex flex-col justify-center'>
                        <div className='w-36 h-36 md:w-40 md:h-40 lg:w-56 lg:h-56  '>
                            <img
                                src={user?.profilePicture || Profile}
                                alt="profile"
                                className='w-full h-full rounded-full object-cover border-2 border-gray-300'
                            />
                        </div>
                        <div>
                            <h1 className='text-2xl font-semibold text-center'>{user?.username}</h1>
                            <h1 className='text-lg text-gray-600  text-center'>{user?.bio}</h1>
                        </div>
                    </div>
                </Link>
            </div>
            <div className='flex-1 md:px-20'>
                <div className='mb-6'>
                    <CreatePost />
                </div>
                <Post />
            </div>


            <div className='hidden md:block w-full md:w-1/4'>
                <Suggestion />
            </div>
        </div>
    );
}

export default Home;
