import { getFollowers, getFollowing } from '../index.js';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FollowBtn from '../components/FollowBtn.jsx';
import { useEffect, useState } from 'react';

function Follows() {
  const { id, type } = useParams(); // Extract `id` and `type` from URL parameters
  const [follows, setFollows] = useState([]); // State to store follows data
  const user = useSelector((state) => state.user.userDetails); // Get current user details from Redux state

  useEffect(() => {
    const fetchFollowsData = async () => {
      try {
        let data;
        if (type === 'followers') {
          data = await getFollowers(id); // Fetch followers if `type` is 'followers'
        } else if (type === 'following') {
          data = await getFollowing(id); // Fetch following if `type` is 'following'
        } else {
          console.error("Invalid type parameter");
          return;
        }
        setFollows(data);
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      }
    };

    fetchFollowsData();
  }, [id, type]);
  return (
    <div>
      <div className='w-full md:w-1/2 mx-auto'>
        {follows.length > 0 ? follows.map((follow) => (
          <div key={follow._id} className="w-full flex items-center justify-between space-x-4 my-4">
            <div className='flex gap-4'>
              <Link
                className="btn btn-ghost btn-circle avatar"
                to={`/user/${type === 'followers' ? follow.followerId._id : follow.followingId._id}`}
              >
                <div className="w-18 h-18 rounded-full overflow-hidden">
                  <img
                    src={type === 'followers' ? follow.followerId.profilePicture : follow.followingId.profilePicture}
                    alt={`${type === 'followers' ? follow.followerId.username : follow.followingId.username}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-lg">{type === 'followers' ? follow.followerId.username : follow.followingId.username}</h1>
                <h3 className="text-sm">{type === 'followers' ? follow.followerId.email : follow.followingId.email}</h3>
              </div>
            </div>
            <div>
              <FollowBtn 
                followingId={type === 'followers' ? follow.followerId._id : follow.followingId._id}
                followerId={user._id}
                isFollowing={follow.isFollowing} 
              />
            </div>
          </div>
        )) : <h1 className='text-4xl text-center'>No {type} found</h1>}
      </div>
    </div>
  );
}

export default Follows;
