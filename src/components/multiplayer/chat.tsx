"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMultiplayer } from "@/hooks/use-multiplayer";

export const Chat = () => {
  const { session, sendMessage, myPlayer } = useMultiplayer();
  const [text, setText] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = session?.messages ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — scrolls when message count changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <>
      {/* Desktop: fixed bottom-left panel */}
      <div className="hidden md:flex fixed bottom-4 left-4 w-72 flex-col border-4 border-foreground bg-background z-40">
        <div className="flex items-center justify-between px-3 py-1 border-b-2 border-foreground">
          <span className="text-xs font-bold">Chat</span>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="text-xs hover:underline"
          >
            {collapsed ? "▲" : "▼"}
          </button>
        </div>
        {!collapsed && (
          <>
            <div className="flex flex-col gap-1 p-2 h-40 overflow-y-auto text-xs">
              {messages.map((msg) => (
                <div key={msg.timestamp} className="flex gap-1">
                  <span
                    className={
                      msg.playerName === myPlayer?.name
                        ? "font-bold text-success"
                        : "font-bold text-warning"
                    }
                  >
                    {msg.playerName}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex border-t-2 border-foreground">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message…"
                className="flex-1 px-2 py-1 text-xs bg-background focus:outline-none"
                maxLength={200}
              />
              <Button
                variant="pixel"
                size="sm"
                onClick={handleSend}
                className="rounded-none border-0 border-l-2 border-foreground text-xs"
              >
                Send
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Mobile: collapsible footer bar */}
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
            <div className="flex flex-col gap-1 p-2 h-28 overflow-y-auto text-xs border-t-2 border-foreground">
              {messages.map((msg) => (
                <div key={msg.timestamp} className="flex gap-1">
                  <span
                    className={
                      msg.playerName === myPlayer?.name
                        ? "font-bold text-success"
                        : "font-bold text-warning"
                    }
                  >
                    {msg.playerName}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex border-t-2 border-foreground">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message…"
                className="flex-1 px-2 py-1 text-xs bg-background focus:outline-none"
                maxLength={200}
              />
              <Button
                variant="pixel"
                size="sm"
                onClick={handleSend}
                className="rounded-none border-0 border-l-2 border-foreground text-xs"
              >
                Send
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
