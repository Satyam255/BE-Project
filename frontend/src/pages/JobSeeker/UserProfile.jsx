import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import Navbar from "../../components/layout/Navbar";
import { Save, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userData = {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    };

    setProfileData(userData);
    setFormData(userData);
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const avatarUrl = imgUploadRes.imageUrl || "";
      handleInputChange(type, avatarUrl);
    } catch (error) {
      console.log("Upload Error:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    handleInputChange(type, previewUrl);
    handleImageUpload(file, type);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setProfileData(formData);
        updateUser(formData);
      }
    } catch (error) {
      console.log("Save Error:", error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    navigate("/find-jobs");
  };

  const DeleteResume = async () => { setSaving(true); try { const response = await axiosInstance.post(API_PATHS.AUTH.DELETE_RESUME, { resumeUrl: user.resume || ""}); if(response.status === 200) { toast.success("Resume Deleted Successfully"); setProfileData({ ...prev, resume: ""}); updateUser({ ...formData, resume: ""}); } } catch (error) { console.log("Error: ", error); } finally { setSaving(false); } };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h1 className="text-2xl font-semibold text-white">
                Profile Settings
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Update your personal details
              </p>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">

              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={formData.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
                  />

                  {uploading.avatar && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">
                    Change 
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "avatar")}
                    className="hidden"
                  />
                  <div className="mt-2 inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                    Upload Image
                  </div>
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>

                <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input type="email" value={formData.email} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"/>
              </div>

              {/* Resume */}
              {user?.resume ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume
                  </label>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Link{" "}
                      <a href={user?.resume} target="_blank" className="text-blue-500 underline cursor-pointer">{user?.resume}</a>
                    </p>
                    <button className="cursor-pointer" onClick={DeleteResume}>
                      <Trash2 className="w-5 h-5 text-red-500"/>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label>
                    <span className="block">Choose File</span>
                    <input type="file" onChange={(e) => handleImageChange(e, "resume")} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:bg-blue-100 transition-colors" />
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading.avatar}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
