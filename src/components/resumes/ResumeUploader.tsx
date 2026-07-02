"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { toast } from "sonner";

export function ResumeUploader({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    try {
      // 1. Upload to storage
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const uploadJson = await uploadRes.json();
      
      if (!uploadJson.success) throw new Error(uploadJson.error);

      // 2. Save metadata to db
      const dbRes = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.name,
          file_url: uploadJson.data.url,
          tags: tags
        })
      });
      const dbJson = await dbRes.json();

      if (!dbJson.success) throw new Error(dbJson.error);

      toast.success("Resume uploaded successfully!");
      setFile(null);
      setTags([]);
      onUploadComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <GlassCard className="p-6 mb-8 border-dashed border-2 border-primary/40 hover:border-primary/80 transition-all duration-300 bg-[#0B0F19]/40">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center py-10 cursor-pointer ${isDragActive ? "bg-primary/10 rounded-xl" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <UploadCloud className={`w-8 h-8 text-primary ${isDragActive ? 'animate-bounce' : ''}`} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Upload your Resume</h3>
          <p className="text-text-muted text-center max-w-sm">
            Drag and drop your PDF file here, or click to browse.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs border border-red-500/30">PDF</div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Tags (Press Enter to add)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. Frontend, Google, 2024" 
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex justify-end">
            <PrimaryButton onClick={handleUpload} disabled={uploading}>
              {uploading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Complete Upload"}
            </PrimaryButton>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
