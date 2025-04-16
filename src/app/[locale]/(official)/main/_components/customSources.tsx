import Image from 'next/image'
import React from 'react'

export default function CustomSources({ title, desc }: { title: string, desc: string }) {
    return (
        <div className='flex gap-3 p-3'>
            <Image src="/logo/logo.svg" width={20} height={20} alt="Logo" className="h-8 w-8" />
            <div className='flex flex-col items-start'>
                <h1 className="text-md font-semibold text-gray-800 dark:text-gray-200">{title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
        </div>
    )
}
