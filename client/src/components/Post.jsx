import React, { useState } from 'react';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Comments from './Comments';
import { FaCommentAlt } from 'react-icons/fa';
import Profile from "/profile.png";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, editPost } from '../app/slices/postSlice.js';
import { likePost, unlikePost } from '../index.js';

function Post({ post }) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [updatedContent, setUpdatedContent] = useState(post.content); 
    const [postState, setPostState] = useState(post); // Local post state
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if (!user) return;

        try {
            if (postState.liked) {
                await unlikePost(postState._id, user._id);
                setPostState(prevState => ({
                    ...prevState,
                    liked: false,
                    likeCount: prevState.likeCount - 1,
                }));
            } else {
                await likePost(postState._id, user._id);
                setPostState(prevState => ({
                    ...prevState,
                    liked: true,
                    likeCount: prevState.likeCount + 1,
                }));
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };


    const showPost = (e) => {
        setModalImageSrc(e.target.src);
        setIsImageModalOpen(true);
    };

    const closeModal = () => {
        setIsImageModalOpen(false);
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleDropdown = () => {
        setDropdownOpen(dropdownOpen === postState._id ? null : postState._id);
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        dispatch(deletePost(postState._id));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        dispatch(editPost({ postId: postState._id, content: updatedContent }));
        setIsEditModalOpen(false); 
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false); 
    };

    return (
        <div className="my-4 p-4 border rounded-lg dark:bg-black bg-white dark:text-white shadow-md">
            {/* Edit Post Modal */}
            {isEditModalOpen && (
                <dialog open className="modal px-2">
                    <div className="modal-box">
                        <form onSubmit={handleEditSubmit}>
                            <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                value={updatedContent}
                                onChange={(e) => setUpdatedContent(e.target.value)}
                                rows={4}
                            />
                            <div className="modal-action">
                                <button type="button" className="btn btn-error" onClick={handleEditModalClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

            {/* Post Image Modal */}
            {isImageModalOpen && (
                <dialog open className="modal px-2">
                    <div className="modal-box w-fit">
                        <button onClick={closeModal} className="btn btn-sm btn-circle btn-info absolute right-6 top-4">✕</button>
                        <figure className="w-fit h-80 md:h-[600px] rounded-lg">
                            <img src={modalImageSrc} className="rounded-lg w-full h-full object-cover" />
                        </figure>
                    </div>
                </dialog>
            )}

            {/* Post Header */}
            <div className="flex items-center mb-4">
                <Link to={`/user/${postState.creatorDetails?._id}`} className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden">
                    <img
                        src={postState.creatorDetails?.profilePicture || Profile}
                        alt={`${postState.creatorDetails?.profileName}'s profile`}
                        className="w-full h-full object-cover"
                    />
                </Link>
                <div className="ml-4 flex-1">
                    <h1 className="text-lg font-semibold">{postState.creatorDetails?.profileName || "Profile name"}</h1>
                    <h2 className="text-md text-gray-600">{postState.creatorDetails?.username || "User name"}</h2>
                </div>
                <div className="relative">
                    <button onClick={toggleDropdown} className="text-gray-500 hover:text-gray-700 text-xl focus:outline-none">
                        &#x2026;
                    </button>
                    {dropdownOpen === postState._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                            <button onClick={handleEdit} className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-900">
                                Edit
                            </button>
                            <button onClick={handleDelete} className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-900">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <p>{postState.content}</p>
            {postState.post_image && (
                <figure onClick={showPost} className="mt-2 w-full h-60 rounded-lg overflow-hidden cursor-pointer">
                    <img src={postState.post_image} className="w-full h-full object-cover" />
                </figure>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between mt-4">
                <button onClick={handleLike} className="flex items-center gap-1">
                    {postState.liked ? <AiFillLike className="text-xl text-blue-600" /> : <AiOutlineLike className="text-xl" />}
                    <span>{postState.likeCount}</span>
                </button>
                <button onClick={toggleComments} className="flex items-center gap-1">
                    <FaCommentAlt className="text-lg" />
                    <span>{postState.commentCount}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <Comments postId={postState._id} userId={user._id} userPicture={user.profilePicture} />
            )}
        </div>
    );
}

export default Post;
