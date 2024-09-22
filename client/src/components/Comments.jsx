import React, { useEffect, useState } from "react";
import { getAllComments } from "../index.js"; // remove unused imports if not needed
import { addComment, editComment, deleteComment, fetchComments } from "../app/slices/postSlice.js";
import { useDispatch, useSelector } from "react-redux";

function Comments({ postId, userId, userPicture }) {
  const [userComment, setUserComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  // const [comments, setc] = useState("");
  const dispatch = useDispatch();
  const posts=useSelector((state)=>state.posts.posts)

  // Fetch comments on component mount or when postId changes
  useEffect(() => {
    const fetchCommentsData = async () => {
      try {
        dispatch(fetchComments(postId));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentsData();
  }, [postId, dispatch]);

  // Handle adding or updating a comment
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      if (editingCommentId) {
        // Update existing comment
        dispatch(editComment({ postId, commentId: editingCommentId, comment: editingComment }));
        setEditingCommentId(null);
        setEditingComment("");
      } else {
        // Create new comment
        dispatch(addComment({ postId,userComment }));
        setUserComment(""); // Clear the input field after submission
      }

      // Refresh comments after adding/updating
      dispatch(fetchComments(postId));
    } catch (error) {
      console.error("Error creating/updating comment:", error);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      dispatch(deleteComment({ postId, commentId }));
      dispatch(fetchComments(postId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Set comment for editing
  const startEditing = (commentId, comment) => {
    setEditingCommentId(commentId);
    setEditingComment(comment);
  };

  console.log(posts)
  return (
    <div>
      {/* Comments list */}
      <div className="chat chat-start my-2 flex flex-col gap-4">
        {posts?.length > 0 ? (
          posts.map((comment) => (
            <div
              key={comment._id}
              className={`flex gap-2 ${comment.author === userId ? "self-end" : ""}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Profile" src={comment.userPicture} />
                </div>
              </div>
              <div className="chat-bubble">
                {comment.comment}
              </div>
              {comment.author === userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(comment._id, comment.comment)}
                    className="text-sm text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-sm text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No comments yet</div>
        )}
      </div>

      {/* Comment form */}
      <div className="flex gap-2 w-full mt-4 items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={userPicture}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 flex flex-row items-center justify-center flex-grow">
          <form onSubmit={handleComment} className="w-full flex gap-2">
            <input
              id="comment"
              name="comment"
              type="text"
              placeholder="Comment your thoughts..."
              value={editingCommentId ? editingComment : userComment}
              onChange={(e) =>
                editingCommentId
                  ? setEditingComment(e.target.value)
                  : setUserComment(e.target.value)
              }
              className="pl-2 rounded-md border-0 text-sm py-2 w-full text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
            />
            <button type="submit" className="btn btn-primary">
              {editingCommentId ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comments;
