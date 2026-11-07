import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';
import { FaFileAlt, FaFilePdf, FaCheckCircle, FaExclamationCircle, FaLightbulb, FaSpinner, FaTrash, FaBriefcase, FaUpload } from 'react-icons/fa';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import DotGridBackground from '../components/DotGridBackground';

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const isPdf = resumeFile && (resumeFile.type === 'application/pdf' || resumeFile.name.toLowerCase().endsWith('.pdf'));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return toast.error("File size must be under 10MB");
      }
      setResumeFile(file);
      if (file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
      setResumeText('');
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setImagePreview(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText && !resumeFile) {
      return toast.error("Please upload a resume (PDF/Image) or paste your resume text.");
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resumeImage", resumeFile);
      } else {
        formData.append("resumeText", resumeText);
      }
      formData.append("jobDescription", jobDescription);

      let response;
      try {
        response = await axios.post(`${serverUrl}/api/ai/analyze-resume`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
      } catch (err1) {
        response = await axios.post(`${serverUrl}/api/ai/resume-analyzer`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
      }

      setResult(response.data);
      toast.success("Resume analysis complete!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171717] flex flex-col justify-between">
      <Nav />
      <div className="pt-28 pb-16 px-4 sm:px-8 flex justify-center relative overflow-hidden flex-1">
        <DotGridBackground />
        <div className="max-w-7xl w-full animate-fade-in flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Left Side: Inputs */}
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-[0_6px_25px_rgba(91,33,182,0.06)]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-[11px] font-black uppercase tracking-wider text-[#5B21B6] mb-3">
                📄 ATS Scanner & Matcher
              </div>
              <h1 className="text-3xl font-black text-[#171717] mb-2 flex items-center gap-3">
                <FaFileAlt className="text-[#5B21B6]" />
                AI Resume Analyzer
              </h1>
              <p className="text-[#666666] mb-6 text-sm font-medium leading-relaxed">
                Upload your resume in <strong>PDF</strong> or image format (or paste plain text) to receive an instant ATS score, missing keywords, and recruiter recommendations.
              </p>

              <div className="space-y-6">
                {/* File Upload Area */}
                {!resumeText && (
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-[#171717] uppercase tracking-wider">
                      Upload Resume (PDF, PNG, JPG)
                    </label>

                    {!resumeFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#DDD6FE] rounded-2xl cursor-pointer hover:border-[#7C3AED] transition-all bg-[#FAFAFC] hover:bg-[#F5F0FF]/50 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                          <FaUpload className="text-3xl text-gray-400 group-hover:text-[#5B21B6] transition-colors mb-2" />
                          <p className="text-sm text-gray-700 font-bold">Click to upload your Resume</p>
                          <p className="text-xs text-gray-400 mt-1">Supports PDF, PNG, JPG (up to 10MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
                      </label>
                    ) : isPdf ? (
                      <div className="relative rounded-2xl border-2 border-[#7C3AED] p-4 bg-[#F5F0FF] flex items-center justify-between">
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-2xl font-bold flex-shrink-0">
                            <FaFilePdf />
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="font-bold text-sm text-[#171717] truncate">{resumeFile.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                          </div>
                        </div>
                        <button type="button" onClick={removeFile} className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ml-3">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-[#7C3AED] group">
                        <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={removeFile} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Text Area */}
                {!resumeFile && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black text-[#171717] uppercase tracking-wider">
                        Or Paste Resume Text
                      </label>
                      {resumeText && (
                        <button type="button" onClick={() => setResumeText('')} className="text-xs text-[#DC2626] hover:text-red-700 font-bold uppercase tracking-wider cursor-pointer">Clear</button>
                      )}
                    </div>
                    <textarea
                      className="w-full bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl p-4 text-[#171717] placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] transition-all h-48 shadow-sm font-medium"
                      placeholder="Or paste your entire resume content here..."
                      value={resumeText}
                      onChange={(e) => {
                        setResumeText(e.target.value);
                        if (e.target.value) removeFile();
                      }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-[#171717] mb-2 uppercase tracking-wider flex items-center gap-2">
                    <FaBriefcase className="text-[#5B21B6]" />
                    Target Job Description (Optional)
                  </label>
                  <textarea
                    className="w-full bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl p-4 text-[#171717] placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] transition-all h-28 shadow-sm font-medium"
                    placeholder="Paste the job description you are targeting for accurate keyword scoring..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold py-4 rounded-2xl transition-all shadow-[0_4px_16px_rgba(91,33,182,0.25)] hover:shadow-[0_6px_22px_rgba(91,33,182,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
                      Analyzing with AI...
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="lg:w-1/2 space-y-6">
            {!result && !loading && (
              <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-[#EEEEF2] h-full min-h-[460px] flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-[#F5F0FF] rounded-2xl flex items-center justify-center text-[#5B21B6] text-3xl mb-4">
                  <FaFileAlt />
                </div>
                <p className="text-xl font-bold text-[#171717]">Awaiting Resume</p>
                <p className="text-sm mt-2 text-[#666666] max-w-sm">
                  Upload your PDF or image resume on the left and click Analyze to review your ATS score and feedback.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white p-12 rounded-3xl border border-[#EEEEF2] h-full min-h-[460px] flex flex-col items-center justify-center shadow-md">
                <FaSpinner className="animate-spin text-[#5B21B6] text-5xl mb-4" />
                <p className="text-[#171717] font-bold text-lg">AI is evaluating your resume...</p>
                <p className="text-xs text-gray-500 mt-1">Checking ATS compliance, keyword relevance, and formatting</p>
              </div>
            )}

            {result && !loading && (
              <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] space-y-6 animate-fade-in relative overflow-hidden h-fit shadow-md">
                
                {/* Score Section */}
                <div className="text-center pb-6 border-b border-[#EEEEF2]">
                  <h2 className="text-xs font-black text-[#5B21B6] uppercase tracking-wider mb-4">ATS Match Score</h2>
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-[#F5F0FF] bg-white relative shadow-sm">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-100 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      />
                      <circle
                        className={`${result.score >= 80 ? 'text-[#16A34A]' : result.score >= 50 ? 'text-[#FC8019]' : 'text-[#DC2626]'} stroke-current transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (result.score || 0) / 100)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-black text-[#171717]">{result.score || 0}</span>
                      <span className="text-xs text-gray-500 font-bold">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600" /> Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.strengths?.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                        <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-emerald-950">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-red-800 uppercase tracking-wider flex items-center gap-2">
                    <FaExclamationCircle className="text-red-600" /> Missing Keywords & Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {result.weaknesses?.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-red-50/70 p-3.5 rounded-xl border border-red-200">
                        <FaExclamationCircle className="text-red-600 mt-1 flex-shrink-0 text-sm" />
                        <span className="text-xs sm:text-sm font-medium text-red-950">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-2">
                    <FaLightbulb className="text-amber-600" /> Actionable Recruiter Tips
                  </h3>
                  <ul className="space-y-2">
                    {result.tips?.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm font-medium text-amber-950">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ResumeAnalyzer;
