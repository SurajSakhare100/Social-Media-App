import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { follow, unfollow } from '../index.js';

function FollowBtn({ followerId, followingId, initialIsFollowing }) {
    const user = useSelector((state) => state.user.userDetails);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const handlefollowUnfollowUser = async () => {
        try {
            let data;
            if (!isFollowing) {
                data = await follow(followerId, followingId);
            } else {
                data = await unfollow(followerId, followingId);
            }
            setIsFollowing(!isFollowing); // Update the state locally
        } catch (error) {
            console.error("Failed to follow/unfollow user:", error);
        }
    };

    return (
        <button
            className={`btn ${isFollowing ? 'btn-info' : "btn-success"}`}
            onClick={handlefollowUnfollowUser}
            disabled={user._id === followingId}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}

export default FollowBtn;
