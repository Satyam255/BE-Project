import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";

export default function EmployerAssessmentResult() {
  const { assessmentId, candidateId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BASE_URL}/api/assessments/${assessmentId}/results/${candidateId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setResult(res.data.submission);
      } catch (err) {
        setError(err.response?.data?.message || "Result not found");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [assessmentId, candidateId]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const getPct = (score, total) =>
    total > 0 ? Math.round((score / total) * 100) : 0;

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <div style={styles.spinner} />
          <p style={{ color: "#64748b" }}>Loading result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <div style={styles.errorCard}>
            <p style={{ color: "#fca5a5" }}>{error}</p>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    scores,
    totalMarks,
    isPassed,
    timeTaken,
    assessmentId: assessment,
  } = result;
  const pct = getPct(scores.total, totalMarks);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back button */}
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>

        {/* Candidate info header */}
        <div style={styles.candidateHeader}>
          <div style={styles.candidateAvatar}>
            {result.candidateId?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.candidateName}>
              {result.candidateId?.name || "Candidate"}
            </h2>
            <p style={styles.candidateEmail}>{result.candidateId?.email}</p>
          </div>
          <div
            style={{
              ...styles.resultBadge,
              background: isPassed ? "#022c22" : "#1e0a0a",
              border: `1px solid ${isPassed ? "#065f46" : "#7f1d1d"}`,
              color: isPassed ? "#6ee7b7" : "#fca5a5",
              marginLeft: "auto",
            }}
          >
            {isPassed ? "PASSED" : "FAILED"}
          </div>
        </div>

        {/* Score ring */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            {assessment?.title || "Assessment Result"}
          </h1>
          <div style={styles.scoreRingWrapper}>
            <svg viewBox="0 0 120 120" width="160" height="160">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={isPassed ? "#10b981" : "#ef4444"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
              <text
                x="60"
                y="56"
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="22"
                fontWeight="800"
              >
                {pct}%
              </text>
              <text
                x="60"
                y="74"
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
              >
                {scores.total}/{totalMarks}
              </text>
            </svg>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Completed in{" "}
            <strong style={{ color: "#e2e8f0" }}>
              {formatTime(timeTaken)}
            </strong>
          </p>
        </div>

        {/* Section breakdown */}
        <div style={styles.breakdownRow}>
          {[
            { label: "Aptitude", score: scores.aptitude, color: "#6366f1" },
            { label: "Technical", score: scores.technical, color: "#f59e0b" },
            { label: "Coding", score: scores.coding, color: "#10b981" },
          ].map(({ label, score, color }) => (
            <div key={label} style={styles.breakdownCard}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color,
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: "2rem", fontWeight: 800, color }}>
                {score}
              </span>
              <div
                style={{
                  height: "4px",
                  background: "#1e293b",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "2px",
                    background: color,
                    width: `${Math.min(getPct(score, Math.ceil(totalMarks / 3)), 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* MCQ answer review */}
        {["aptitude", "technical"].map((section) => (
          <div key={section} style={styles.section}>
            <h2 style={styles.sectionTitle}>
              {section.charAt(0).toUpperCase() + section.slice(1)} — Answer
              Review
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {result[`${section}Answers`]?.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    background: a.isCorrect ? "#022c22" : "#1e0a0a",
                    border: `1px solid ${a.isCorrect ? "#065f46" : "#7f1d1d"}`,
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Q{i + 1}
                  </span>
                  <span
                    style={{
                      color: a.isCorrect ? "#6ee7b7" : "#fca5a5",
                      fontSize: "0.8rem",
                    }}
                  >
                    {a.isCorrect ? "✓" : "✕"}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#475569" }}>
                    +{a.marksAwarded}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Coding submissions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Coding — Submissions</h2>
          {result.codingAnswers?.map((a, i) => (
            <div
              key={i}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "0.7rem 1rem",
                  borderBottom: "1px solid #1e293b",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  Problem {i + 1}
                </span>
                <span
                  style={{
                    background: "#1e293b",
                    color: "#64748b",
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {a.language}
                </span>
                <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>
                  {a.marksAwarded} marks awarded
                </span>
                {/* Test results */}
                {a.testResults?.length > 0 && (
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      marginLeft: "auto",
                    }}
                  >
                    {a.testResults.filter((t) => t.passed).length}/
                    {a.testResults.length} tests passed
                  </span>
                )}
              </div>
              <pre
                style={{
                  padding: "1rem",
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  lineHeight: 1.7,
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {a.code || "No code submitted"}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0f1e",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "2rem 1rem 4rem",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "1rem",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #1e293b",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorCard: {
    background: "#1e0a0a",
    border: "1px solid #7f1d1d",
    borderRadius: "12px",
    padding: "2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  container: { maxWidth: "760px", margin: "0 auto" },
  backBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    marginBottom: "1.5rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  candidateHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
  },
  candidateAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#6366f1",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: 800,
    flexShrink: 0,
  },
  candidateName: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#e2e8f0",
    margin: 0,
  },
  candidateEmail: {
    fontSize: "0.82rem",
    color: "#64748b",
    margin: "0.2rem 0 0",
  },
  resultBadge: {
    padding: "5px 18px",
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
  },
  hero: {
    textAlign: "center",
    padding: "1rem 0",
    marginBottom: "2rem",
  },
  heroTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#e2e8f0",
    margin: "0 0 1.5rem",
  },
  scoreRingWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  breakdownRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  breakdownCard: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "10px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  section: { marginBottom: "2rem" },
  sectionTitle: {
    fontSize: "0.78rem",
    color: "#64748b",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "0 0 1rem",
  },
};
