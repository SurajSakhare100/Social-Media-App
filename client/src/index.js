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
});

export const getAllPosts = async (userId) => {
  try {
    const response = await axiosInstance.get(url + `/api/v1/post/getAllPosts`, {
      withCredentials: true,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getAllComments = async (postId) => {
  try {
    const response = await axiosInstance.get(url + `/api/v1/comments/getallcomments/${postId}`, {
      withCredentials: true,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const uploadPost = async (post) => {
  try {
    const formData = new FormData();
    for (const key in post) {
      formData.append(key, post[key]);
    }

    // Log FormData content for debugging
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await axios.post(
      url + "/api/v1/post/uploadpost",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const registerUser = async (user) => {
  try {
    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }

    // Log FormData content for debugging
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await axios.post(
      url + "/api/v1/user/registerUser",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async (user) => {
  try {
    const response = await axios.post(url + "/api/v1/user/loginUser", user, {
      withCredentials: true,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${url}/api/v1/user/logout`,
      {}, // No data payload needed for logout
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(url + "/api/v1/user/getuser", {
      withCredentials: true,
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
export const updatepassword = async (password) => {
  try {
    const response = await axios.post(
      url + "/api/v1/user/updatepassword",
      password,
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(
      url + `/api/v1/user/getuser/${id}`,
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getPostbyuserid = async (id) => {
  try {
    const response = await axios.get(
      url + `/api/v1/post/getpostbyuserid/${id}`,
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const getAllUser = async (id) => {
  try {
    const response = await axios.get(
      url + `/api/v1/user/getalluser`,
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
export const likePost = async (post_id,user_id) => {
  try {
    const response = await axios.post(
      url + `/api/v1/like/likePost`,
      {post_id,user_id},
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
export const unlikePost = async (post_id,user_id) => {
  try {
    const response = await axios.post(
      url + `/api/v1/like/unlikePost`,
      {post_id,user_id},
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const createComment=async (userComment, postId, userId)=>{
  console.log({userComment, postId, userId})
  try {
    const response = await axios.post(
      url + `/api/v1/comments/createComment`,
      {userComment, postId, userId},
      { withCredentials: true }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}


// Fetch followers of a user
export const getFollowers = async (userId) => {
  try {
    const response = await axios.get(`${url}/api/v1/follow/getFollowers/${userId}`, 
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Fetch users followed by a user
export const getFollowing = async (userId) => {
  try {
    const response = await axios.get(`${url}/api/v1/follow/getFollowing/${userId}`, 
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Handle follow action
export const follow = async (followerId, followingId) => {
  try {
    const response = await axios.post(
      `${url}/api/v1/follow/handleFollow`, {
        followerId: followerId,
        followingId: followingId
      },
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Handle unfollow action
export const unfollow = async (followerId, followingId) => {
  try {
    const response = await axios.delete(
      `${url}/api/v1/follow/handleUnfollow`, {
        data: {
          followerId: followerId,
          followingId: followingId
        },
        withCredentials: true,
      }
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


// Count followers of a user
export const countFollowers = async (userId) => {
  try {
    const response = await axios.get(`${url}/api/v1/follow/countFollowers/${userId}`, 
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Count users followed by a user
export const countFollowing = async (userId) => {
  try {
    const response = await axios.get(`${url}/api/v1/follow/countFollowing/${userId}`, 
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Assuming you have an endpoint to get the list of users the current user is following
export const getFollowingOfCurrentUser = async (userId) => {
  try {
    const response = await axios.get(`${url}/api/v1/follow/getFollowingOfCurrentUser/${userId}`,
    { withCredentials: true });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


export const getChat = async (sender, receiver) => {
  try {
    const response = await axios.get(
      `${url}/api/v1/chat/messages?sender=${sender}&receiver=${receiver}`, {
        sender, receiver
      },
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
export const sendChat = async ({sender, receiver,content}) => {
  try {
    console.log(sender, receiver,content)
    const response = await axios.post(
      `${url}/api/v1/chat/send`, {
        sender, receiver,content
      },
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};


export const getChatUser = async (user) => {
  try {
    const response = await axios.get(
      `${url}/api/v1/chat/getChatUser/${user}`, {
        user
      },
      { withCredentials: true },
    );
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};