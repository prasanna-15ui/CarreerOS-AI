"use client";

import { useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Loader2, Route, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RoadmapResult {
  summary: string;
  phases: {
    title: string;
    focus: string;
    actionItems: string[];
  }[];
  finalAdvice: string;
}

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [formData, setFormData] = useState({
    currentRole: "",
    targetRole: "",
    timeline: "6 months",
    commitment: "10 hours/week"
  });

  const handleGenerate = async () => {
    if (!formData.currentRole || !formData.targetRole) {
      toast.error("Please fill in your current and target roles.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (json.success) {
        setResult(json.data);
        toast.success("Roadmap generated!");
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Route className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">Career Roadmap Generator</h1>
        </div>
        <p className="text-text-muted">
          Tell AI where you are and where you want to be, and it will build a step-by-step curriculum to get you there.
        </p>
      </div>

      {!result && !loading && (
        <GlassCard className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Current Role or Situation</label>
              <input 
                type="text" 
                placeholder="e.g. Frontend Developer, Computer Science Student"
                value={formData.currentRole}
                onChange={e => setFormData({...formData, currentRole: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Target Role</label>
              <input 
                type="text" 
                placeholder="e.g. Full Stack Engineer, Product Manager"
                value={formData.targetRole}
                onChange={e => setFormData({...formData, targetRole: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Target Timeline</label>
              <select 
                value={formData.timeline}
                onChange={e => setFormData({...formData, timeline: e.target.value})}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
              >
                <option value="3 months">3 Months (Aggressive)</option>
                <option value="6 months">6 Months (Standard)</option>
                <option value="12 months">12 Months (Steady)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Weekly Commitment</label>
              <select 
                value={formData.commitment}
                onChange={e => setFormData({...formData, commitment: e.target.value})}
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
              >
                <option value="5 hours/week">5 hours/week</option>
                <option value="10 hours/week">10 hours/week</option>
                <option value="20 hours/week">20 hours/week</option>
                <option value="40 hours/week">40 hours/week (Full-time)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <PrimaryButton onClick={handleGenerate} className="px-8 py-3 w-full md:w-auto text-lg">
              Generate Roadmap
            </PrimaryButton>
          </div>
        </GlassCard>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 border-4 border-white/10 rounded-full border-t-amber-400 animate-spin"></div>
          <h3 className="text-xl font-medium text-white">Mapping your journey...</h3>
          <p className="text-text-muted text-sm">Gemini is designing a custom curriculum for you.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
                {formData.currentRole}
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted" />
              <div className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-primary font-medium">
                {formData.targetRole}
              </div>
            </div>
            <button 
              onClick={() => setResult(null)}
              className="text-sm text-text-muted hover:text-white underline"
            >
              Start Over
            </button>
          </div>

          <GlassCard className="p-6 bg-primary/5 border-primary/20">
            <p className="text-white/90 leading-relaxed text-lg">{result.summary}</p>
          </GlassCard>

          <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 space-y-12 pb-8">
            {result.phases.map((phase, idx) => (
              <div key={idx} className="relative pl-8 md:pl-10">
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#0B0F19] border-2 border-primary flex items-center justify-center text-primary font-bold text-sm">
                  {idx + 1}
                </div>
                <GlassCard className="p-6 border-l-4 border-l-primary hover:bg-white/5 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
                  <p className="text-primary font-medium mb-4 text-sm uppercase tracking-wider">{phase.focus}</p>
                  <ul className="space-y-3">
                    {phase.actionItems.map((item, i) => (
                      <li key={i} className="flex gap-3 text-white/80">
                        <CheckCircle2 className="w-5 h-5 text-white/20 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            ))}
          </div>

          <div className="p-6 bg-black/30 border border-white/10 rounded-2xl text-center max-w-2xl mx-auto">
            <h4 className="text-white font-bold mb-2">Final Advice</h4>
            <p className="text-text-muted italic">"{result.finalAdvice}"</p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
