import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Building2, Edit3, Mail } from 'lucide-react'
import amazonLogo from "../../assets/Amazon logo.png"
import uploadImage from '../../utils/uploadImage'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import EditProfileDetails from './EditProfileDetails'

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "",
    companyName: "",
    companyDescription: "",
    companyLogo: "",
  })

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ ...profileData })
  const [uploading, setUploading] = useState({ avatar: false, logo: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
      }

      setProfileData(data)
      setFormData(data)
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }))

    try {
      const imgUploadRes = await uploadImage(file)
      const imageUrl = imgUploadRes.imageUrl || ""

      const field = type === "avatar" ? "avatar" : "companyLogo"
      handleInputChange(field, imageUrl)
    } catch (error) {
      console.log("Image upload failed: ", error)
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]

    if (file) {
      const previewUrl = URL.createObjectURL(file)
      const field = type === "avatar" ? "avatar" : "companyLogo"
      handleInputChange(field, previewUrl)

      handleImageUpload(file, type)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      )

      if (response.status === 200) {
        toast.success("Profile Details Updated Successfully")

        setProfileData({ ...formData })
        updateUser({ ...formData })
        setEditMode(false)
      }
    } catch (error) {
      console.log("Profile update failed: ", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({ ...profileData })
    setEditMode(false)
  }

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    )
  }

  return (
    <DashboardLayout activeMenu={"company-profile"}>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center rounded-t-2xl shadow-md">
            <h1 className="text-xl font-semibold text-white">
              Employer Profile
            </h1>

            <button
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
              onClick={() => setEditMode(true)}
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Content Card */}
          <div className="bg-white p-10 rounded-b-2xl shadow-md">

            {/* Top Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
                  Personal Information
                </h2>

                <div className="flex items-center space-x-5">
                  <img
                    src={profileData.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
                  />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profileData.name || "No Name"}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{profileData.email || "No Email"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
                  Company Information
                </h2>

                <div className="flex items-center space-x-5">
                  <img
                    src={profileData.companyLogo || amazonLogo}
                    alt="Company Logo"
                    className="w-24 h-24 rounded-xl object-contain bg-white p-2 border-4 border-blue-100 shadow-sm"
                  />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {profileData.companyName || "No Company Name"}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>Company Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width About Company */}
            {profileData.companyDescription && (
              <div className="mt-12 border-t pt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  About Company
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed max-w-4xl">
                  {profileData.companyDescription}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerProfilePage
