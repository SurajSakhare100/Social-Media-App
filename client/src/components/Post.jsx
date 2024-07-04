import React, { useEffect, useState } from 'react'
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Comments from './Comments';
import { getAllPosts } from '..';
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
    const isliked = () => {
        setLike((p) => !p);
    }
    const [comments, setComments] = useState(false);
    const isComment = () => {
        setComments((p) => !p);
    }
    return (
        <div className='card'>
            <div className=" w-full shadow-xl p-4">


                {
                    posts?.map((post) => ((
                        <div key={post._id}>
                            <div className='flex items-center gap-4 w-full py-2'>
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ">
                                    <div className="w-10 rounded-full ">
                                        <img
                                            alt="Tailwind CSS Navbar component"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                    </div>

                                </div>
                                <div>
                                    <h1 className='text-lg'>Avatar</h1>
                                    <h3 className='text-sm'>profile</h3>
                                </div>
                            </div>
                            <div className="card-normal py-2">
                                <h2 className="card-title">
                                    {post.title}
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
                <div className='pt-2 flex items-center gap-4'>
                    <div className='flex gap-2 cursor-pointer' onClick={isliked} >
                        <AiFillLike
                            className={`${like ? 'text-red-400 ' : ""} text-2xl`} />
                        <span>like</span>
                    </div>

                    <div className='flex gap-2 cursor-pointer' onClick={isComment}>
                        <FaCommentAlt className=' text-xl mt-1' />
                        <span>comments</span>
                    </div>
                </div>
                <div className={`${comments ? "" : "hidden"}`}>
                    <Comments />
                    <Comments />
                </div>
            </div>
        </div>
    )
}

export default Post