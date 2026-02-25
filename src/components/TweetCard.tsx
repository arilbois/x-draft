import { Textarea } from "@/components/ui/textarea";

interface TweetCardProps {
  index: number;
  total: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  isHook?: boolean;
  isCTA?: boolean;
  dragHandleProps?: {
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    onDrop: () => void;
    draggable: boolean;
  };
  isDragOver?: boolean;
}

const TweetCard = ({ index, total, value, onChange, onRemove, isHook, isCTA, dragHandleProps, isDragOver }: TweetCardProps) => {
  const charCount = value.length;
  const isOver = charCount > 280;

  const label = isHook ? "Hook" : isCTA ? "CTA" : `Tweet ${index}`;

  return (
    <div
      className={`relative group rounded-xl border bg-card p-4 transition-all ${
        isDragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/30"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        dragHandleProps?.onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        dragHandleProps?.onDrop();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          {dragHandleProps && (
            <div
              draggable={dragHandleProps.draggable}
              onDragStart={dragHandleProps.onDragStart}
              onDragEnd={dragHandleProps.onDragEnd}
              className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-none select-none"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="5" cy="3" r="1.5" />
                <circle cx="11" cy="3" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="11" cy="8" r="1.5" />
                <circle cx="5" cy="13" r="1.5" />
                <circle cx="11" cy="13" r="1.5" />
              </svg>
            </div>
          )}
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-medium ${isOver ? "text-destructive" : charCount > 250 ? "text-warning" : "text-muted-foreground"}`}>
            {charCount}/280
          </span>
          {total > 3 && !isHook && (
            <button
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive text-sm px-1"
              aria-label="Remove tweet"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isHook ? "Tulis hook yang menarik perhatian..." : isCTA ? "Tulis CTA / penutup thread..." : "Tulis isi tweet..."}
        className="min-h-[80px] bg-transparent border-none resize-none p-0 text-sm leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground/50"
      />

      {/* Progress bar */}
      <div className="mt-2 h-0.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isOver ? "bg-destructive" : charCount > 250 ? "bg-warning" : "bg-primary/50"}`}
          style={{ width: `${Math.min((charCount / 280) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default TweetCard;
