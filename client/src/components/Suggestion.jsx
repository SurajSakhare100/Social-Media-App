import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FollowBtn from "./FollowBtn";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowers } from "../app/slices/followSlice.js";

function Suggestion() {
    const user = useSelector((state) => state.user); // Get the current logged-in user from Redux state
    const followers = useSelector((state) => state.follow.followers); // Get followers from Redux state
    const isLoading = useSelector((state) => state.follow.isLoading); // Assuming loading state is managed
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchFollowsData = () => {
            if (user._id) {
                dispatch(fetchFollowers(user?._id));
            }
        };
        fetchFollowsData();
    }, [dispatch, user]);

    return (
        <div>
            <h1 className="text-xl font-semibold bg-slate-300 py-2 px-4 rounded-lg">
                You can also follow them
            </h1>

            {/* Conditional rendering for loading or no followers */}
            {isLoading ? (
                <p>Loading...</p>
            ) : followers?.length ? (
                followers.map((follower) => (
                    <div
                        key={follower.followerId._id}
                        className="flex items-center space-x-4 my-4 justify-between"
                    >
                        <div className="flex gap-2">
                            <Link
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                                to={`/user/${follower.followerId._id}`}
                            >
                                <div className="w-18 h-18 rounded-full overflow-hidden">
                                    <img
                                        src={follower.followerId.profilePicture}
                                        alt={follower.followerId.profileName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Link>
                            <div>
                                <h1 className="text-lg">{follower.followerId.profileName}</h1>
                                <h3 className="text-sm">{follower.followerId.email}</h3>
                            </div>
                        </div>
                        <div>
                            <FollowBtn
                                followingId={follower.followerId._id}
                                followerId={user._id}
                                initialIsFollowing={follower?.isFollowing}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <p>No suggestions available</p>
            )}
        </div>
    );
}

export default Suggestion;
