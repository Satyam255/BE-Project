import React from 'react'
import { Clock } from 'lucide-react'

const ApplicantDashboardCard = ({ applicant, position, time }) => {
    return (
        <div className='flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors'>

            {/* Left side */}
            <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 bg-linear-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center'>
                    <span className='text-white font-medium text-sm'>
                        {applicant.name.split(" ").map(n => n[0]).join("")}
                    </span>
                </div>

                <div>
                    <h4 className='text-[15px] font-medium text-gray-900'>
                        {applicant.name}
                    </h4>
                    <p className='text-sm text-gray-500'>
                        {position}
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className='flex items-center text-sm text-gray-500'>
                <Clock className='h-4 w-4 mr-1' />
                {time}
            </div>
        </div>
    )
}

export default ApplicantDashboardCard
