import React, { useEffect, useState } from 'react';
import { countFollowers, countFollowing, getPostbyuserid, getUserById } from '../index.js';
import { Link, useParams } from 'react-router-dom';
import profile from "/profile.png";

function Profile() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState({ countfollowers: 0, countfollowing: 0 });
    const { id } = useParams();

    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                const post = await getPostbyuserid(id);
                const user = await getUserById(id);
                setPosts(post);
                setUser(user);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPostsData();
    }, [id]);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const countfollowers = await countFollowers(id);
                const countfollowing = await countFollowing(id);
                setCount({ countfollowers, countfollowing });
            } catch (error) {
                console.error("Failed to fetch counts:", error);
            }
        };

        fetchCounts();
    }, [id]);
    return (
        <div className='flex flex-col items-center w-full  bg-[#F4F2EE]'>
            <div className=' w-full sm:w-2/3 xl:w-1/2 mx-auto '>
                {/* Profile Header */}
                <div className='flex flex-col gap-4 md:flex-row items-center justify-center p-6 border-b  border-gray-500'>
                    <div className='flex-shrink-0 flex flex-col justify-center'>
                        <div className='w-36 h-36 md:w-40 md:h-40 lg:w-56 lg:h-56  '>
                            <img
                                src={user?.profilePicture || profile}
                                alt="profile"
                                className='w-full h-full rounded-full object-cover border-2 border-gray-300'
                            />
                        </div>
                        <div>
                            <h1 className='text-2xl font-semibold text-center'>{user?.username}</h1>
                            <h2 className='text-md text-gray-600  text-center'>{user?.email}</h2>
                        </div>
                    </div>
                    <div className='flex-grow md:mt-0 text-center md:text-left  flex flex-col gap-4 items-start md:items-center'>

                        <div>
                        <h1 className=' text-xl text-gray-700'>
                            {user?.bio}
                        </h1>
                            <span>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam fuga nemo recusandae nulla nobis impedit excepturi soluta cupiditate ea molestias.
                            </span>
                        </div>
                        <div className='flex flex-row gap-4 w-full justify-center md:justify-start'>
                            <Link to={`/follows/followers/${user?._id}`}>
                                <button className='btn btn-info'>{count.countfollowers} followers</button>
                            </Link>
                            <Link to={`/follows/following/${user?._id}`}>
                                <button className='btn btn-accent'>{count.countfollowing} following</button>
                            </Link>
                            <Link to={`/chat/${user?._id}`}>
                                <button className='btn btn-warning'>{count.countfollowing} Chat</button>
                            </Link>
                        </div>
                        

                    </div>
                </div>
                {/* Posts Grid */}
                <div className='p-6'>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3  gap-2 md:gap-4">
                        {posts.length > 0 ? posts.map((post) => (
                            <div key={post._id} className='relative overflow-hidden rounded-lg'>
                                <figure className='relative aspect-w-1 aspect-h-1'>
                                    <img
                                        src={post.post_image}
                                        alt="post image"
                                        className='object-cover w-full h-full'
                                    />
                                </figure>
                            </div>
                        )) : <h1 className='text-xl text-center col-span-full'>User doesn't have any posts yet</h1>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
