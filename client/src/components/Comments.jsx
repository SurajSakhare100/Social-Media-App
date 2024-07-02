import React from "react";

function Comments() {
  return (
    <div>
      <div className="chat chat-start my-2">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <div className="chat-bubble ">
          It was said that you would, not join them.
        </div>
      </div>
    </div>
  );
}

export default Comments;
