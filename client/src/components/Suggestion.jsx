import React, { useEffect, useState } from "react";
import { getAllUser } from ".."; // Adjust the import path as per your project structure
import { Link } from "react-router-dom";

function Suggestion() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllUser();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                // Handle error state or retry logic if needed
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            <h1 className="text-xl">You can also follow them</h1>
            {users?.map((user) => (
                <div key={user._id} className="flex items-center space-x-4 my-4" >
                    <Link
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                        to={`/user/${user._id}`}
                    >
                        <div className="w-18 h-18 rounded-full overflow-hidden">
                            <img
                                src={user.profilePicture}
                                alt={`${user.username}'s profile`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-lg">{user.username}</h1>
                        <h3 className="text-sm">{user.email}</h3>
                    </div>
                    <div>
                        <button className="btn btn-primary">
                            follow
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Suggestion;