import React from 'react'

export default function LoadingImage() {
    return (
        <div className='flex items-center justify-center w-full py-3 h-full'>
            <div className="bg-gray-200 rounded-lg p-4 shadow-lg space-y-3 w-full h-full animate-pulse">
                <div className="w-full h-96 rounded animate-pulse"></div>
            </div>
        </div>
    )
}
