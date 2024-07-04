import React, { useEffect, useState } from 'react'
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Comments from './Comments';
import { getAllPosts, likePost } from '..';
import { Link } from 'react-router-dom';
function Post() {

    const [posts, setPosts] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPosts()
            setPosts(data);
        }
        fetchData();
    }, [])


    const [like, setLike] = useState(false);
    const isliked =async (post_id,user_id) => {
        const data=await likePost(post_id,user_id)
        setLike((p) => !p);
    }
    const [comments, setComments] = useState(false);
    const isComment = () => {
        setComments((p) => !p);
    }
    return (
        <div className='card'>
            <div className=" w-full ">
                {
                    posts?.map((post) => ((
                        <div key={post._id} className='my-6'>
                            <div className='flex items-center w-full justify-between'>
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
                            <div className='pt-2 flex items-center gap-4 '>
                    <div className='flex gap-2 cursor-pointer' onClick={()=>isliked(post._id,post.user._id)} >
                        <AiFillLike
                            className={`${like ? 'text-red-400 ' : ""} text-2xl`} />
                        <span>like</span>
                    </div>

                    <div className='flex gap-2 cursor-pointer' onClick={isComment}>
                        <FaCommentAlt className=' text-xl mt-1' />
                        <span>comments</span>
                    </div>
                </div>
                        </div>

                    )))
                }
               
                <div className={`${comments ? "" : "hidden"}`}>
                    <Comments />
                    <Comments />
                </div>
            </div>
        </div>
    )
}

export default Post