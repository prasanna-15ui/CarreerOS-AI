"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Loader2, Target, Check, X, Code2 } from "lucide-react";
import { toast } from "sonner";

interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedProjects: {
    name: string;
    description: string;
  }[];
}

export default function JobMatcherPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [formData, setFormData] = useState({
    skills: "",
    targetRole: ""
  });

  const handleMatch = async () => {
    if (!formData.skills || !formData.targetRole) {
      toast.error("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/job-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (json.success) {
        setResult(json.data);
        toast.success("Analysis complete!");
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to analyze skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">AI Job Matcher</h1>
        </div>
        <p className="text-text-muted">
          Compare your current skill set against a target job description to identify missing skills and get project recommendations.
        </p>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Your Current Skills</h3>
            <textarea 
              placeholder="e.g. JavaScript, React, Node.js, SQL, basic Python..."
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
              className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-text-muted outline-none focus:border-primary/50 resize-none"
            />
          </GlassCard>
          
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Target Job Description</h3>
            <textarea 
              placeholder="Paste the full job description or requirements here..."
              value={formData.targetRole}
              onChange={e => setFormData({...formData, targetRole: e.target.value})}
              className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-text-muted outline-none focus:border-primary/50 resize-none"
            />
          </GlassCard>

          <div className="col-span-1 md:col-span-2 flex justify-end">
            <PrimaryButton onClick={handleMatch} className="px-8 py-3 text-lg w-full md:w-auto">
              Analyze Match
            </PrimaryButton>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 border-4 border-white/10 rounded-full border-t-rose-400 animate-spin"></div>
          <h3 className="text-xl font-medium text-white">Analyzing Gap...</h3>
          <p className="text-text-muted text-sm">Matching your skills against industry requirements.</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Skill Gap Analysis</h2>
            <button onClick={() => setResult(null)} className="text-sm text-primary hover:underline">
              Analyze Another Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold text-white mb-2">{result.matchScore}%</div>
              <p className="text-text-muted font-medium uppercase tracking-wider text-sm">Match Score</p>
            </GlassCard>

            <GlassCard className="p-6 md:col-span-2 border-emerald-500/20 bg-emerald-500/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map(s => (
                  <span key={s} className="px-3 py-1 bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 rounded-full text-sm">
                    {s}
                  </span>
                ))}
                {result.matchedSkills.length === 0 && <span className="text-text-muted text-sm">No direct skill matches found.</span>}
              </div>
            </GlassCard>

            <GlassCard className="p-6 md:col-span-3 border-rose-500/20 bg-rose-500/5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-rose-400" />
                Missing Skills (To Learn)
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map(s => (
                  <span key={s} className="px-3 py-1 bg-rose-400/10 text-rose-300 border border-rose-400/20 rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-4">Recommended Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.recommendedProjects.map((proj, i) => (
              <GlassCard key={i} className="p-6 hover:bg-white/5 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{proj.name}</h4>
                <p className="text-sm text-text-muted leading-relaxed">{proj.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
