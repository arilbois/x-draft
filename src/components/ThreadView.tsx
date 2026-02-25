import { useState } from "react";
import { getThread, type Thread } from "@/lib/threads";
import { toast } from "sonner";

interface ThreadViewProps {
  threadId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const ThreadView = ({ threadId, onBack, onEdit }: ThreadViewProps) => {
  const thread = getThread(threadId);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!thread) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground">Thread tidak ditemukan</p>
        <button onClick={onBack} className="text-primary text-sm mt-2 hover:underline">
          ← Kembali
        </button>
      </div>
    );
  }

  const copyTweet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Tweet di-copy!");
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    const all = thread.tweets.join("\n\n");
    navigator.clipboard.writeText(all);
    toast.success("Semua tweet di-copy!");
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-foreground truncate">
            {thread.topic}
          </h1>
          <p className="text-xs text-muted-foreground">
            {thread.tweets.length} tweets
          </p>
        </div>
        <button
          onClick={() => onEdit(thread.id)}
          className="px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground font-medium hover:bg-muted/80 transition-colors"
        >
          Edit
        </button>
      </div>

      {/* Tweets */}
      <div className="space-y-2">
        {thread.tweets.map((tweet, i) => (
          <div
            key={i}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {i === 0 ? "Hook" : i === thread.tweets.length - 1 ? "CTA" : `Tweet ${i}`}
                  </span>
                  <span className={`text-[10px] font-mono ${tweet.length > 280 ? "text-destructive" : "text-muted-foreground"}`}>
                    {tweet.length}/280
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {tweet || <span className="text-muted-foreground italic">Kosong</span>}
                </p>
              </div>
              <button
                onClick={() => copyTweet(tweet, i)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copiedIdx === i
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                {copiedIdx === i ? "✓" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Copy all */}
      <button
        onClick={copyAll}
        className="w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
      >
        Copy semua tweet sekaligus
      </button>
    </div>
  );
};

export default ThreadView;
