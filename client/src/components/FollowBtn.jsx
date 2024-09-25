import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { follow, unfollow } from '../index.js';

function FollowBtn({ followerId, followingId, initialIsFollowing }) {
    // Get the current logged-in user from Redux state
    const user = useSelector((state) => state.user);
    // State to manage if the current user is following the other user
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    // Function to handle follow/unfollow actions
    const handleFollowUnfollowUser = async () => {
        try {
            if (!isFollowing) {
                // Call follow API if the user is not following
                await follow(followerId, followingId);
            } else {
                // Call unfollow API if the user is already following
                await unfollow(followerId, followingId);
            }

            // Toggle the follow state locally after success
            setIsFollowing((prevState) => !prevState);
        } catch (error) {
            console.error("Failed to follow/unfollow user:", error);
        }
    };

    return (
        <button
            className={`btn ${isFollowing ? 'btn-success' : 'btn-info'}`}
            onClick={handleFollowUnfollowUser}
            // Disable the button if the user is trying to follow themselves
            disabled={user?._id === followingId}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}

export default FollowBtn;
