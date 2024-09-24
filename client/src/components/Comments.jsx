import React, { useEffect, useState } from "react";
import { addComment, editComment, deleteComment, fetchComments } from "../app/slices/postSlice.js";
import { useDispatch, useSelector } from "react-redux";

function Comments({ postId, userId, userPicture }) {
  const [userComment, setUserComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts.posts.find(p => p._id === postId)); 
  // Get the specific post
  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [postId, dispatch]);

  const handleComment = (e) => {
    e.preventDefault();
    if (editingCommentId) {
      dispatch(editComment({ postId, commentId: editingCommentId, comment: editingComment }));
      setEditingCommentId(null);
      setEditingComment("");
    } else {
      dispatch(addComment({ postId, userComment }));
      setUserComment(""); // Clear the input field
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  const startEditing = (commentId, comment) => {
    setEditingCommentId(commentId);
    setEditingComment(comment);
  };

  return (
    <div>
      {/* Comments list */}
      <div className="chat chat-start my-2 flex flex-col gap-4">
        {post?.comments ? (
          post.comments[0]?.comments.map((comment) => (
            <div key={comment._id} className={`flex gap-2 ${comment.author === userId ? "self-end" : ""}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Profile" src={comment.userPicture} />
                </div>
              </div>
              <div className="chat-bubble">{comment.comment}</div>
              {comment.author === userId && (
                <div className="flex gap-2">
                  <button onClick={() => startEditing(comment._id, comment.comment)} className="text-sm text-blue-500">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteComment(comment._id)} className="text-sm text-red-500">
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
          <img src={userPicture} alt="User" className="w-full h-full object-cover" />
        </div>
        <form onSubmit={handleComment} className="w-full flex gap-2">
          <input
            id="comment"
            type="text"
            placeholder="Comment your thoughts..."
            value={editingCommentId ? editingComment : userComment}
            onChange={(e) => editingCommentId ? setEditingComment(e.target.value) : setUserComment(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">{editingCommentId ? "Update" : "Comment"}</button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
