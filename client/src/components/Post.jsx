import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Comments from './Comments';
import { getAllPosts, getCurrentUser, likePost, unlikePost } from '../index.js';
import { FaCommentAlt } from 'react-icons/fa';
import Profile from "/profile.png";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, fetchPosts } from '../app/slices/postSlice.js';

function Post() {
    const user = useSelector((state) => state.user);
    const posts = useSelector((state) => state.posts.posts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                    dispatch(fetchPosts())
            } catch (error) {
                console.error('Error fetching user or posts:', error);
            }
        };

        fetchData();
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
    const [dropdownOpen, setDropdownOpen] = useState(null); // Track the open dropdown post

    const toggleDropdown = (postId) => {
        if (dropdownOpen === postId) {
            setDropdownOpen(null); // Close dropdown if it's already open
        } else {
            setDropdownOpen(postId); // Open dropdown for this specific post
        }
    };

    const handleEdit = (postId) => {
        // Handle post edit logic here
        console.log("Editing post:", postId);
        dispatch(editPost(postId)); // Example dispatch for editing
    };

    const handleDelete = (postId) => {
        // Handle post delete logic here
        console.log("Deleting post:", postId);
        dispatch(deletePost(postId)); // Example dispatch for deleting
    };
    return (
        <div className="">
            <dialog id="my_modal_1" className="modal px-2" >
                <div className="modal-box w-fit ">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-info absolute right-6 top-4">✕</button>
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

            <div className="w-full ">
                {posts.length>0 && posts.map(post => (
                    <div key={post._id} className="my-4 p-4 border rounded-lg dark:bg-black bg-white dark:text-white dark:text-pretty shadow-md">
                        <div
                            className="flex items-center mb-4"
                        >
                            <Link 
                            to={`/user/${post.creatorDetails?._id}`}
                            className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden">
                                <img
                                    src={post.creatorDetails?.profilePicture || Profile}
                                    alt={`${post.creatorDetails?.profileName}'s profile`}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                            <div className="ml-4 flex-1">
                                <h1 className="text-lg font-semibold">{post.creatorDetails?.profileName || "Profile name"}</h1>
                                <h2 className="text-md text-gray-600">{post.creatorDetails?.username || "User name"}</h2>
                            </div>
                            <div className="relative">
                            <button
                                onClick={() => toggleDropdown(post._id)}
                                className="text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
                            >
                                &#x2026; {/* Three-dot button */}
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen === post._id && (
                                <div className="dropdown-menu absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                                    <button
                                        onClick={() => handleEdit(post._id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        </div>
                        

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