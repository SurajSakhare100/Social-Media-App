// Story.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStory, fetchStories, selectStories } from '../app/slices/storySlice';

const AddStory = () => {
    const dispatch = useDispatch();
    const stories = useSelector(selectStories);
    const user = useSelector((state) => state.user);
    const [error, setError] = useState('');
console.log(user)
    useEffect(() => {
        dispatch(fetchStories()); // Fetch stories when the component mounts
    }, [dispatch]);

    const handleStoryUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('story', file); // Ensure this key matches what your backend expects

            try {
                dispatch(createStory({ userId: user._id, formData })); // Await for the dispatch to finish
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
                stories.map((story) => (
                    <div key={story._id} className='flex flex-col items-center flex-wrap'>
                        <img
                            src={story.mediaUrl}
                            alt="Story"
                            className='w-20 h-20 rounded-full object-cover'
                        />
                        <p>Expires at: {new Date(story.expirationTime).toLocaleString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default AddStory;
