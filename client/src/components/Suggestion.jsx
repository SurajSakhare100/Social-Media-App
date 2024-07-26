import React, { useEffect, useState } from "react";
import { getFollowers } from "../index.js"; // Adjust the import path as per your project structure
import { Link } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import { useSelector } from "react-redux";

function Suggestion() {
    const [follows, setFollows] = useState(null);
    const user = useSelector((state) => state.user.userDetails); // Get current user details from Redux state
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
    }, [user]);
    return (
        <div>
            <h1 className="text-xl">You can also follow them</h1>
            {follows?.map((follows) => (
                <div key={follows.followerId._id} className="flex items-center space-x-4 my-4" >
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
