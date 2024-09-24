import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FollowBtn from '../components/FollowBtn.jsx';
import { useEffect } from 'react';
import { fetchFollowers, fetchFollowing } from '../app/slices/followSlice.js';

function Follows() {
    const { id, type } = useParams(); // Retrieve URL parameters (id, type)
    const user = useSelector((state) => state.user); // Get the current logged-in user from Redux state
    const dispatch = useDispatch();
    const follows = useSelector((state) => state.follow); // Assume follows holds both followers and following data
    console.log(follows);

    // Fetch follower or following data when 'id' or 'type' changes
    useEffect(() => {
        if (type === 'followers') {
            dispatch(fetchFollowers(id)); // Fetch followers if type is 'followers'
        } else if (type === 'following') {
            dispatch(fetchFollowing(id)); // Fetch following if type is 'following'
        } else {
            console.error("Invalid type parameter");
        }
    }, [id, type, dispatch]);

    // Function to render follow items
    const renderFollowItems = (followList) => {
        return followList.map((follow) => (
            <div
                key={follow._id}
                className="flex items-center justify-between p-4 mb-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-400"
            >
                <div className="flex items-center gap-4">
                    <Link
                        to={`/user/${type === 'followers' ? follow.followerId._id : follow.followingId._id}`} // Navigate to the user's profile
                        className="flex-shrink-0"
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-blue-400">
                            <img
                                src={type === 'followers' ? follow.followerId.profilePicture : follow.followingId.profilePicture} // Display the correct user's profile picture
                                alt={`${type === 'followers' ? follow.followerId.profileName : follow.followingId.profileName}'s profile`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-blue-900">
                            {type === 'followers' ? follow.followerId.profileName : follow.followingId.profileName} {/* Display profile name */}
                        </h1>
                        <h3 className="text-sm md:text-base text-gray-600">
                            {type === 'followers' ? follow.followerId.username : follow.followingId.username} {/* Display username */}
                        </h3>
                    </div>
                </div>
                <div>
                    <FollowBtn
                        followingId={type === 'followers' ? follow.followerId._id : follow.followingId._id} // Pass the correct user ID for follow/unfollow
                        followerId={user?._id} // Current user's ID
                        initialIsFollowing={follow.isFollowing} // Pass the initial follow state
                    />
                </div>
            </div>
        ));
    };

    return (
        <div className="w-full h-full overflow-y-auto flex flex-col items-center px-4 pt-24 bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100">
            <div className="w-full max-w-3xl">
                <h1
                    className={`text-2xl md:text-3xl lg:text-4xl text-center rounded-lg font-semibold my-4 py-4 transition-colors duration-300 ${type === 'following' ? 'bg-blue-500 text-white' : 'bg-red-400 text-white'}`}
                >
                    {`${user?.profileName}'s ${type}`} {/* Display user's followers/following */}
                </h1>
                    {
                        follows ===null ? (
                            <h1 className="text-xl text-center py-6 text-gray-700">No {type} found</h1> // Message when no followers/following are found
                        ): type =="followers"?(
                            renderFollowItems(follows.followers))
                            :(renderFollowItems(follows.following))
                    }

            </div>
        </div>
    );
}

export default Follows;
