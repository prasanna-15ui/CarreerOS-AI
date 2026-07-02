"use client";

import { useState, useRef } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FileSignature, Download, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ResumeBuilderPage() {
  const [loading, setLoading] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    summary: "Dedicated software engineer with 5 years of experience building scalable web applications.",
    experience: [
      { id: 1, title: "Senior Developer", company: "Tech Corp", date: "2020 - Present", description: "Led a team of 5 engineers to rebuild the core architecture, reducing latency by 40%." }
    ],
    education: [
      { id: 1, school: "State University", degree: "B.S. Computer Science", date: "2015 - 2019" }
    ],
    skills: "JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL"
  });

  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) return;
    setLoading(true);

    try {
      // Dynamic import to avoid SSR issues with html2pdf
      const html2pdf = (await import("html2pdf.js")).default;
      
      const element = resumeRef.current;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number], // top, left, bottom, right
        filename: `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      } as any;

      await html2pdf().set(opt).from(element).save();
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { id: Date.now(), title: "", company: "", date: "", description: "" }]
    });
  };

  const removeExperience = (id: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(e => e.id !== id)
    });
  };

  return (
    <PageWrapper className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileSignature className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
          </div>
          <p className="text-text-muted">Generate a clean, ATS-optimized PDF resume instantly.</p>
        </div>
        <PrimaryButton onClick={handleDownloadPdf} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download PDF
        </PrimaryButton>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Editor Pane */}
        <GlassCard className="p-6 overflow-y-auto space-y-6 h-[calc(100vh-220px)] custom-scrollbar">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Full Name</label>
              <input 
                type="text" 
                value={resumeData.name} 
                onChange={e => setResumeData({...resumeData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Email</label>
              <input 
                type="email" 
                value={resumeData.email} 
                onChange={e => setResumeData({...resumeData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">Phone</label>
              <input 
                type="text" 
                value={resumeData.phone} 
                onChange={e => setResumeData({...resumeData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-muted">LinkedIn / Website</label>
              <input 
                type="text" 
                value={resumeData.linkedin} 
                onChange={e => setResumeData({...resumeData, linkedin: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs text-text-muted">Professional Summary</label>
              <textarea 
                value={resumeData.summary} 
                onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-2 pt-4">
            <h2 className="text-xl font-bold text-white">Experience</h2>
            <button onClick={addExperience} className="text-xs text-primary flex items-center gap-1 hover:underline">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-black/20 rounded-xl border border-white/5 relative group">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-3 mb-3 pr-6">
                  <input placeholder="Job Title" value={exp.title} onChange={e => {
                    const newExp = [...resumeData.experience];
                    newExp[index].title = e.target.value;
                    setResumeData({...resumeData, experience: newExp});
                  }} className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm outline-none focus:border-primary" />
                  <input placeholder="Company" value={exp.company} onChange={e => {
                    const newExp = [...resumeData.experience];
                    newExp[index].company = e.target.value;
                    setResumeData({...resumeData, experience: newExp});
                  }} className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm outline-none focus:border-primary" />
                  <input placeholder="Date (e.g. 2020 - 2023)" value={exp.date} onChange={e => {
                    const newExp = [...resumeData.experience];
                    newExp[index].date = e.target.value;
                    setResumeData({...resumeData, experience: newExp});
                  }} className="col-span-2 w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm outline-none focus:border-primary" />
                  <textarea placeholder="Description (bullet points recommended)" value={exp.description} rows={3} onChange={e => {
                    const newExp = [...resumeData.experience];
                    newExp[index].description = e.target.value;
                    setResumeData({...resumeData, experience: newExp});
                  }} className="col-span-2 w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm outline-none focus:border-primary resize-none" />
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2 pt-4">Skills</h2>
          <textarea 
            value={resumeData.skills} 
            onChange={e => setResumeData({...resumeData, skills: e.target.value})}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary resize-none"
            placeholder="Comma separated skills..."
          />
        </GlassCard>

        {/* Preview Pane */}
        <div className="bg-neutral-200 rounded-2xl overflow-y-auto h-[calc(100vh-220px)] flex justify-center p-4 md:p-8 custom-scrollbar shadow-inner">
          <div 
            ref={resumeRef}
            className="bg-white w-full max-w-[8.5in] min-h-[11in] shadow-2xl p-10 text-black font-sans shrink-0"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-neutral-800 pb-4">
              <h1 className="text-4xl font-serif font-bold text-neutral-900 uppercase tracking-wider mb-2">{resumeData.name || "Your Name"}</h1>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-neutral-600">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.email && resumeData.phone && <span>|</span>}
                {resumeData.phone && <span>{resumeData.phone}</span>}
                {resumeData.phone && resumeData.linkedin && <span>|</span>}
                {resumeData.linkedin && <span>{resumeData.linkedin}</span>}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className="mb-6">
                <p className="text-sm leading-relaxed text-neutral-800 text-justify">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-300 mb-3 uppercase tracking-wide">Professional Experience</h2>
                <div className="space-y-4">
                  {resumeData.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-neutral-900 text-base">{exp.title} <span className="font-normal italic">at {exp.company}</span></h3>
                        <span className="text-sm text-neutral-600 whitespace-nowrap">{exp.date}</span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap pl-4" style={{ textIndent: '-1rem' }}>
                          • {exp.description.replace(/\n/g, '\n• ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-300 mb-3 uppercase tracking-wide">Education</h2>
                <div className="space-y-3">
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <h3 className="font-bold text-neutral-900">{edu.school}</h3>
                        <p className="text-sm text-neutral-700">{edu.degree}</p>
                      </div>
                      <span className="text-sm text-neutral-600">{edu.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && (
              <div>
                <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-300 mb-3 uppercase tracking-wide">Technical Skills</h2>
                <p className="text-sm text-neutral-800 leading-relaxed">{resumeData.skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
