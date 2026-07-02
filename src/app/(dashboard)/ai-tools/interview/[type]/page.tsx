"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Send, Loader2, Bot, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "ai";
  content: string;
  feedback?: string;
  score?: number;
};

export default function InterviewSessionPage() {
  const { type } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start interview
    const startInterview = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, isStart: true })
        });
        const json = await res.json();
        if (json.success) {
          setMessages([{ role: "ai", content: json.aiMessage }]);
        } else {
          toast.error(json.error);
        }
      } catch (err) {
        toast.error("Failed to start interview");
      } finally {
        setLoading(false);
      }
    };
    startInterview();
  }, [type]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI immediately
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type, 
          history: messages,
          userAnswer: userMessage,
          isStart: false 
        })
      });
      const json = await res.json();
      
      if (json.success) {
        // Update the previous user message with feedback
        const evalData = json.evaluation;
        const updatedMessages = [...newMessages];
        updatedMessages[updatedMessages.length - 1].feedback = evalData.feedback;
        updatedMessages[updatedMessages.length - 1].score = evalData.score;
        
        // Add next question
        updatedMessages.push({ role: "ai", content: evalData.nextQuestion });
        setMessages(updatedMessages);
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-white/50";
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <PageWrapper className="h-full flex flex-col space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <Link href="/ai-tools/interview" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">{type} Interview</h1>
          <p className="text-text-muted text-sm">Real-time mock interview with Gemini AI</p>
        </div>
      </div>

      <GlassCard className="flex-1 min-h-0 flex flex-col p-4 md:p-6 overflow-hidden bg-[#0B0F19]/40 border-white/5">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {messages.length === 0 && loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 max-w-[90%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`space-y-2 ${m.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5'}`}>
                  {m.content}
                </div>
                
                {m.feedback && (
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4 mt-2 max-w-full text-left text-sm animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white/80">AI Evaluation</span>
                      <span className={`font-bold ${getScoreColor(m.score)}`}>Score: {m.score}/10</span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-text-muted">
                      <ReactMarkdown>{m.feedback}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && messages.length > 0 && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your answer here... (Press Enter to send)"
            disabled={loading}
            rows={3}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-14 text-white text-sm outline-none focus:border-primary/50 resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-3 bottom-7 p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </PageWrapper>
  );
}
