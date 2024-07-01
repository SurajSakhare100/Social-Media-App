import React from 'react'

function Post() {
    return (
        <div className='card'>
            <div className="card bg-base-300 w-full shadow-xl p-4">
                <div className='flex items-center gap-4 w-full py-2'>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ">
                        <div className="w-10 rounded-full ">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>

                    </div>
                    <div>
                        <h1 className='text-lg'>Avatar</h1>
                        <h3 className='text-sm'>profile</h3>
                    </div>
                </div>
                <figure>
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                        alt="Shoes" 
                    className='rounded-lg'/>
                </figure>
                <div className="card-normal py-2">
                    <h2 className="card-title">Shoes!</h2>
                    <p>
                        If a dog chews shoes whose shoes does he choose?
                        If a dog chews shoes whose shoes does he choose?
                        </p>
                </div>
            </div>
        </div>
    )
}

export default Post