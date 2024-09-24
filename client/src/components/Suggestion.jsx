import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowers } from "../app/slices/followSlice.js";

function Suggestion() {
    const user = useSelector((state) => state.user); // Get the current logged-in user from Redux state
    const followers = useSelector((state) => state.follow.followers); // Get followers from Redux state
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFollowsData = () => {
            dispatch(fetchFollowers());
        };

        fetchFollowsData();
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-xl font-semibold bg-slate-300 py-2 px-4 rounded-lg">
                You can also follow them
            </h1>
            {followers?.map((follower) => (
                <div key={follower._id} className="flex items-center space-x-4 my-4 justify-between">
                    <div className="flex gap-2">
                        <Link
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                            to={`/user/${follower._id}`}
                        >
                            <div className="w-18 h-18 rounded-full overflow-hidden">
                                <img
                                    src={follower.profilePicture}
                                    alt={follower.profileName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>
                        <div>
                            <h1 className="text-lg">{follower.profileName}</h1>
                            <h3 className="text-sm">{follower.email}</h3>
                        </div>
                    </div>
                    <div>
                        <FollowBtn
                            followingId={follower._id}
                            followerId={user._id}
                            isFollowing={follower.isFollowing} // Ensure this is correct based on your API response
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Suggestion;
