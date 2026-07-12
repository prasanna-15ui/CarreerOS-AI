"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { ResumeUploader } from "@/components/resumes/ResumeUploader";
import { ResumeGrid, Resume } from "@/components/resumes/ResumeGrid";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      const json = await res.json();
      if (json.success) {
        setResumes(json.data as Resume[]);
      } else {
        toast.error(json.error || "Failed to load resumes");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string, url: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}?fileUrl=${encodeURIComponent(url)}`, {
        method: "DELETE"
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success("Resume deleted! Confirmation email sent.");
        fetchResumes();
      } else {
        toast.error(json.error || "Failed to delete resume");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resume");
    }
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resume Management</h1>
        <p className="text-text-muted">Upload and organize your different resume versions.</p>
      </div>

      <ResumeUploader onUploadComplete={fetchResumes} />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResumeGrid resumes={resumes} onDelete={handleDelete} />
        )}
      </div>
    </PageWrapper>
  );
}
