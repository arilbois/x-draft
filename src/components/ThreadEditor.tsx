import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TweetCard from "./TweetCard";
import { toast } from "sonner";
import { getThread, saveThread, generateId, type Thread } from "@/lib/threads";

const DEFAULT_CTA = "Kalau thread ini bermanfaat, RT tweet pertama biar lebih banyak yang baca 🙏";

interface ThreadEditorProps {
  threadId?: string;
  onBack: () => void;
  onSaved: (id: string) => void;
}

const ThreadEditor = ({ threadId, onBack, onSaved }: ThreadEditorProps) => {
  const [topic, setTopic] = useState("");
  const [tweetCount, setTweetCount] = useState(5);
  const [tweets, setTweets] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const isEditing = !!threadId;

  useEffect(() => {
    if (threadId) {
      const thread = getThread(threadId);
      if (thread) {
        setTopic(thread.topic);
        setTweets(thread.tweets);
        setStarted(true);
      }
    }
  }, [threadId]);

  const startWriting = () => {
    if (!topic.trim()) {
      toast.error("Masukkan topik thread dulu!");
      return;
    }
    const newTweets: string[] = [""];
    for (let i = 1; i <= Math.max(tweetCount - 2, 1); i++) {
      newTweets.push("");
    }
    newTweets.push(DEFAULT_CTA);
    setTweets(newTweets);
    setStarted(true);
  };

  const updateTweet = (index: number, value: string) => {
    setTweets((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const removeTweet = (index: number) => {
    if (tweets.length <= 3) return;
    setTweets((prev) => prev.filter((_, i) => i !== index));
  };

  const addTweet = () => {
    setTweets((prev) => {
      const insertAt = prev.length - 1;
      return [...prev.slice(0, insertAt), "", ...prev.slice(insertAt)];
    });
  };

  const handleDrop = (toIdx: number) => {
    if (dragIdx === null || dragIdx === toIdx) return;
    setTweets((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleSave = () => {
    if (!topic.trim()) {
      toast.error("Topik tidak boleh kosong!");
      return;
    }
    const now = Date.now();
    const thread: Thread = {
      id: threadId || generateId(),
      topic: topic.trim(),
      tweets,
      createdAt: threadId ? getThread(threadId)?.createdAt || now : now,
      updatedAt: now,
    };
    saveThread(thread);
    toast.success(isEditing ? "Draft diupdate!" : "Draft tersimpan!");
    onSaved(thread.id);
  };

  const hasOverLimit = tweets.some((t) => t.length > 280);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-bold tracking-tight">
          {isEditing ? "Edit Thread" : "Thread Baru"}
        </h1>
      </div>

      {!started ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Topik Thread</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='Contoh: "5 hal yang gw pelajari dari freelancing"'
              className="bg-muted border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Jumlah Tweet</label>
            <div className="flex items-center gap-3">
              {[4, 5, 7, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setTweetCount(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-colors ${
                    tweetCount === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={startWriting} className="w-full font-semibold" size="lg">
            Mulai Nulis ✍️
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="bg-muted border-border text-sm font-medium"
            placeholder="Topik thread..."
          />

          {/* Tweet cards with drag & drop */}
          <div className="space-y-3">
            {tweets.map((tweet, i) => (
              <TweetCard
                key={i}
                index={i}
                total={tweets.length}
                value={tweet}
                onChange={(val) => updateTweet(i, val)}
                onRemove={() => removeTweet(i)}
                isHook={i === 0}
                isCTA={i === tweets.length - 1}
                isDragOver={dragOverIdx === i}
                dragHandleProps={{
                  draggable: true,
                  onDragStart: () => setDragIdx(i),
                  onDragOver: (e) => {
                    e.preventDefault();
                    setDragOverIdx(i);
                  },
                  onDragEnd: () => {
                    setDragIdx(null);
                    setDragOverIdx(null);
                  },
                  onDrop: () => handleDrop(i),
                }}
              />
            ))}
          </div>

          <button
            onClick={addTweet}
            className="w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            + Tambah Tweet
          </button>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 font-semibold"
              disabled={hasOverLimit}
            >
              {hasOverLimit ? "Ada tweet >280!" : "💾 Simpan Draft"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadEditor;
