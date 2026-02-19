import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProfileDropdown = ({
    isOpen,
    onToggle,
    avatar,
    companyName,
    email,
    onLogout,
    userRole   // ✅ ADD THIS PROP
}) => {

    const navigate = useNavigate();

    const handleViewProfile = () => {
        if (userRole === "jobseeker") {
            navigate("/profile");
        } else {
            navigate("/company-profile");
        }
    };

    return (
        <div className='relative'>
            <button
                onClick={onToggle}
                className='flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200'
            >
                {avatar ? (
                    <img
                        src={avatar}
                        alt="Avatar"
                        className='h-9 w-9 object-cover rounded-xl'
                    />
                ) : (
                    <div className='h-8 w-8 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center'>
                        <span className='text-sm font-semibold text-white'>
                            {companyName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                <div className='hidden sm:block text-left'>
                    <p className='text-sm font-semibold text-gray-900'>{companyName}</p>
                    <p className='text-xs text-gray-500'>{userRole?.toUpperCase()}</p>
                </div>

                <ChevronDown className='h-4 w-4 text-gray-400' />
            </button>

            {isOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50'>
                    <div className='px-4 py-3 border-b border-gray-100'>
                        <p className='text-sm font-bold text-gray-700'>{companyName}</p>
                        <p className='text-xs text-gray-500'>{email}</p>
                    </div>

                    {/* ✅ FIXED CLICK HANDLER */}
                    <button
                        onClick={handleViewProfile}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                    >
                        View Profile
                    </button>

                    <div className='border-t border-gray-100 mt-2 pt-2'>
                        <button
                            onClick={onLogout}
                            className='w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors'
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown;
