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
    }, [])
    return (
        <div className='px-20 mt-10'>
            <div className='w-full md:w-3/4 mx-auto'>
                <div className='md:py-10 flex gap-6 items-center'>
                   <div>
                   <div className='avatar w-56 h-56 '>
                        <img src={user ? user.profilePicture : profile} alt="profile" className='w-full h-full rounded-full' />
                    </div>
                    <div>
                        <h1 className='text-2xl'>{user?.username}</h1>
                        <h2 className='text-lg'>{user?.email}</h2>
                    </div>
                   </div>
                    <div><h1 className='w-120'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad sapiente neque nesciunt repellat id mollitia facilis fugiat, eaque dolore commodi nam. Modi recusandae animi voluptate qui quia ratione, illo dolor?</h1>
                    <h1 className='w-120'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad sapiente neque nesciunt repellat id mollitia facilis fugiat, eaque dolore commodi nam. Modi recusandae animi voluptate qui quia ratione, illo dolor?</h1></div>
                    

                </div>
                <div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            posts?.map((post) => ((
                                <div key={post._id} className=''>
                                    <figure className='aspect-square'>
                                        <img
                                            src={post.post_image}
                                            alt="post image"
                                            className='rounded-lg w-full h-full' />
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