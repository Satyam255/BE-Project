import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

const getTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

export const getEmployerAnalytics = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access Denied" });
        }

        const companyId = req.user._id;

        const now = new Date();
        const last7Days = new Date(now);
        last7Days.setDate(now.getDate() - 7);
        const prev7Days = new Date(now);
        prev7Days.setDate(now.getDate() - 14);

        // Get employer jobs
        const jobs = await Job.find({ company: companyId }).select("_id").lean();
        const jobIds = jobs.map(j => j._id);

        // If no jobs, return empty analytics safely
        if (jobIds.length === 0) {
            return res.json({
                counts: {
                    totalActiveJobs: 0,
                    totalApplications: 0,
                    totalHired: 0,
                    trends: {
                        activeJobs: 0,
                        totalApplicants: 0,
                        totalHired: 0,
                    },
                },
                data: {
                    recentJobs: [],
                    recentApplications: [],
                },
            });
        }

        // ===== COUNTS =====
        const [
            totalActiveJobs,
            totalApplications,
            totalHired,
        ] = await Promise.all([
            Job.countDocuments({ company: companyId, isClosed: false }),
            Application.countDocuments({ job: { $in: jobIds } }),
            Application.countDocuments({ job: { $in: jobIds }, status: "Accepted" }),
        ]);

        // ===== TRENDS =====
        const [
            activeJobsLast7,
            activeJobsPrev7,
            applicationsLast7,
            applicationsPrev7,
            hiredLast7,
            hiredPrev7,
        ] = await Promise.all([
            Job.countDocuments({
                company: companyId,
                isClosed: false,
                createdAt: { $gte: last7Days, $lte: now },
            }),
            Job.countDocuments({
                company: companyId,
                isClosed: false,
                createdAt: { $gte: prev7Days, $lte: last7Days },
            }),
            Application.countDocuments({
                job: { $in: jobIds },
                createdAt: { $gte: last7Days, $lte: now },
            }),
            Application.countDocuments({
                job: { $in: jobIds },
                createdAt: { $gte: prev7Days, $lte: last7Days },
            }),
            Application.countDocuments({
                job: { $in: jobIds },
                status: "Accepted",
                createdAt: { $gte: last7Days, $lte: now },
            }),
            Application.countDocuments({
                job: { $in: jobIds },
                status: "Accepted",
                createdAt: { $gte: prev7Days, $lte: last7Days },
            }),
        ]);

        const activeJobTrend = getTrend(activeJobsLast7, activeJobsPrev7);
        const applicantTrend = getTrend(applicationsLast7, applicationsPrev7);
        const hiredTrend = getTrend(hiredLast7, hiredPrev7);

        // ===== DATA =====
        const recentJobs = await Job.find({ company: companyId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title location type createdAt isClosed");

        const recentApplications = await Application.find({
            job: { $in: jobIds },
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("applicant", "name email avatar")
            .populate("job", "title");

        res.json({
            counts: {
                totalActiveJobs,
                totalApplications,
                totalHired,
                trends: {
                    activeJobs: activeJobTrend,
                    totalApplicants: applicantTrend,
                    totalHired: hiredTrend,
                },
            },
            data: {
                recentJobs,
                recentApplications,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
