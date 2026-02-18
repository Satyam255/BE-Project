import { AlertCircle } from 'lucide-react'
import React from 'react'

const SelectField = ({ id, value, onChange, label, options, placeHolder, error, required=false, disabled=false, icon:Icon}) => {
  return (
    <div className='space-y-2'>
        <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
            {label}
            {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        <div className='relative'>
            {Icon && (
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                    <Icon className="w-5 h-5 text-gray-400"/>
                </div>
            )}
            <select
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`-w-full ${
                    Icon ? "pl-10" : "pl-3"
                } pr-10 py-2.5 border rounded-lg text-base transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 ${
                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-20 appearance-none bg-white`}
            >
                <option value="">{placeHolder}</option>
                {options.map((option) => (
                    <option value={option.value} key={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                <svg 
                    className='h-5 w-5 text-gray-400'
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule='evenodd'
                        d="M5.293 7.293al 1 0 011.41 0L10 10.586L3.293-3.293a1 1 0 111.41 1.414l-4 a1 1 0 01-1.41 0l-4-4a1 1 0 010-1.414z"
                        clipRule={"evenodd"}
                    />
                </svg>
            </div>
        </div>
        {error && (
            <div className='flex items-center space-x-1 text-sm text-red-600'>
                <AlertCircle className='h-4 w-4'/>
                <span>{error}</span>
            </div>
        )}
    </div>
  )
}

export default SelectField