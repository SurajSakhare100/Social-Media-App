import React, { useEffect, useState } from 'react';
import { fetchFollowers, handleFollow } from '../index.js';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Follows() {
  const [follows, setFollows] = useState([]);
  const { id } = useParams();
  const user = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    const fetchFollowsData = async () => {
      try {
        const data = await fetchFollowers(id);
        setFollows(data);
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };
    fetchFollowsData();
  }, [id]);

  const followUnfollowUser = async (userId, followingId) => {
    try {
      const data = await handleFollow(userId, followingId);
      // Fetch updated followers data after follow/unfollow action
      const updatedData = await fetchFollowers(id);
      setFollows(updatedData);
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  return (
    <div>
      <div className='w-full md:w-1/2 mx-auto'>
        {follows.length > 0 ? follows.map((follow) => (
          <div key={follow._id} className="w-full flex items-center justify-between space-x-4 my-4">
            <div className='flex gap-4'>
              <Link
                className="btn btn-ghost btn-circle avatar"
                to={`/user/${follow.user._id}`}
              >
                <div className="w-18 h-18 rounded-full overflow-hidden">
                  <img
                    src={follow.user.profilePicture}
                    alt={`${follow.user.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-lg">{follow.user.username}</h1>
                <h3 className="text-sm">{follow.user.email}</h3>
              </div>
            </div>
            <div>
              <button 
                className="btn btn-primary" 
                onClick={() => followUnfollowUser(user._id, follow.user._id)}
                disabled={user._id === follow.user._id}
              >
                {follow.following.includes(user?._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        )) : <h1 className='text-4xl text-center'>No followers found</h1>}
      </div>
    </div>
  );
}

export default Follows;
