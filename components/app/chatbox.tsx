"use client";

import { useState, useRef, useEffect } from "react";
import { Card, Toast as addToast, Spinner } from "@heroui/react";
import Pusher, { Channel } from "pusher-js";

import ProfileModal from "./profilemodal";

import { authClient } from "@/lib/auth-client";

interface Message {
  id?: string;
  tempId?: string;
  content: string;
  authorId: string;
  channelId: string;
  author: {
    username: string;
    displayUsername?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  status?: "pending" | "confirmed" | "failed";
}

let sharedPusher: Pusher | null = null;

const isSameAuthorAsPrevious = (messages: Message[], index: number) => {
  if (index === messages.length - 1) return false;

  return messages[index].authorId === messages[index + 1]?.authorId;
};

const mergeMessages = (prev: Message[], next: Message[]): Message[] => {
  const seen = new Set<string>();
  const combined = [...prev, ...next];
  const filtered = combined.filter((m) => {
    const key = m.id || m.tempId;

    if (!key || seen.has(key)) return false;
    seen.add(key);

    return true;
  });

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export default function Chatbox({ channelId }: { channelId: string }) {
  const { data: session, isPending } = authClient.useSession();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [loadingChannel, setLoadingChannel] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<Channel | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const loadingOlderRef = useRef(false);

  // Load messages on channel switch
  useEffect(() => {
    if (!channelId) return;

    setMessages([]);
    setHasMore(true);
    setLoadingChannel(true);

    const controller = new AbortController();
    const signal = controller.signal;

    const loadMessages = async () => {
      const count = Math.ceil((window.innerHeight * 1.5) / 30);

      try {
        const res = await fetch(
          `/api/messages?channel=${channelId}&limit=${count}`,
          { signal },
        );

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data: Message[] = await res.json();

        setMessages(mergeMessages([], data));
        if (!data.length) setHasMore(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      } finally {
        setLoadingChannel(false);
      }
    };

    loadMessages();

    return () => controller.abort();
  }, [channelId]);

  // Load older messages for infinite scroll
  const loadOlder = async (cursor: string) => {
    if (loadingOlder || loadingOlderRef.current) return;

    loadingOlderRef.current = true;
    setLoadingOlder(true);

    try {
      const res = await fetch(
        `/api/messages?channel=${channelId}&cursor=${cursor}&limit=20`,
      );

      if (!res.ok) return;

      const data: Message[] = await res.json();

      if (!data.length) setHasMore(false);

      const scrollable = chatContainerRef.current?.parentElement;
      const prevHeight = scrollable?.scrollHeight || 0;

      setMessages((prev) => mergeMessages(prev, data));

      setTimeout(() => {
        if (scrollable) {
          scrollable.scrollTop = scrollable.scrollTop - prevHeight;
        }
      }, 0);
    } finally {
      setLoadingOlder(false);
      loadingOlderRef.current = false;
    }
  };

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!chatContainerRef.current) return;

    const el = chatContainerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (!first.isIntersecting || !hasMore) return;

        const oldest = messages[messages.length - 1]?.id;
        if (!oldest) return;

        loadOlder(oldest);
      },
      {
        root: el.parentElement,
        threshold: 0.1,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasMore, messages.length]);

  // Pusher subscription
  useEffect(() => {
    if (isPending || !session || !channelId) return;

    if (!sharedPusher) {
      sharedPusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/realtime/auth",
      });
    }

    const channelName = `private-${channelId}`;

    if (channelRef.current && channelRef.current.name !== channelName) {
      channelRef.current.unbind_all();
      sharedPusher.unsubscribe(channelRef.current.name);
      channelRef.current = null;
    }

    const channel = sharedPusher.subscribe(channelName);

    channelRef.current = channel;

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        const index = prev.findIndex(
          (m) => m.tempId && m.tempId === data.tempId,
        );

        if (index !== -1) {
          const updated = [...prev];

          updated[index] = { ...data, status: "confirmed" };

          return updated;
        }

