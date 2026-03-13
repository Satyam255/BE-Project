import React from 'react'
import { Briefcase } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
            <div className='relative'>
                <div className='animate-spin rounded-full h-16 w-16 border-4 border-blue-700 border-t-blue-100 mx-auto mb-4'>

                </div>
                <div className='absolute inset-0 flex items-center justify-center'>
                    <Briefcase className='w-6 h-6 text-blue-600'/>
                </div>
            </div>
            <p className='text-gray-600 font-medium'>Finding opportunities...</p>
        </div>
    </div>
  )
}

export default LoadingSpinner