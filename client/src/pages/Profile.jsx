import React, { useEffect, useState } from 'react';
import { countFollowers, countFollowing, getPostbyuserid, getUserById } from '../index.js';
import { Link, useParams } from 'react-router-dom';
import profile from "/profile.png";

function Profile() {

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [count,setCount]= useState({countfollowers: 0, countfollowing: 0});
    const { id } = useParams();
    
    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                const data = await getPostbyuserid(id);
                const user = await getUserById(id);
                setPosts(data)
                setUser(user)
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPostsData();
    }, [id]); 
    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                const countfollowers = await countFollowers(id);
                const countfollowing = await countFollowing(id);
                setCount({
                    countfollowers,
                    countfollowing
                })
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPostsData();
    }, [id]); 

    return (
        <div className='px-20 mt-10'>
            <div className='w-full md:w-3/4 mx-auto'>
                <div className='md:py-10 flex gap-6 items-center'>
                    <div>
                        <div className='avatar w-56 h-56'>
                            <img 
                                src={user?.profilePicture || profile} 
                                alt="profile" 
                                className='w-full h-full rounded-full' 
                            />
                        </div>
                        <div>
                            <h1 className='text-2xl'>{user?.username}</h1>
                            <h2 className='text-lg'>{user?.email}</h2>
                        </div>
                    </div>
                    <div>
                        <div className='flex gap-4'>
                            <Link to={`/follows/followers/${user?._id}`}><button className='btn'>{count.countfollowers} followers</button></Link>
                            <Link to={`/follows/following/${user?._id}`}><button className='btn'>{count.countfollowing} following</button></Link>
                        </div>
                        <h1 className='w-120'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad sapiente neque nesciunt repellat id mollitia facilis fugiat, eaque dolore commodi nam. Modi recusandae animi voluptate qui quia ratione, illo dolor?
                        </h1>
                        <Link to={`/chat/${user?._id}`}><button className='btn btn-info'>Chat with me</button></Link>
                    </div>
                </div>
                <div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
                        {posts.length > 0 ? posts.map((post) => (
                            <div key={post._id}>
                                <figure className='aspect-square'>
                                    <img
                                        src={post.post_image}
                                        alt="post image"
                                        className='rounded-lg w-full h-full' 
                                    />
                                </figure>
                            </div>
                        )):<h1 className='text-3xl text-center '>User doesn't have any posts yet</h1>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
