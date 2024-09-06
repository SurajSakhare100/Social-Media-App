import React, { useEffect, useState } from 'react';
import { countFollowers, countFollowing, getPostByUserId, getUserById } from '../index.js';
import { Link, useParams } from 'react-router-dom';
import profile from "/profile.png";
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Profile() {
    const user=useSelector((state)=>state.user);
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState({ countfollowers: 0, countfollowing: 0 });
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    console.log(user)

    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                const post = await getPostByUserId(id);
                setPosts(post);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setLoading(false);
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

    if (loading) {
        return <div className='text-center text-xl'>Loading...</div>;
    }

    return (
        <div className='w-full h-full overflow-y-auto flex flex-col items-center  pt-20 md:pt-24 bg-[#F4F2EE]'>
            <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Profile Header */}
                <div className='mb-8'>
                    <div className='flex flex-row items-center justify-between gap-2 md:gap-6'>
                        <div className='flex-shrink-0 pt-4 md:pt-0 w-fit self-center'>
                            <img
                                src={user?.profilePicture || profile}
                                alt={`${user?.username}'s profile picture`}
                                className='w-14 h-14 md:w-32 md:h-32 object-cover rounded-full border-2 border-gray-300'
                            />
                        </div>
                        <div className='flex md:flex-row mt-4 md:mt-0 gap-2 md:gap-4 items-center justify-between'>
                            <Link to={`/follows/followers/${user?._id}`}>
                                <button className='btn btn-info'>{count.countfollowers} followers</button>
                            </Link>
                            <Link to={`/follows/following/${user?._id}`}>
                                <button className='btn btn-warning'>{count.countfollowing} following</button>
                            </Link>
                            <Link to={`/chat/${user?._id}`}>
                                <button className='btn btn-accent'>Chat</button>
                            </Link>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className='md:text-left'>
                            <h1 className='text-2xl font-semibold'>{user?.username}</h1>
                            <h2 className='text-md text-gray-600'>{user?.email}</h2>
                            {user?.location && <h3 className='text-sm text-gray-500'>{user.location}</h3>}
                            {user?.website && (
                                <a href={user.website} className='text-blue-500' target='_blank' rel='noopener noreferrer'>
                                    {user.website}
                                </a>
                            )}
                        </div>
                        <div className='mt-4 md:text-left'>
                            <p className='text-lg text-gray-700'>{user?.bio}</p>
                            <p className='text-gray-600 mt-2'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam fuga nemo recusandae nulla nobis impedit excepturi soluta cupiditate ea molestias.
                            </p>
                        </div>
                    </div>
                    <div className='w-full mt-2'>
                        <button className='w-full btn btn-active text-xl'>Edit Profile <span className='pt-0.5'><FaEdit/></span></button>
                        
                    </div>
                </div>


                {/* Posts Grid */}
                <div className='pb-20'>
                    <h1 className='text-center text-xl md:text-3xl font-semibold'>User Post's</h1>
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-3 mt-4 ">
                            {posts.map((post) => (
                                <div key={post._id} className='relative overflow-hidden'>
                                    <figure className='relative aspect-square'>
                                        <img
                                            src={post.post_image}
                                            alt={`${user?.username}'s post`}
                                            className='object-cover w-full h-full'
                                        />
                                    </figure>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center'>
                            <h1 className='text-xl'>User doesn't have any posts yet</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
