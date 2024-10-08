import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getChatUser } from '..';
import { useSelector } from 'react-redux';

function ChatDashBoard() {
    const [chats, setChat] = useState([]);
    const { user } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getChatUser(user);
                setChat(data);
            } catch (error) {
                console.error("Failed to fetch chat users:", error);
            }
        }
        fetchData();
    }, [user]);
    const currentuser = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if the user is not authenticated
        if (currentuser.status === 'failed' && !currentuser.isAuthenticated) {
            navigate('/login');
        }
    }, [currentuser.isAuthenticated, currentuser.status, navigate]);
    return (
        <div className="h-full pt-20 md:pt-24 bg-[#F4F2EE]">
            <div className="flex flex-col p-4">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <Link
                            to={`/chat/${chat._id}`}
                            key={chat._id}
                            className="flex items-center bg-white border-b border-gray-300 p-4 rounded-lg mb-2 shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-green-500">
                                    <img
                                        src={chat.userDetails?.profilePicture}
                                        alt={`${chat.userDetails?.profileName}'s profile`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <h1 className="text-lg font-semibold">{chat.userDetails?.profileName}</h1>
                                <p className="text-gray-600">{chat.lastMessage?.content}</p>
                            </div>
                            <div>
                            <p>
  <strong>{new Date(chat.lastMessage?.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> 
  {` ${new Date(chat.lastMessage?.updatedAt).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}`}
</p>

                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No chats available</p>
                )}
            </div>
        </div>
    );
}

export default ChatDashBoard;
