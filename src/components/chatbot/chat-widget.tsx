"use client";

import { answerQuestion, formatGreeting, SUGGESTED_QUESTIONS } from "@/lib/chatbot";
import { cn } from "@/lib/utils";
import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const TYPE_SPEED_MS = 16;
const CHARS_PER_TICK = 2;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const thinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (thinkTimerRef.current) clearTimeout(thinkTimerRef.current);
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      const id = crypto.randomUUID();
      setMessages([{ id, role: "assistant", text: "" }]);
      streamInto(id, formatGreeting());
    }
  }, [open]);

  function streamInto(id: string, full: string) {
    let revealed = 0;
    setStreamingId(id);
    const timer = setInterval(() => {
      revealed += CHARS_PER_TICK;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: full.slice(0, revealed) } : m))
      );
      if (revealed >= full.length) {
        clearInterval(timer);
        streamTimerRef.current = null;
        setStreamingId(null);
      }
    }, TYPE_SPEED_MS);
    streamTimerRef.current = timer;
  }

  const busy = thinking || streamingId !== null;

  function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    const delay = 550 + Math.random() * 500;
    thinkTimerRef.current = setTimeout(() => {
      thinkTimerRef.current = null;
      setThinking(false);
      const answer = answerQuestion(text);
      const botId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: botId, role: "assistant", text: "" }]);
      streamInto(botId, answer);
    }, delay);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Đóng trợ lý TJMech" : "Mở trợ lý TJMech"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-950/50 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        )}
      </button>

      {open && (
        <div className="chat-pop-in fixed bottom-24 right-6 z-50 flex h-[min(600px,75vh)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Trợ lý TJMech</p>
                <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="status-dot-live h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Đang hoạt động
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-300"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-indigo-600 text-white"
                      : "rounded-bl-sm bg-slate-800 text-slate-200"
                  )}
                >
                  {m.text}
                  {streamingId === m.id && (
                    <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] animate-pulse bg-current align-middle" />
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-slate-800 px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-slate-800 bg-slate-900/60 px-3 py-2.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={busy}
                className="shrink-0 whitespace-nowrap rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-slate-800 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi cho trợ lý..."
              disabled={busy}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
              aria-label="Gửi"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
