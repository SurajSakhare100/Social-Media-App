import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../index.js';

import { follow, unfollow } from '../index.js';

function FollowBtn({ followerId, followingId, initialIsFollowing }) {
    const [user, setUser] = useState(null);
 
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user or posts:', error);
            }
        };

        fetchUser();
    }, []);
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
            className={`btn ${isFollowing ? 'btn-success' : "btn-info"}`}
            onClick={handlefollowUnfollowUser}
            disabled={user?._id === followingId}
        >
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    );
}

export default FollowBtn;
