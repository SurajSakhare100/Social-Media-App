import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import Comments from './Comments';
import { getAllPosts, getCurrentUser, likePost, unlikePost } from '../index.js'; // Assuming these functions are exported from an api.js file

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

    const toggleComments = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId ? { ...post, showComments: !post.showComments } : post
            )
        );
    };

    console.log(posts)

    return (
        <div className="card">
            
            <div className="w-full">
                {posts.map(post => (
                    <div key={post._id} className="my-6">
                        <div>user.</div>
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
                                    className="rounded-lg"
                                />
                            </figure>
                        )}
                        <div className="pt-2 flex items-center gap-4">
                            <div
                                className="flex gap-2 cursor-pointer"
                                onClick={() => handleLike(post._id)}
                            >
                                {post.liked ? (
                                    <AiFillLike className="text-red-400 text-2xl" />
                                ) : (
                                    <AiOutlineLike className="text-2xl" />
                                )}
                                <span>{post.likeCount}</span>
                            </div>
                            <div
                                className="flex gap-2 cursor-pointer"
                                onClick={() => toggleComments(post._id)}
                            >
                                <FaCommentAlt className="text-xl mt-1" />
                                <span>Comments</span>
                            </div>
                        </div>

                        {post.showComments && <Comments postId={post._id} userId={user._id} userPicture={user.profilePicture}/>}

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Post;
