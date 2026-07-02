"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { Bot, FileSearch, FileSignature, Route, Target, BrainCircuit, Mic } from "lucide-react";

const aiTools = [
  {
    title: "AI Mock Interview",
    description: "Practice technical, HR, or coding interviews with real-time feedback and scoring.",
    icon: Mic,
    href: "/ai-tools/interview",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20"
  },
  {
    title: "ATS Resume Analyzer",
    description: "Upload your resume and a job description to get an ATS compatibility score and actionable suggestions.",
    icon: FileSearch,
    href: "/ai-tools/resume-analyzer",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20"
  },
  {
    title: "Resume Builder",
    description: "Generate a beautiful, ATS-friendly PDF resume using your profile data.",
    icon: FileSignature,
    href: "/ai-tools/resume-builder",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20"
  },
  {
    title: "Career Roadmap Generator",
    description: "Create a personalized, step-by-step timeline to reach your target career role.",
    icon: Route,
    href: "/ai-tools/roadmap",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20"
  },
  {
    title: "Job Matcher",
    description: "Compare your skills against a target role to identify gaps and get tailored recommendations.",
    icon: Target,
    href: "/ai-tools/job-matcher",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20"
  }
];

export default function AIToolsHubPage() {
  return (
    <PageWrapper className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">AI Career Hub</h1>
        </div>
        <p className="text-text-muted max-w-2xl">
          Supercharge your career progression with our suite of AI-powered tools. From perfecting your resume to mastering interviews, Gemini AI is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiTools.map((tool, idx) => (
          <Link key={idx} href={tool.href}>
            <GlassCard className="h-full p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer border border-white/5 hover:border-primary/30">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 transition-transform group-hover:scale-110 ${tool.bg} ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {tool.description}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
