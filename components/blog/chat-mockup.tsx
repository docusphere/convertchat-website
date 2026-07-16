import { Bot } from "lucide-react";
import type { ChatMessage } from "@/lib/article";

export function ChatMockup({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="mx-auto my-10 w-full max-w-md rounded-2xl bg-neutral-100 p-5 md:p-6">
      <div className="flex flex-col gap-2">
        {messages.map((m, i) =>
          m.from === "customer" ? (
            <div
              key={i}
              className="max-w-[82%] self-start rounded-2xl rounded-tl-sm border border-neutral-200 bg-white px-3 py-2"
            >
              <p className="text-[13px] leading-[1.45] text-neutral-900">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="max-w-[82%] self-end rounded-2xl rounded-tr-sm bg-green-600 px-3 py-2">
              {m.from === "ai" && (
                <span className="mb-1 inline-flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold text-white/70">
                  <Bot size={10} />
                  AI
                </span>
              )}
              <p className="text-[13px] leading-[1.45] text-white">{m.text}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
