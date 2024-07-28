import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Profile from "/profile.png";

function Story() {
    const [story, setStory] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleStoryChange = (e) => {
        const file = e.target.files[0];
        setStory(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <div className='flex gap-4'>
            <div className='w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center'>
                <label className="label cursor-pointer" htmlFor='storyInp'>
                    <FaPlus className='text-2xl' />
                </label>
                <input 
                    type="file" 
                    id='storyInp' 
                    onChange={handleStoryChange} 
                    className="file-input file-input-bordered w-full max-w-xs hidden" 
                />
            </div>
            {preview && (
                <div className='w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden'>
                    <img src={preview} alt="story preview" className='object-center object-cover' />
                </div>
            )}
            <div className='flex gap-4'>
                <div className='w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden'>
                    <img src={Profile} alt="profile" className='object-center object-cover' />
                </div>
                <div className='w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden'>
                    <img src={Profile} alt="profile" className='object-center object-cover' />
                </div>
                <div className='w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden'>
                    <img src={Profile} alt="profile" className='object-center object-cover' />
                </div>
            </div>
        </div>
    );
}

export default Story;
