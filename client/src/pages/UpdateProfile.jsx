import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../app/slices/userSlice';
import { handleSuccessPopup } from '../PopUp';

function UpdateProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [profileName, setProfileName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // Default state for file

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setProfileName(user.profileName || '');
      setUsername(user.username || '');
    }
  }, [user]);
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedDetails = new FormData(); // Using FormData for file upload
    updatedDetails.append('profileName', profileName);
    updatedDetails.append('username', username);
    updatedDetails.append('bio', bio);

    if (profilePicture) {
      updatedDetails.append('profilePicture', profilePicture); // Append only if a new file is selected
    }
    dispatch(updateUserDetails(updatedDetails)); 
    handleSuccessPopup("your details update succsefully")
// Dispatch FormData for server handling
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture */}
        <div className="flex flex-col justify-center items-center space-x-4">
          <div className="flex-shrink-0">
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <img
                src={user.profilePicture || 'https://via.placeholder.com/80'}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium">
              Profile Picture
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
            />
          </div>
        </div>

        {/* Profile Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Profile Name</label>
          <input
            id="name"
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
