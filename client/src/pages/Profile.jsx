import React, { useEffect, useState } from 'react'
import { getPostbyuserid, getUserById } from '..'
import { useParams } from 'react-router-dom'
import profile from "/profile.png";
import { FaCommentAlt } from 'react-icons/fa';
import { AiFillLike } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
function Profile() {
    const [user, setUser] = useState('')
    const [posts, setPosts] = useState(null)
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserById(id);
            setUser(data)
        }
        fetchData()
    })
    useEffect(() => {
        const fetchData = async () => {
            const data = await getPostbyuserid(id);
            setPosts(data)
        }
        fetchData()
    },[])
    return (
        <div className='px-20 mt-10'>
            <div className='grid grid-cols-2'>
                <div> 
                <div className='avatar w-56 h-56 '>
                    <img src={user ? user.profilePicture : profile} alt="profile" className='w-full h-full rounded-full' />
                </div>
                <div>
                    <h1 className='text-2xl'>{user?.username}</h1>
                    <h2 className='text-lg'>{user?.email}</h2>
                </div>
                </div>
                <div>
                <div className=" w-full flex flex-wrap p-4">
                {
                    posts?.map((post) => ((
                        <div key={post._id} className='w-1/2 px-4'>
                            <div className='flex items-center w-full justify-between my-6'>
                                <div className='flex gap-4'>
                                    <Link className="w-16 h-16" to={`/user/${post.user._id}`} >
                                        <img
                                            alt="Tailwind CSS Navbar component"
                                            src={post.user.profilePicture}
                                            className='w-full h-full rounded-full'
                                        />


                                    </Link>
                                    <div>
                                        <h1 className='text-lg'>{post.user.username}</h1>
                                        <h3 className='text-sm'>{post.user.email}</h3>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-primary">
                                        follow
                                    </button>
                                </div>
                            </div>
                            <div className="card-normal py-2">
                                <h2 className="card-title">
                                    {post.content}
                                </h2>
                            </div>
                            <figure>
                                <img
                                    src={post.post_image}
                                    alt="post image"
                                    className='rounded-lg' />
                            </figure>
                        </div>
                    )))
                }
              
            </div>
                </div>
            </div>
        </div>
    )
}

export default Profile