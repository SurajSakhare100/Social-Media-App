import axios from "axios";

const url = "http://localhost:5000";
const handleResponse = (res) => res.data.data;
const handleError = (err) => {
  console.log(err.message);
  return [];
};

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const createFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};

// Post-related functions
const getAllPosts = async () => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/post/getAllPosts`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getAllComments = async (postId) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/comments/getallcomments/${postId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const uploadPost = async (post) => {
  try {
    const formData = createFormData(post);
    const response = await axios.post(`${url}/api/v1/post/uploadpost`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getPostByUserId = async (id) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/post/getpostbyuserid/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const likePost = async (postId, userId) => {
  try {
    const response = await axiosInstance.post(`${url}/api/v1/like/likePost`, { post_id: postId, user_id: userId });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const unlikePost = async (postId, userId) => {
  try {
    const response = await axiosInstance.post(`${url}/api/v1/like/unlikePost`, { post_id: postId, user_id: userId });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const createComment = async (userComment, postId, userId) => {
  try {
    const response = await axiosInstance.post(`${url}/api/v1/comments/createComment`, { userComment, postId, userId });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// User-related functions
const registerUser = async (user) => {
  try {
    const formData = createFormData(user);
    const response = await axios.post(`${url}/api/v1/user/registerUser`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const loginUser = async (user) => {
  try {
    const response = await axios.post(`${url}/api/v1/user/loginUser`, user);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const logoutUser = async () => {
  try {
    const response = await axios.post(`${url}/api/v1/user/logout`, {});
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/user/getuser`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const updatePassword = async (password) => {
  try {
    const response = await axiosInstance.post(`${url}/api/v1/user/updatepassword`, password);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/user/getuser/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/user/getalluser`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Follow-related functions
const getFollowers = async (userId) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/follow/getFollowers/${userId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getFollowing = async (userId) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/follow/getFollowing/${userId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const follow = async (followerId, followingId) => {
  try {
    const response = await axiosInstance.post(`${url}/api/v1/follow/handleFollow`, { followerId, followingId });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const unfollow = async (followerId, followingId) => {
  try {
    const response = await axiosInstance.delete(`${url}/api/v1/follow/handleUnfollow`, {
      data: { followerId, followingId },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const countFollowers = async (userId) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/follow/countFollowers/${userId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const countFollowing = async (userId) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/follow/countFollowing/${userId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getFollowingOfCurrentUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/follow/getFollowingOfCurrentUser/${userId}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Chat-related functions
const getChat = async (sender, receiver) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/chat/messages?sender=${sender}&receiver=${receiver}`, {
      sender,
      receiver,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const sendChat = async ({ sender, receiver, content }) => {
  try {
    const response = await axiosInstance.post(`${url}/api/v1/chat/send`, { sender, receiver, content });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getChatUser = async (user) => {
  try {
    const response = await axiosInstance.get(`${url}/api/v1/chat/getChatUser/${user}`, { user });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export {
  getAllPosts,
  getAllComments,
  uploadPost,
  getPostByUserId,
  likePost,
  unlikePost,
  createComment,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updatePassword,
  getUserById,
  getAllUsers,
  getFollowers,
  getFollowing,
  follow,
  unfollow,
  countFollowers,
  countFollowing,
  getFollowingOfCurrentUser,
  getChat,
  sendChat,
  getChatUser,
};
