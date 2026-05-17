"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "こんにちは！お礼状講座2026夏についてご質問があればお気軽にどうぞ😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data.message || "申し訳ありません、もう一度お試しください。";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "エラーが発生しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (text: string | undefined) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-pink-600 font-bold"
        >
          👉 申込はこちら
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <>
      {/* チャット本体 */}
      {open && (
        <div className="fixed bottom-24 right-4 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-pink-200">
          {/* ヘッダー */}
          <div className="bg-pink-500 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">お礼状講座 ご案内</div>
              <div className="text-xs opacity-80">中田明美先生の講座スタッフ</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* メッセージ一覧 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72 bg-pink-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-pink-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {m.role === "assistant"
                    ? renderMessage(m.content)
                    : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm text-sm text-gray-400">
                  入力中…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 入力欄 */}
          <div className="p-2 border-t border-pink-100 flex gap-2 bg-white">
            <input
              className="flex-1 border border-pink-200 rounded-full px-3 py-1.5 text-sm outline-none focus:border-pink-400"
              placeholder="質問を入力してください"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm disabled:opacity-50 shrink-0"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 開閉ボタン */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-pink-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 text-2xl hover:bg-pink-600 transition-colors"
      >
        {open ? "×" : "💬"}
      </button>
    </>
  );
}
