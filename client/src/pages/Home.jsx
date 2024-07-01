import React from 'react'
import CreatePost from '../components/CreatePost'
import SkeletonPost from '../components/SkeletonPost'
import Post from '../components/Post'

function Home() {
    return (
        <div className='grid grid-cols-3 mt-6'>
            <div className='px-20 '>
                <Post />
            </div>
            <div className='flex flex-col gap-8'>
                <CreatePost />
                {/* <SkeletonPost/>
                <SkeletonPost/> */}
                <Post/>
                <Post/>
                <Post/>
            </div>
            <div className='px-20 '>
                <Post />
            </div>
        </div>
    )
}

export default Home