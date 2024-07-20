import React from 'react'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'
import Suggestion from '../components/Suggestion'

function Home() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 mt-6 px-20 gap-6'>
            <div className='hidden md:block'>
                <Suggestion />
            </div>
            <div className='flex flex-col gap-8 col-span-2 md:col-span-1'>
                <CreatePost />
                {/* <SkeletonPost/>
                <SkeletonPost/> */}
                <Post />
            </div>
            <div className='hidden md:block'>
                {/* <Post /> */}
            </div>
        </div>
    )
}

export default Home
