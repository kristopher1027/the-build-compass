import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatComplete, type ChatMessage, type ChatSource } from "@/lib/chat.functions";
import { Send, Loader2, BookOpen } from "lucide-react";

type Props = {
  system: string;
  greeting?: string;
  placeholder?: string;
  suggestions?: string[];
  groundOn?: "idoma-knowledge";
};

type UiMessage = ChatMessage & { sources?: ChatSource[] };

export function ChatPanel({ system, greeting, placeholder, suggestions, groundOn }: Props) {
  const call = useServerFn(chatComplete);
  const [messages, setMessages] = useState<UiMessage[]>(
    greeting ? [{ role: "assistant", content: greeting }] : [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setError(null);
    const next: UiMessage[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await call({
        data: {
          system,
          messages: next
            .filter((m) => m.role !== "system")
            .map(({ role, content }) => ({ role, content })),
          groundOn,
        },
      });
      setMessages([
        ...next,
        { role: "assistant", content: res.content || "…", sources: res.sources },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border bg-card shadow-sm overflow-hidden h-[70vh] min-h-[500px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {m.content}
              {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1 mb-1.5">
                    <BookOpen className="w-3 h-3" /> Sources from verified corpus
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.sources.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-background border text-foreground/80"
                        title={s.category}
                      >
                        {s.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-muted-foreground inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
            </div>
          </div>
        )}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {suggestions && suggestions.length > 0 && messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 border-t pt-3 bg-background/50">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t p-3 bg-background"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={placeholder ?? "Ask a question…"}
          rows={1}
          className="flex-1 resize-none bg-transparent px-3 py-2 text-sm focus:outline-none max-h-32"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
