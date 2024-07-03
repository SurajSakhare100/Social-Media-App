import React from 'react'

function SkeletonPost() {
  return (
    <div className="flex w-full flex-col gap-4 mt-6">
    <div className="skeleton h-56 w-full"></div>
    <div className="skeleton h-4 w-28"></div>
    <div className="skeleton h-4 w-full"></div>
    <div className="skeleton h-4 w-full"></div>
    <div>
      
    </div>
</div>
  )
}

export default SkeletonPost