import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';
import { FaFileAlt, FaCheckCircle, FaExclamationCircle, FaLightbulb, FaSpinner, FaTrash, FaBriefcase, FaImage } from 'react-icons/fa';

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeImage, setResumeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("File size must be under 5MB");
      }
      setResumeImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResumeText('');
    }
  };

  const removeImage = () => {
    setResumeImage(null);
    setImagePreview(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText && !resumeImage) {
      return toast.error("Please provide resume text or upload an image.");
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (resumeImage) {
        formData.append("resumeImage", resumeImage);
      } else {
        formData.append("resumeText", resumeText);
      }
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(`${serverUrl}/api/ai/analyze-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      setResult(response.data);
      toast.success("Resume analysis complete!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 flex justify-center bg-[#FAFAFC] text-[#171717]">
      <div className="max-w-7xl w-full animate-fade-in flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Inputs */}
        <div className="lg:w-1/2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] shadow-[0_6px_25px_rgba(91,33,182,0.06)]">
            <h1 className="text-3xl font-black text-[#171717] mb-2 flex items-center gap-3">
              <FaFileAlt className="text-[#5B21B6]" />
              AI Resume Analyzer
            </h1>
            <p className="text-[#666666] mb-8 text-sm font-medium">
              Upload an image of your resume or paste the text to get an ATS match score and actionable feedback.
            </p>

            <div className="space-y-6">
              {/* Image Upload Area */}
              {!resumeText && (
                <div className="space-y-2">
                  <label className="block text-xs font-black text-[#171717] mb-2 uppercase tracking-wider">
                    Upload Resume Image
                  </label>
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#EEEEF2] rounded-2xl cursor-pointer hover:border-[#7C3AED] transition-all bg-[#FAFAFC] hover:bg-white group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaImage className="text-3xl text-gray-400 group-hover:text-[#5B21B6] transition-colors mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Click to upload (JPG, PNG)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-[#7C3AED] group">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={removeImage} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Text Area */}
              {!resumeImage && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-[#171717] uppercase tracking-wider">
                      Paste Resume Text
                    </label>
                    {resumeText && (
                      <button onClick={() => setResumeText('')} className="text-xs text-[#DC2626] hover:text-red-700 font-bold uppercase tracking-wider">Clear</button>
                    )}
                  </div>
                  <textarea
                    className="w-full bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl p-4 text-[#171717] placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] transition-all h-64 shadow-sm font-medium"
                    placeholder="Or paste your entire resume content here..."
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      if (e.target.value) removeImage();
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
                  className="w-full bg-[#FAFAFC] border border-[#EEEEF2] rounded-2xl p-4 text-[#171717] placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] transition-all h-32 shadow-sm font-medium"
                  placeholder="Paste the job description you are applying for..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold py-4 rounded-2xl transition-all shadow-[0_4px_16px_rgba(91,33,182,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    Analyzing...
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
            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-[#EEEEF2] h-full flex flex-col items-center justify-center text-center text-gray-400 shadow-sm">
              <FaFileAlt className="text-6xl mb-4 text-[#DDD6FE]" />
              <p className="text-xl font-bold text-[#171717]">Awaiting Resume</p>
              <p className="text-sm mt-2 text-[#666666]">Your analysis results will appear here</p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] h-full flex flex-col items-center justify-center shadow-md">
              <FaSpinner className="animate-spin text-[#5B21B6] text-5xl mb-4" />
              <p className="text-[#171717] font-bold animate-pulse text-lg">Our AI is reviewing your resume...</p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white p-8 rounded-3xl border border-[#EEEEF2] space-y-8 animate-fade-in relative overflow-hidden h-fit shadow-md">
              
              {/* Score Section */}
              <div className="text-center pb-8 border-b border-[#EEEEF2] relative z-10">
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
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-black text-[#171717]">{result.score}</span>
                    <span className="text-xs text-gray-500 font-bold">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths?.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                      <FaCheckCircle className="text-emerald-600 mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium text-emerald-950">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider flex items-center gap-2">
                  <FaExclamationCircle className="text-red-600" /> Missing Keywords & Weaknesses
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses?.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-red-50/70 p-3.5 rounded-xl border border-red-200">
                      <FaExclamationCircle className="text-red-600 mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium text-red-950">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                  <FaLightbulb className="text-amber-600" /> Actionable Tips
                </h3>
                <ul className="space-y-2">
                  {result.tips?.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm font-medium text-amber-950">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResumeAnalyzer;
