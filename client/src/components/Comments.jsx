import React, { useEffect, useState } from "react";
import { getAllComments } from "..";

function Comments({ id }) {
  const [comments, setComments] = useState(null);
  const postid = id;
  useEffect(() => {
    const fetchData = async (id) => {
      const data = await getAllComments(postid);
      setComments(data);
    }
    fetchData();
  }, [])
  console.log(comments)

  return (
    <div>
      <div className="chat chat-start my-2">

        {comments?.map((comment) => ((
          <>
            <div className="chat-image avatar" key={comment._id}>
              <div className="w-10 rounded-full">
                {/* <img
                  alt="Tailwind CSS chat bubble component"
                  src={comment.users[0].profilePicture}
                /> */}
              </div>
            </div>
            <div className="chat-bubble ">
              {comment.comments[0].comment}
            </div></>
        )))}
      </div>
    </div>
  );
}

export default Comments;
