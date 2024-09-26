import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoryById, deleteStory, selectStories, selectCurrentStory } from '../app/slices/storySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const StoryPage = () => {
    const { id } = useParams(); // Get story ID from URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user=useSelector((state)=>state.user)
    const stories = useSelector(selectStories); // Select all stories
    const story = useSelector(selectCurrentStory); // Select the current story
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                await dispatch(fetchStoryById(id)); // Fetch story by ID
            } catch (err) {
                setError('Failed to fetch story.');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [dispatch, id]);

    const handleDeleteStory = async () => {
        if (window.confirm("Are you sure you want to delete this story?")) {
            try {
                await dispatch(deleteStory(id));
                navigate('/'); // Redirect after deletion
            } catch (err) {
                setError('Failed to delete story.');
            }
        }
    };
    

    const handleNextStory = () => {
        const currentIndex = stories.findIndex(story => story._id === id);
        const nextIndex = (currentIndex + 1) % stories.length; // Loop back to the first story
        navigate(`/story/${stories[nextIndex]._id}`); // Navigate to next story
    };

    const handlePreviousStory = () => {
        const currentIndex = stories.findIndex(story => story._id === id);
        const prevIndex = (currentIndex - 1 + stories.length) % stories.length; // Loop back to the last story
        navigate(`/story/${stories[prevIndex]._id}`); // Navigate to previous story
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="relative mt-14 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={stories[currentStoryIndex].mediaUrl} alt="Story" className="h-next mt-16 w-full object-cover" />
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between  bg-black">
                    <div className="flex items-center gap-4">
                        <img src={story.userId.profilePicture} alt="" className="w-12 h-12 rounded-full border-2 border-white" />
                        <div>
                            <h2 className="text-white font-semibold">{stories[currentStoryIndex].userId.username}</h2>
                            <h3 className="text-sm text-gray-300">{story.userId.profileName}</h3>
                        </div>
                    </div>
                    {
                        story.userId._id==user._id?<button
                        onClick={handleDeleteStory}
                        className="bg-red-500 text-white px-3 py-1 rounded-full shadow hover:bg-red-600"
                    >
                        Delete
                    </button>:""
                    }
                    
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
        </div>
    );
};

export default StoryPage;
