"use client";

import { useState, useCallback } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSearch, Loader2, X, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  actionableFeedback: string[];
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription);
      }

      const res = await fetch("/api/ai/resume-analyzer", {
        method: "POST",
        body: formData
      });

      const json = await res.json();
      if (json.success) {
        setResult(json.data);
        toast.success("Analysis complete!");
      } else {
        toast.error(json.error || "Failed to analyze resume");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <PageWrapper className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <FileSearch className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">ATS Resume Analyzer</h1>
        </div>
        <p className="text-text-muted">
          Upload your resume and an optional job description to see how you score against modern ATS systems.
        </p>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">1. Upload Resume (PDF)</h3>
            {!file ? (
              <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDragActive ? "bg-primary/10 border-primary" : "border-white/20 hover:border-primary/50 bg-[#0B0F19]/40"}`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="w-10 h-10 text-primary mb-4" />
                <p className="text-white font-medium text-center mb-1">Click or drag & drop</p>
                <p className="text-text-muted text-sm text-center">PDF files only</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs">PDF</div>
                  <div>
                    <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">2. Target Job Description (Optional)</h3>
            <textarea
              className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-text-muted focus:outline-none focus:border-primary/50 resize-none"
              placeholder="Paste the job description here for a tailored match score..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </GlassCard>
        </div>
      )}

      {!result && (
        <div className="flex justify-end">
          <PrimaryButton onClick={handleAnalyze} disabled={!file || loading} className="w-full md:w-auto text-lg py-4 px-12">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with Gemini...</span>
            ) : (
              "Scan My Resume"
            )}
          </PrimaryButton>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/10 rounded-full border-t-primary animate-spin"></div>
            <FileSearch className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h3 className="text-xl font-medium text-white">AI is reading your resume...</h3>
          <p className="text-text-muted text-sm">Evaluating structure, keywords, and impact.</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
            <button 
              onClick={() => { setResult(null); setFile(null); }}
              className="text-sm text-primary hover:underline"
            >
              Scan Another Resume
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center lg:col-span-1">
              <div className="relative mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                  <circle 
                    cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={351.8} 
                    strokeDashoffset={351.8 - (351.8 * result.score) / 100}
                    className={`${getScoreColor(result.score)} transition-all duration-1000 ease-out`} 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                  <span className="text-xs text-text-muted font-medium">/ 100</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ATS Score</h3>
              <p className="text-sm text-text-muted">
                {result.score >= 80 ? "Excellent! Your resume is highly optimized." : 
                 result.score >= 60 ? "Good, but there's room for improvement." : 
                 "Needs work. Follow the suggestions below."}
              </p>
            </GlassCard>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-5 border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard className="p-5 border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-bold text-white">Weaknesses</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {result.missingKeywords.length > 0 && (
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white">Missing Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/90">
                        {k}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-5">
                <h3 className="font-bold text-white mb-4">Actionable Feedback</h3>
                <ul className="space-y-3">
                  {result.actionableFeedback.map((f, i) => (
                    <li key={i} className="flex gap-3 items-start p-3 bg-black/20 rounded-lg border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">{f}</p>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
