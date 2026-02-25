import { useState, useEffect } from "react";
import { getThreads, deleteThread, type Thread } from "@/lib/threads";
import { toast } from "sonner";

interface ThreadListProps {
  onNew: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
}

const ThreadList = ({ onNew, onOpen, onEdit }: ThreadListProps) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    setThreads(getThreads());
  }, []);

  const handleDelete = (id: string) => {
    deleteThread(id);
    setThreads(getThreads());
    toast.success("Draft dihapus");
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary">𝕏</span> Thread Drafts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Draft thread kamu sebelum posting
          </p>
        </div>
        <button
          onClick={onNew}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          + Baru
        </button>
      </div>

      {threads.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl">📝</div>
          <p className="text-muted-foreground text-sm">Belum ada draft thread</p>
          <button
            onClick={onNew}
            className="text-primary text-sm font-medium hover:underline"
          >
            Buat thread pertama →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => onOpen(thread.id)}
                  className="flex-1 text-left"
                >
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                    {thread.topic}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {thread.tweets.length} tweets · {new Date(thread.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {thread.tweets[0] && (
                    <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2">
                      {thread.tweets[0]}
                    </p>
                  )}
                </button>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(thread.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(thread.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-xs"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadList;
