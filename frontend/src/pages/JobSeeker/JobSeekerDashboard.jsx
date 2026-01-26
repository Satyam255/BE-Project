import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Bookmark,
  FileText,
  Bell,
  TrendingUp,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import Header from "../LandingPage/components/Header";

const stats = [
  { title: "Applied Jobs", value: 12, icon: Briefcase },
  { title: "Saved Jobs", value: 5, icon: Bookmark },
  { title: "Profile Strength", value: "80%", icon: FileText },
  { title: "Notifications", value: 3, icon: Bell },
];

const recommendedJobs = [
  { title: "Frontend Developer", company: "TechCorp", location: "Remote" },
  { title: "React Developer", company: "StartupX", location: "Bangalore" },
  { title: "UI Designer", company: "DesignHub", location: "Mumbai" },
];

const upcomingInterviews = [
  { role: "React Developer", company: "TechCorp", date: "28 Jan 2026" },
  { role: "Frontend Engineer", company: "InnoSoft", date: "02 Feb 2026" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const JobSeekerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <Header />
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back 👋
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Jobs */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Recommended Jobs
          </h2>

          <div className="space-y-4">
            {recommendedJobs.map((job, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>
                <button className="text-sm text-blue-600 font-medium">
                  View
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profile
          </h2>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Complete your profile to improve visibility.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-[80%]" />
            </div>
            <button className="w-full mt-3 py-2 border rounded-lg text-sm">
              Edit Profile
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Applications */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Recent Applications
          </h2>

          <div className="space-y-3">
            {["React Developer", "Frontend Engineer", "UI Designer"].map(
              (job, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-2"
                >
                  <span>{job}</span>
                  <span className="text-sm text-gray-500">
                    Applied
                  </span>
                </div>
              )
            )}
          </div>
        </motion.div>

              {/* Browse Jobs */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl shadow p-6"
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Browse Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Frontend Developer",
              company: "TechCorp",
              location: "Remote",
              type: "Full-Time",
              salary: "6–10 LPA",
            },
            {
              title: "React Engineer",
              company: "StartupX",
              location: "Bangalore",
              type: "Full-Time",
              salary: "8–12 LPA",
            },
            {
              title: "UI/UX Designer",
              company: "DesignHub",
              location: "Mumbai",
              type: "Contract",
              salary: "4–6 LPA",
            },
            {
              title: "Software Intern",
              company: "Innovate Labs",
              location: "Pune",
              type: "Internship",
              salary: "15k/month",
            },
            {
              title: "Backend Developer",
              company: "CloudWorks",
              location: "Remote",
              type: "Full-Time",
              salary: "7–11 LPA",
            },
            {
              title: "Product Engineer",
              company: "BuildNow",
              location: "Hyderabad",
              type: "Full-Time",
              salary: "10–14 LPA",
            },
          ].map((job, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="border rounded-xl p-5 space-y-3"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {job.company}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {job.type}
                </div>
              </div>

              <p className="text-sm font-medium text-gray-800">
                Salary: {job.salary}
              </p>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700">
                  Apply
                </button>
                <button className="flex-1 border text-sm py-2 rounded-lg hover:bg-gray-50">
                  Save
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      </div>
    </div>
  );
};

export default JobSeekerDashboard;
