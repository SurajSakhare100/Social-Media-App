import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Comments from './Comments';
import { getAllPosts, getCurrentUser, likePost, unlikePost } from '../index.js';
import { FaCommentAlt } from 'react-icons/fa';
import Profile from "/profile.png";
import { Link } from 'react-router-dom';

function Post() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                if (userData) {
                    const postData = await getAllPosts(userData._id);
                    setPosts(postData);
                }
            } catch (error) {
                console.error('Error fetching user or posts:', error);
            }
        };

        fetchUserAndPosts();
    }, []);

    const handleLike = async (postId) => {
        if (!user) return;

        try {
            const updatedPosts = await Promise.all(posts.map(async post => {
                if (post._id === postId) {
                    if (post.liked) {
                        await unlikePost(postId, user._id);
                        return {
                            ...post,
                            liked: false,
                            likeCount: post.likeCount - 1
                        };
                    } else {
                        await likePost(postId, user._id);
                        return {
                            ...post,
                            liked: true,
                            likeCount: post.likeCount + 1
                        };
                    }
                }
                return post;
            }));
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const showPost = (e) => {
        const modal = document.getElementById('my_modal_1');
        const modalImg = document.getElementById('modelImg');
        modalImg.src = e.target.src;
        modal.showModal();
    }

    const toggleComments = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId ? { ...post, showComments: !post.showComments } : post
            )
        );
    };

    return (
        <div className="">
            <dialog id="my_modal_1" className="modal px-2" >
                <div className="modal-box w-fit ">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-warning absolute right-6 top-4">✕</button>
                        <figure className='w-fit h-80 md:h-[600px] rounded-lg'>
                            <img
                                id='modelImg'
                                className="rounded-lg w-full h-full object-cover"
                            />
                        </figure>
                    </form>
                </div>
                <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
            </dialog>

            <div className="w-full">
                {posts.map(post => (
                    <div key={post._id} className="my-4 p-4 border rounded-lg bg-white shadow-md">
                        <Link
                            to={`/user/${post.creatorDetails?._id}`}
                            className="flex items-center mb-4"
                        >
                            <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden">
                                <img
                                    src={post.creatorDetails?.profilePicture || Profile}
                                    alt={`${post.creatorDetails?.profileName}'s profile`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="ml-4 flex-1">
                                <h1 className="text-lg font-semibold">{post.creatorDetails?.profileName || "Profile name"}</h1>
                                <h2 className="text-md text-gray-600">{post.creatorDetails?.username || "User name"}</h2>
                            </div>
                        </Link>
                        <div className="py-2">
                            <p className="text-gray-700">{post.content}</p>
                        </div>
                        {post.post_image && (
                            <figure className='mb-4 aspect-square'>
                                <img
                                    src={post.post_image}
                                    alt="Post"
                                    className="rounded-lg w-full h-full object-cover cursor-pointer"
                                    onDoubleClick={(e) => showPost(e)}
                                />
                            </figure>
                        )}
                        <div className="flex items-center justify-start text-gray-600 gap-4">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => handleLike(post._id)}
                            >
                                {post.liked ? (
                                    <AiFillLike className="text-red-500 text-2xl" />
                                ) : (
                                    <AiOutlineLike className="text-gray-500 text-2xl" />
                                )}
                                <span className="ml-2">{post.likeCount}</span>
                            </div>
                            <div
                                className="flex items-center cursor-pointer pt-1"
                                onClick={() => toggleComments(post._id)}
                            >
                                <FaCommentAlt className="text-gray-500 text-xl" />
                                <span className="ml-2">Comments</span>
                            </div>
                        </div>

                        {post.showComments && <Comments postId={post._id} userId={user._id} userPicture={user.profilePicture} />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Post