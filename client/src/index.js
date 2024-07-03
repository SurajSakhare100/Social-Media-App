import axios from "axios";
const url ='http://localhost:3000';
const handleResponse = (res) => res.data.data;
const handleError = (err) => {
  console.error(err.message);
  return null;
};
const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getAllPosts = async (ids) => {
    try {
      const response = await axiosInstance.get(url+
        "/api/v1/post/getAllPosts",
      );
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
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.post(
      url + "/api/v1/post/uploadpost",
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
