import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../app/slices/postSlice.js';
import Post from '../components/Post.jsx';

function PostPage() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const user=useSelector((state) => state.user);
    useEffect(() => {
        if (user.isAuthenticated) {
            dispatch(fetchPosts());
        }
    }, [dispatch, user.isAuthenticated]);
    return (
        <div className="w-full">
            {posts.length > 0 ? (
                posts.map(post => <Post key={post._id} post={post} />)
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}

export default PostPage;
