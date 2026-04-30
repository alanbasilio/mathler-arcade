"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMultiplayer } from "@/hooks/use-multiplayer";
import { cn } from "@/lib/utils";

const MessageList = ({ className }: { className?: string }) => {
  const { session, myPlayer } = useMultiplayer();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = session?.messages ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — scrolls when message count changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-2 overflow-y-auto text-xs",
        className,
      )}
    >
      {messages.length === 0 && (
        <p className="text-foreground/30 text-center text-[10px] pt-2">
          No messages yet
        </p>
      )}
      {messages.map((msg) => (
        <div key={msg.timestamp} className="flex gap-1 flex-wrap">
          <span
            className={
              msg.playerName === myPlayer?.name
                ? "font-bold text-success"
                : "font-bold text-warning"
            }
          >
            {msg.playerName}:
          </span>
          <span className="break-all">{msg.text}</span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageInput = () => {
  const { sendMessage } = useMultiplayer();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex border-t-2 border-foreground">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Message…"
        className="flex-1 px-2 py-1 text-xs bg-background focus:outline-none min-w-0"
        maxLength={200}
      />
      <Button
        variant="pixel"
        size="sm"
        onClick={handleSend}
        className="rounded-none border-0 border-l-2 border-foreground text-xs shrink-0"
      >
        Send
      </Button>
    </div>
  );
};

export const ChatSidebar = () => {
  const { session } = useMultiplayer();
  const messages = session?.messages ?? [];

  return (
    <div className="hidden md:flex flex-col w-56 self-stretch border-4 border-foreground bg-background">
      <div className="px-3 py-1 border-b-2 border-foreground">
        <span className="text-xs font-bold">
          Chat{" "}
          {messages.length > 0 && (
            <span className="text-foreground/50">({messages.length})</span>
          )}
        </span>
      </div>
      <MessageList className="flex-1 min-h-0" />
      <MessageInput />
    </div>
  );
};

export const ChatBottomBar = () => {
  const { session } = useMultiplayer();
  const [collapsed, setCollapsed] = useState(true);
  const messages = session?.messages ?? [];

  return (
    <div className="flex md:hidden fixed bottom-0 left-0 right-0 flex-col border-t-4 border-foreground bg-background z-40">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center justify-between px-3 py-2 text-xs font-bold"
      >
        <span>Chat {messages.length > 0 && `(${messages.length})`}</span>
        <span>{collapsed ? "▲" : "▼"}</span>
      </button>
      {!collapsed && (
        <>
          <MessageList className="h-28 border-t-2 border-foreground" />
          <MessageInput />
        </>
      )}
    </div>
  );
};
