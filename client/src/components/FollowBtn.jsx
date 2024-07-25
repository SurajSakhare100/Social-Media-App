import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { follow, unfollow } from '../index.js';

function FollowBtn({ followerId, followingId,isFollowing }) {
    const user = useSelector((state) => state.user.userDetails);
    const handlefollowUnfollowUser = async (followerId, followingId) => {
        try {
            let data;
            if(!isFollowing){
                 data = await follow(followerId, followingId);
            }else{
                 data = await unfollow(followerId, followingId);
            }
        } catch (error) {
            console.error("Failed to follow/unfollow user:", error);
        }
    };

    return (
        <button
            className={`btn ${isFollowing? 'btn-accent' : 'btn-info'}`}
            onClick={() => handlefollowUnfollowUser(followerId, followingId)}
            disabled={user._id === followingId}
        >
            {isFollowing? 'Unfollow' : 'Follow'}
        </button>
    )
}

export default FollowBtn
