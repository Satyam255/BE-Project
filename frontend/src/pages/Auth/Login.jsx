import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from "lucide-react";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  })

  // form validation functions

  const validateEmail = (email) => {
    if (!email) return false

    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    // return regex.test(email.trim())
    if(!regex.test(email.trim())) return "Please enter a valid email address."
    return ""
  }


  const validatePassword = (password) => {
    if (!password) return false

    // Minimum 8 characters
    // At least 1 uppercase
    // At least 1 lowercase
    // At least 1 number
    // At least 1 special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    // return regex.test(password)
    if(!regex.test(password)) return "Minimum 8 characters with at least 1 uppercase, lowercase, number and special character."
  }


  // Handle input

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev, [name]: value
    }));

    // clear error when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev, errors: { ...prev.errors, [name]: "" }
      }))
    }
  }

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    }

    // remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    })

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      // login api integration later
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        errors: {
          submit: error.response?.data.message || "Login Failed. Please check your credentials."
        }
      }))
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full'
      >
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
          <p className='text-gray-600'>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>Email Address</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type="email"
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder='Enter your email'
              />
            </div>
            {formState.errors.email && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type={formState.showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder='Enter your password'
              />
              <button
                type='button'
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:gray-600'
              >
                {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>

            {formState.errors.password && (
              <p className='text-red-500 text-sm mt-1 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {formState.errors.submit && (
            <div className='bg-red-50 border-red-200 rounded-lg p-3'>
              <p className='text-red-700 text-sm flex items-center'>
                <AlertCircle className='w-4 h-4 mr-2' />
                {formState.errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={formState.loading}
            className='w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
          >
            {formState.loading ? (
              <>
                <Loader className='w-5 h-5 animate-spin' />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Sign Up Link */}
          <div className='text-center'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <a href='/signup' className='text-blue-600 hover:text-blue-700 font-medium'>Create account</a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login