import React from 'react'
import CreatePost from '../components/CreatePost'
import SkeletonPost from '../components/SkeletonPost'
import Post from '../components/Post'
import Suggestion from '../components/Suggestion'

function Home() {
    
    return (
        <div className='grid grid-cols-3 mt-6'>
            <div className='px-20 '>
                <Suggestion/>
            </div>
            <div className='flex flex-col gap-8'>
                <CreatePost />
                {/* <SkeletonPost/>
                <SkeletonPost/> */}
                <Post/>
            </div>
            <div className='px-20 '>
                {/* <Post /> */}
            </div>
        </div>
    )
}

export default Home