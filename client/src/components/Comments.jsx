import React, { useEffect, useState } from "react";
import { getAllComments, createComment, updateComment, deleteComment } from "../index.js";

function Comments({ postId, userId, userPicture }) {
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getAllComments(postId);
        setComments(data[0]?.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      if (editingCommentId) {
        await updateComment(editingCommentId, editingComment);
        setEditingCommentId(null);
        setEditingComment("");
      } else {
        await createComment(userComment, postId, userId);
        setUserComment(""); // Clear the input field after submission
      }
      const data = await getAllComments(postId); // Refresh comments after adding/updating
      setComments(data[0]?.comments || []);
    } catch (error) {
      console.error("Error creating/updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      const data = await getAllComments(postId); // Refresh comments after deleting
      setComments(data[0]?.comments || []);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const startEditing = (commentId, comment) => {
    setEditingCommentId(commentId);
    setEditingComment(comment);
  };

  return (
    <div>
      <div className="chat chat-start my-2 flex flex-col gap-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
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
                  <button onClick={() => startEditing(comment._id, comment.comment)}>Edit</button>
                  <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No comments yet</div>
        )}
      </div>

      <div className="flex gap-2 w-full mt-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={userPicture}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 flex-grow">
          <form onSubmit={handleComment}>
            <input
              id="comment"
              name="comment"
              type="text"
              placeholder="Comment your thought"
              value={editingCommentId ? editingComment : userComment}
              onChange={(e) => editingCommentId ? setEditingComment(e.target.value) : setUserComment(e.target.value)}
              className="pl-2 block w-full rounded-md border-0 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
            <button type="submit">
              {editingCommentId ? "Update Comment" : "Add Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comments;
