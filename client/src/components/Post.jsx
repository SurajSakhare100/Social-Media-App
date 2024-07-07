import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Comments from './Comments';
import { getAllPosts, likePost } from '..';
import { Link } from 'react-router-dom';

function Post() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPosts();
            setPosts(data);
        };
        fetchData();
    }, []);
    console.log(posts)
    const handleLike = async (post_id, user_id) => {
        await likePost(post_id, user_id);
        setPosts((prevPosts) => 
            prevPosts.map((post) => 
                post._id === post_id ? { ...post, liked: !post.liked } : post
            )
        );
    };

    const toggleComments = (post_id) => {
        setPosts((prevPosts) => 
            prevPosts.map((post) => 
                post._id === post_id ? { ...post, showComments: !post.showComments } : post
            )
        );
    };

    return (
        <div className='card'>
            <div className="w-full">
                {posts.map((post) => (
                    <div key={post._id} className='my-6'>
                        <div className='flex items-center w-full justify-between'>
                            <div className='flex gap-4'>
                                <Link className="w-16 h-16" to={`/user/${post.userDetails._id}`}>
                                    <img
                                        alt="Profile"
                                        src={post.userDetails.profilePicture}
                                        className='w-full h-full rounded-full'
                                    />
                                </Link>
                                <div>
                                    <h1 className='text-lg'>{post.userDetails.username}</h1>
                                    <h3 className='text-sm'>{post.userDetails.email}</h3>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-primary">
                                    Follow
                                </button>
                            </div>
                        </div>
                        <div className="card-normal py-2">
                            <h2 className="card-title">
                                {post.content}
                            </h2>
                        </div>
                        {post.post_image && (
                            <figure>
                                <img
                                    src={post.post_image}
                                    alt="Post"
                                    className='rounded-lg'
                                />
                            </figure>
                        )}
                        <div className='pt-2 flex items-center gap-4'>
                            <div
                                className='flex gap-2 cursor-pointer'
                                onClick={() => handleLike(post._id, post.userDetails._id)}
                            >
                                {post.liked ? (
                                    <AiFillLike className='text-red-400 text-2xl' />
                                ) : (
                                    <AiOutlineLike className='text-2xl' />
                                )}
                                <span>{post.likeCount}</span>
                            </div>

                            <div
                                className='flex gap-2 cursor-pointer'
                                onClick={() => toggleComments(post._id)}
                            >
                                <FaCommentAlt className='text-xl mt-1' />
                                <span>Comments</span>
                            </div>
                        </div>

                        {post.showComments && (
                            <div>
                                <Comments key={`comments-${post._id}`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Post;
