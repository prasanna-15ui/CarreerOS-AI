"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { FileText, Download, Trash2 } from "lucide-react";

export type Resume = {
  id: string;
  file_name: string;
  file_url: string;
  tags: string[];
  uploaded_at: string;
};

export function ResumeGrid({ resumes, onDelete }: { resumes: Resume[], onDelete: (id: string, url: string) => Promise<void> }) {
  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        No resumes uploaded yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resumes.map(resume => (
        <GlassCard key={resume.id} className="p-5 flex flex-col hover:bg-white/10 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex gap-2">
              <a 
                href={resume.file_url} 
                target="_blank" 
                rel="noreferrer"
                download
                className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to delete this resume?")) {
                    onDelete(resume.id, resume.file_url);
                  }
                }}
                className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h4 className="text-white font-semibold mb-2 truncate" title={resume.file_name}>
            {resume.file_name}
          </h4>
          
          <p className="text-xs text-text-muted mb-4">
            Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {resume.tags?.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/80">
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