        return [data, ...prev];
      });
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        sharedPusher?.unsubscribe(channelName);
        channelRef.current = null;
      }
    };
  }, [channelId, session, isPending]);

  const appendMessage = (msg: Message) => setMessages((prev) => [msg, ...prev]);

  const sendMessage = async () => {
    if (!input.trim() || !session) return;

    const { v4: uuidv4 } = await import("uuid");
    const tempId = uuidv4();
    const msg: Message = {
      tempId,
      content: input.trim(),
      authorId: String(session.user.id),
      author: {
        username: session.user.username || "unknown",
        displayUsername:
          session.user.displayUsername || session.user.username || "unknown",
      },
      channelId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
    };

    setInput("");
    appendMessage(msg);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      const content = await res.json();

      msg.id = content.id;

      setMessages((prev) =>
        prev.filter((m) => !(m.tempId && m.tempId === tempId)),
      );

      if (!res.ok) throw new Error("Network response was not ok");
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId
            ? { ...m, status: "failed", content: `${m.content} (failed)` }
            : m,
        ),
      );
      const systemMsg: Message = {
        id: crypto.randomUUID(),
        content: `"${msg.content}" was unable to be delivered.`,
        authorId: "1",
        channelId,
        author: { username: "System" },
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "failed",
      };

      setMessages((prev) => [systemMsg, ...prev]);
      //addToast({
        //title: "Unable to send message",
        //description: `"${msg.content}" was unable to be delivered.`,
        //color: "warning",
        //variant: "flat",
        //timeout: 5000,
      //});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-3 overflow-hidden">
      <Card className="flex-1 rounded-2xl overflow-hidden flex flex-col">
        {/* Replaced CardBody with Card.Content */}
        <Card.Content className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col-reverse">
          {loadingChannel ? (
            <div className="flex justify-center items-center flex-1">
              {/* Removed redundant explicit primary color */}
              <Spinner size="lg" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              Channel is empty
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSystem = msg.authorId === "1";
              const hideAvatarAndUsername = isSameAuthorAsPrevious(
                messages,
                index,
              );

              return (
                <div
                  key={msg.id || msg.tempId || index}
                  className="w-full mt-0"
                >
                  <div
                    className={`w-full rounded-xl px-2 ${
                      isSystem ? "bg-purple-500/20" : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!hideAvatarAndUsername && (
                        <button
                          className="w-10 h-10 m-auto rounded-full flex-shrink-0 cursor-pointer bg-gray-400 hover:ring-2 hover:ring-primary/50"
                          type="button"
                          onClick={() => setSelectedUserId(msg.authorId)}
                        />
                      )}
                      <div className="flex-1 flex flex-col gap-0">
                        {!hideAvatarAndUsername && (
                          <button
                            className="mt-1 mb-1 font-bold text-blue-500 hover:underline text-left"
                            type="button"
                            onClick={() => setSelectedUserId(msg.authorId)}
                          >
                            {msg.author.displayUsername}
                          </button>
                        )}
                        <span
                          className={`break-words ${
                            hideAvatarAndUsername ? "ml-[3.25rem]" : ""
                          } ${
                            msg.status === "pending"
                              ? "text-gray-400 italic"
                              : msg.status === "failed"
                                ? "text-red-400 italic"
                                : "text-gray-200"
                          }`}
                        >
                          {msg.content}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {loadingOlder && (
            <div className="flex justify-center py-2">
              <Spinner size="md" />
            </div>
          )}
          <div ref={chatContainerRef} />
        </Card.Content>
      </Card>

      <Card className="rounded-2xl flex-shrink-0">
        {/* Replaced CardBody with Card.Content */}
        <Card.Content className="p-2">
          <div className="flex gap-2 items-center">
            <input
              className="flex-1 px-3 py-2 rounded-xl border border-default-200 bg-default-50 text-default-foreground focus:outline-none focus:ring focus:ring-primary/50"
              disabled={loadingChannel}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 shrink-0"
              disabled={loadingChannel}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </Card.Content>
      </Card>

      {selectedUserId && (
        //<ProfileModal
          //isOpen={true}
          //userId={selectedUserId}
          //onClose={() => setSelectedUserId(null)}
        ///>
      <p></p>)}
    </div>
  );
}