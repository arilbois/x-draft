export interface Thread {
  id: string;
  topic: string;
  tweets: string[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "x-thread-drafts";

export function getThreads(): Thread[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getThread(id: string): Thread | undefined {
  return getThreads().find((t) => t.id === id);
}

export function saveThread(thread: Thread): void {
  const threads = getThreads();
  const idx = threads.findIndex((t) => t.id === thread.id);
  if (idx >= 0) {
    threads[idx] = thread;
  } else {
    threads.unshift(thread);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export function deleteThread(id: string): void {
  const threads = getThreads().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
