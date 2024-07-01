import React from 'react'

function CreatePost() {
    return (
        <div className='flex flex-col gap-4 justify-center'>
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="What's on your mind" />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                </svg>
            </label>
            <button className="btn" onClick={() => document.getElementById('my_modal_5').showModal()}>Create New Post</button>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <div className="modal-action justify-center">
                        <form method="dialog" className='flex flex-col gap-4' >
                            <h3 className='text-xl'>Add Post image</h3>
                            <label className="input input-bordered flex items-center gap-2">
                            <input type="text" className="grow" placeholder="Write title" />
                            </label>
                            <input
                                type="file"
                                className="file-input file-input-ghost w-full max-w-sm" />
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default CreatePost
