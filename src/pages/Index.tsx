import { useState } from "react";
import ThreadList from "@/components/ThreadList";
import ThreadEditor from "@/components/ThreadEditor";
import ThreadView from "@/components/ThreadView";

type View =
  | { type: "list" }
  | { type: "new" }
  | { type: "edit"; id: string }
  | { type: "view"; id: string };

const Index = () => {
  const [view, setView] = useState<View>({ type: "list" });

  if (view.type === "new") {
    return (
      <div className="min-h-screen bg-background">
        <ThreadEditor
          onBack={() => setView({ type: "list" })}
          onSaved={(id) => setView({ type: "view", id })}
        />
      </div>
    );
  }

  if (view.type === "edit") {
    return (
      <div className="min-h-screen bg-background">
        <ThreadEditor
          threadId={view.id}
          onBack={() => setView({ type: "view", id: view.id })}
          onSaved={(id) => setView({ type: "view", id })}
        />
      </div>
    );
  }

  if (view.type === "view") {
    return (
      <div className="min-h-screen bg-background">
        <ThreadView
          threadId={view.id}
          onBack={() => setView({ type: "list" })}
          onEdit={(id) => setView({ type: "edit", id })}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ThreadList
        onNew={() => setView({ type: "new" })}
        onOpen={(id) => setView({ type: "view", id })}
        onEdit={(id) => setView({ type: "edit", id })}
      />
    </div>
  );
};

export default Index;
