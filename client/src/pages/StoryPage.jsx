import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoriesbyUser, deleteStory, selectStories, selectCurrentStory } from '../app/slices/storySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const StoryPage = () => {
    const { userId } = useParams(); // Get user ID from URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const stories = useSelector(selectStories); // Select all stories
    const currentStories = useSelector(selectCurrentStory); // Select all stories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    useEffect(() => {
        const fetchStory = async () => {
            try {
                await dispatch(fetchStoriesbyUser(userId)); // Fetch stories by user ID
            } catch (err) {
                setError('Failed to fetch stories.');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [dispatch, userId]);

    const handleDeleteStory = async (storyId) => {
        if (window.confirm("Are you sure you want to delete this story?")) {
            try {
                await dispatch(deleteStory(storyId));
                navigate('/'); // Redirect after deletion
            } catch (err) {
                setError('Failed to delete story.');
            }
        }
    };

    const getNextUserIndex = (startIndex) => {
        // Find the next user's story index
        for (let i = startIndex + 1; i < stories.length; i++) {
            if (stories[i].userId._id !== stories[startIndex].userId._id) {
                return i; // Return the index of the first story from the next user
            }
        }
        return -1; // No next user found
    };

    const getPreviousUserIndex = (startIndex) => {
        // Find the previous user's story index
        for (let i = startIndex - 1; i >= 0; i--) {
            if (stories[i].userId._id !== stories[startIndex].userId._id) {
                return i; // Return the index of the last story from the previous user
            }
        }
        return -1; // No previous user found
    };

    const handleNextStory = () => {
        const nextIndex = currentStoryIndex + 1;
        console.log(nextIndex,currentStoryIndex)
        if (nextIndex < stories.length) {
            setCurrentStoryIndex(nextIndex);
        } else {
            // Move to the next user's first story
            const nextUserIndex = getNextUserIndex(currentStoryIndex);
            if (nextUserIndex !== -1) {
                setCurrentStoryIndex(nextUserIndex);
            }
        }
    };

    const handlePreviousStory = () => {
        const prevIndex = currentStoryIndex - 1;

        if (prevIndex >= 0) {
            setCurrentStoryIndex(prevIndex);
        } else {
            // Move to the previous user's last story
            const prevUserIndex = getPreviousUserIndex(currentStoryIndex);
            if (prevUserIndex !== -1) {
                setCurrentStoryIndex(prevUserIndex);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    // Get the current story based on the index
    const currentStory = stories[currentStoryIndex];

    return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            {currentStory ? (
                <div className="relative mt-14 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src={currentStory.mediaUrl} alt="Story" className="h-next mt-16 w-full object-cover" />
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-black">
                        <div className="flex items-center gap-4">
                            <img src={currentStory.userId.profilePicture} alt="" className="w-12 h-12 rounded-full border-2 border-white" />
                            <div>
                                <h2 className="text-white font-semibold">{currentStory.userId.username}</h2>
                                <h3 className="text-sm text-gray-300">{currentStory.userId.profileName}</h3>
                            </div>
                        </div>
                        {currentStory.userId._id === user._id && (
                            <button
                                onClick={() => handleDeleteStory(currentStory._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-full shadow hover:bg-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 bg-gray-800 bg-opacity-50">
                        <button
                            onClick={handlePreviousStory}
                            className="bg-gray-600 text-white px-3 py-1 rounded-full flex items-center"
                        >
                            <FaArrowLeft className="mr-2" />
                            Previous
                        </button>
                        <button
                            onClick={handleNextStory}
                            className="bg-gray-600 text-white px-3 py-1 rounded-full flex items-center"
                        >
                            Next
                            <FaArrowRight className="ml-2" />
                        </button>
                    </div>
                </div>
            ) : (
                <p>Story not found</p>
            )}
        </div>
    );
};

export default StoryPage;
