import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStory, fetchStories, selectStories } from '../app/slices/storySlice';
import { fetchFollowers } from '../app/slices/followSlice'; // Assuming you have a slice to handle follow
import { Link } from 'react-router-dom';

const AddStory = () => {
    const dispatch = useDispatch();
    const stories = useSelector(selectStories);
    const user = useSelector((state) => state.user);
    const following = useSelector((state) => state.follow.following); // Get the following list from redux
    const [error, setError] = useState('');



    useEffect(() => {
        // Dispatch the fetchStories action with the following_ids
        if (!user.isAuthenticated) {
        dispatch(fetchStories());
        }
    }, [dispatch, user.isAuthenticated]);

    const handleStoryUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('story', file); // Ensure this key matches what your backend expects

            try {
                await dispatch(createStory({ userId: user._id, formData })); // Await for the dispatch to finish
                setError(''); // Clear error if upload is successful
                event.target.value = null; // Clear the input value after upload
            } catch (error) {
                console.error('Error uploading story:', error);
                setError('Failed to upload story. Please try again.');
            }
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div className='flex gap-4 items-center overflow-y-auto'>
            <div className='flex flex-col'>
                <label
                    htmlFor="createStory"
                    className='w-20 h-20 bg-white rounded-full px-2 py-4 flex items-center justify-center cursor-pointer'
                >
                    +
                </label>
                <input
                    id="createStory"
                    name="createStory"
                    type="file"
                    className='hidden'
                    onChange={handleStoryUpload}
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* Display stories */}
            {stories.length === 0 ? (
                <p>No stories available.</p>
            ) : (
                stories?.map((story) => (
                    <Link key={story._id} to={`/story/${story._id}`} className='flex flex-col items-center flex-wrap'>
                        <div className="relative w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
                            <img
                                src={story.userId.profilePicture} // Adjust based on your API response structure
                                alt="Story"
                                className='w-20 h-20 rounded-full object-cover hover:scale-110 ease-in-out'
                            />
                        </div>
                    </Link>

                ))
            )}
        </div>
    );
};

export default AddStory;
