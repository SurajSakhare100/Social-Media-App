import React, { useEffect, useState } from "react";
import { getFollowers } from "../index.js"; // Adjust the import path as per your project structure
import { Link } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import { getCurrentUser } from '../index.js';

function Suggestion() {
    const [follows, setFollows] = useState(null);
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
                const data = await getFollowers(user?._id);
                setFollows(data);
            } catch (error) {
                console.error(`Failed to fetch followers:`, error);
            }
        };

        fetchFollowsData();
    }, [user,setFollows,FollowBtn]);
    return (
        <div>
            <h1 className="text-xl font-semibold bg-slate-300 py-2 px-4 rounded-lg">You can also follow them</h1>
            {follows?.map((follows) => (
                <div key={follows.followerId._id} className="flex items-center space-x-4 my-4 justify-between" >
                    <div className="flex gap-2">
                    <Link
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                        to={`/user/${follows.followerId._id}`}
                    >
                        <div className="w-18 h-18 rounded-full overflow-hidden">
                            <img
                                src={follows.followerId.profilePicture}
                                alt={`${follows.followerId.profileName}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-lg">{follows.followerId.profileName}</h1>
                        <h3 className="text-sm">{follows.followerId.email}</h3>
                    </div>
                    </div>
                    <div>
                        <FollowBtn
                            followingId={follows.followerId._id }
                            followerId={user._id}
                            isFollowing={follows.isFollowing}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Suggestion;
