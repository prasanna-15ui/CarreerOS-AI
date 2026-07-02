"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { Code, Users, Brain, Cpu, MessageSquare } from "lucide-react";

const interviewTypes = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "System design, architecture, and technology-specific questions.",
    icon: Cpu,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20"
  },
  {
    id: "coding",
    title: "Coding / Algorithms",
    description: "Data structures, algorithms, and live problem-solving.",
    icon: Code,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20"
  },
  {
    id: "hr",
    title: "HR / Behavioral",
    description: "STAR method, cultural fit, and behavioral questions.",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20"
  },
  {
    id: "aptitude",
    title: "Aptitude / Logic",
    description: "Logical reasoning, math, and general problem-solving.",
    icon: Brain,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20"
  }
];

export default function InterviewHubPage() {
  return (
    <PageWrapper className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-white">Mock Interview Simulator</h1>
        </div>
        <p className="text-text-muted max-w-2xl">
          Practice your interview skills with our AI. Select a category below to start a realistic, conversational mock interview complete with real-time feedback and scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {interviewTypes.map((type) => (
          <Link key={type.id} href={`/ai-tools/interview/${type.id}`}>
            <GlassCard className="h-full p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer border border-white/5 hover:border-primary/30">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 transition-transform group-hover:scale-110 ${type.bg} ${type.color}`}>
                <type.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {type.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {type.description}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
