import React, { useState } from 'react';
import { uploadPost } from '..';
import { handleSuccessPopup } from '../PopUp';

function CreatePost() {
  const [content, setContent] = useState('');
  const [postImage, setPostImage] = useState(null);

  const submitPost = async (e) => {
    e.preventDefault();
    const data = await uploadPost({ content, post_image: postImage });
    setContent('');
    setPostImage(null);
    document.getElementById('my_modal_5').close();
    handleSuccessPopup("Post uploaded successfully");
  };

  return (
    <div className='flex flex-col gap-6 p-4 bg-white rounded-lg shadow-md'>
      {/* Post Content Input */}
      <div className='flex items-center border-b border-gray-300 pb-3'>
        <input
          type="text"
          className="w-full border-none outline-none focus:ring-2 focus:ring-blue-500 text-lg p-3 rounded-lg"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Create Post Button */}
      <button
        className='w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200'
        onClick={() => document.getElementById('my_modal_5').showModal()}
      >
        Create Post
      </button>

      {/* Modal for Post Image Upload */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white rounded-lg shadow-lg">
          <div className="modal-action justify-center">
            <form method="dialog" className='flex flex-col gap-6' onSubmit={submitPost}>
              <h3 className='text-xl text-gray-800 font-semibold'>Add Post Image</h3>
              
              {/* Title Input */}
              <label className="w-full">
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write title"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </label>

              {/* File Upload Input */}
              <input
                type="file"
                className="file-input file-input-ghost w-full max-w-sm mt-4"
                onChange={(e) => setPostImage(e.target.files[0])}
              />

              <div className='flex justify-between mt-4'>
                {/* Close Button */}
                <button type="button" className="btn btn-light text-gray-600" onClick={() => document.getElementById('my_modal_5').close()}>
                  Close
                </button>

                {/* Submit Button */}
                <button type="submit" className="btn btn-info text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Submit Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default CreatePost;
