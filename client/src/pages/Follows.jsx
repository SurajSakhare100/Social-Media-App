import { getFollowers, getFollowing } from '../index.js';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FollowBtn from '../components/FollowBtn.jsx';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../index.js';

function Follows() {
    const { id, type } = useParams();
    const [follows, setFollows] = useState([]);
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

    useEffect(() => {
        const fetchFollowsData = async () => {
            try {
                let data;
                if (type === 'followers') {
                    data = await getFollowers(id);
                } else if (type === 'following') {
                    data = await getFollowing(id);
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
        <div className="w-full h-full overflow-y-auto flex flex-col items-center px-4 pt-24 bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100">
            <div className="w-full max-w-3xl">
                <h1
                    className={`text-2xl md:text-3xl lg:text-4xl text-center rounded-lg font-semibold my-4 py-4 transition-colors duration-300 ${type === "following" ? "bg-blue-500 text-white" : "bg-red-400 text-white"}`}
                >
                    {`${user?.profileName}'s ${type}`}
                </h1>

                {follows.length > 0 ? (
                    follows.map((follow) => (
                        <div
                            key={follow._id}
                            className="flex items-center justify-between p-4 mb-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-400"
                        >
                            <div className="flex items-center gap-4">
                                <Link
                                    to={`/user/${type === 'followers' ? follow.followerId._id : follow.followingId._id}`}
                                    className="flex-shrink-0"
                                >
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-blue-400">
                                        <img
                                            src={type === 'followers' ? follow.followerId.profilePicture : follow.followingId.profilePicture}
                                            alt={`${type === 'followers' ? follow.followerId.profileName : follow.followingId.profileName}'s profile`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </Link>
                                <div>
                                    <h1 className="text-lg md:text-xl font-semibold text-blue-900">{type === 'followers' ? follow.followerId.profileName : follow.followingId.profileName}</h1>
                                    <h3 className="text-sm md:text-base text-gray-600">{type === 'followers' ? follow.followerId.username : follow.followingId.username}</h3>
                                </div>
                            </div>
                            <div>
                                <FollowBtn
                                    followingId={type === 'followers' ? follow.followerId._id : follow.followingId._id}
                                    followerId={user?._id}
                                    isFollowing={follow.isFollowing}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 className="text-xl text-center py-6 text-gray-700">No {type} found</h1>
                )}
            </div>
        </div>
    );
}

export default Follows;
