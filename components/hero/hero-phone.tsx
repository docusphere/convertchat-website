"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

// --- Typing indicator ---------------------------------------------------

function TypingIndicator({ side }: { side: "business" | "buyer" }) {
  const bubbleBg = side === "business" ? "#dcf8c6" : "#ffffff";
  const align = side === "business" ? "flex-end" : "flex-start";
  const radius =
    side === "business" ? "0 10px 10px 10px" : "10px 0 10px 10px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        alignSelf: align,
        background: bubbleBg,
        borderRadius: radius,
        padding: "10px 14px",
        display: "flex",
        gap: 4,
        boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
      }}
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#999",
            display: "block",
            animation: `dot-bounce 1s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

// --- Chat messages -------------------------------------------------------

interface ChatMessageProps {
  side: "business" | "buyer";
  time: string;
  children: React.ReactNode;
  showChecks?: boolean;
}

function ChatMessage({ side, time, children, showChecks }: ChatMessageProps) {
  const bubbleBg = side === "business" ? "#dcf8c6" : "#ffffff";
  const align = side === "business" ? "flex-end" : "flex-start";
  const radius =
    side === "business" ? "0 10px 10px 10px" : "10px 0 10px 10px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        alignSelf: align,
        background: bubbleBg,
        borderRadius: radius,
        padding: "6px 8px",
        maxWidth: "88%",
        boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
      }}
    >
      {children}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 4,
          marginTop: 2,
        }}
      >
        <span style={{ fontSize: 9, color: "#999" }}>{time}</span>
        {showChecks && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" style={{ display: "block" }}>
              <path d="M11.07 0.73L4.44 7.36L1.93 4.85L0.51 6.27L4.44 10.2L12.49 2.15L11.07 0.73Z" fill="#53bdeb" />
              <path d="M14.07 0.73L7.44 7.36L6.03 5.95L4.61 7.37L7.44 10.2L15.49 2.15L14.07 0.73Z" fill="#53bdeb" />
            </svg>
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

// --- WhatsApp header -----------------------------------------------------

function WhatsAppHeader({ name, initial, online }: { name: string; initial: string; online: string }) {
  return (
    <div
      style={{
        background: "#075e54",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "white",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#25d366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
          {initial}
        </span>
      </div>
      <div>
        <div style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
          {name}
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>
          {online}
        </div>
      </div>
    </div>
  );
}

// --- Input bar -----------------------------------------------------------

function InputBar({ placeholder }: { placeholder: string }) {
  return (
    <div
      style={{
        background: "#f0f0f0",
        padding: "6px 8px",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: 20,
          padding: "5px 12px",
          fontSize: 10,
          color: "#999",
          fontFamily: "system-ui",
        }}
      >
        {placeholder}
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#25d366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "white", fontSize: 12 }}>▶</span>
      </div>
    </div>
  );
}

// --- Animation sequence --------------------------------------------------

type Phase =
  | "empty"
  | "typing1"
  | "msg1"
  | "typing2"
  | "msg2"
  | "typing3"
  | "msg3"
  | "typing4"
  | "msg4"
  | "typing5"
  | "msg5"
  | "fadeout";

const PHASE_ORDER: Phase[] = [
  "empty",
  "typing1",
  "msg1",
  "typing2",
  "msg2",
  "typing3",
  "msg3",
  "typing4",
  "msg4",
  "typing5",
  "msg5",
  "fadeout",
];

function phaseGte(current: Phase, target: Phase): boolean {
  return PHASE_ORDER.indexOf(current) >= PHASE_ORDER.indexOf(target);
}

const TIMELINE: { phase: Phase; delay: number }[] = [
  { phase: "empty", delay: 800 },
  { phase: "typing1", delay: 1200 },
  { phase: "msg1", delay: 1500 },
  { phase: "typing2", delay: 1000 },
  { phase: "msg2", delay: 1200 },
  { phase: "typing3", delay: 1000 },
  { phase: "msg3", delay: 1200 },
  { phase: "typing4", delay: 800 },
  { phase: "msg4", delay: 1200 },
  { phase: "typing5", delay: 1000 },
  { phase: "msg5", delay: 2500 },
  { phase: "fadeout", delay: 1000 },
];

// --- Main component ------------------------------------------------------

export function HeroPhone() {
  const t = useTranslations("heroPhone");
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(
    prefersReducedMotion ? "msg5" : "empty",
  );
  const [cycle, setCycle] = useState(0);

  const showMsg = (target: Phase) => phaseGte(phase, target) && phase !== "empty";
  const fading = phase === "fadeout";

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let step = 0;

    function advance() {
      if (step >= TIMELINE.length) {
        setCycle((c) => c + 1);
        return;
      }
      setPhase(TIMELINE[step].phase);
      const delay = TIMELINE[step].delay;
      step++;
      timeoutId = setTimeout(advance, delay);
    }

    setPhase("empty");
    timeoutId = setTimeout(advance, TIMELINE[0].delay);

    return () => clearTimeout(timeoutId);
  }, [prefersReducedMotion, cycle]);

  return (
    <div
      aria-hidden="true"
      style={{ perspective: 1000, maxWidth: 380, width: "100%" }}
    >
      <div
        style={{
          position: "relative",
          animation: prefersReducedMotion
            ? "none"
            : "phone-float 4s ease-in-out infinite",
          transform: "rotateY(-14deg) rotateX(4deg)",
        }}
      >
        {/* Screen content */}
        <div
          style={{
            position: "absolute",
            top: "1.5%",
            bottom: "6.3%",
            left: "18.6%",
            right: "18.0%",
            borderRadius: 28,
            overflow: "hidden",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ background: "#075e54", height: 28, flexShrink: 0 }} />
          <WhatsAppHeader name={t("shopName")} initial={t("shopInitial")} online={t("online")} />

          {/* Chat area */}
          <div
            style={{
              flex: 1,
              background: "#ece5dd",
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ opacity: fading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                flex: 1,
              }}
            >
              {/* Typing 1 */}
              <AnimatePresence mode="popLayout">
                {phase === "typing1" && (
                  <TypingIndicator key="t1" side="business" />
                )}
              </AnimatePresence>

              {/* Message 1: Brand broadcast with product image */}
              <AnimatePresence>
                {showMsg("msg1") && (
                  <ChatMessage
                    key={`m1-${cycle}`}
                    side="business"
                    time="14:32"
                    showChecks
                  >
                    <img
                      src="/hero-chat/dress.jpg"
                      alt=""
                      style={{
                        width: "100%",
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 6,
                        marginBottom: 4,
                        display: "block",
                      }}
                    />
                    <p
                      style={{
                        fontSize: 10,
                        margin: "0 2px",
                        color: "#333",
                        lineHeight: 1.35,
                        fontFamily: "system-ui",
                      }}
                    >
                      <strong>{t("msg1_title")}</strong>
                      <br />
                      {t("msg1_text")}
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>

              {/* Typing 2 */}
              <AnimatePresence mode="popLayout">
                {phase === "typing2" && (
                  <TypingIndicator key="t2" side="buyer" />
                )}
              </AnimatePresence>

              {/* Message 2: Customer asks about sizes */}
              <AnimatePresence>
                {showMsg("msg2") && (
                  <ChatMessage
                    key={`m2-${cycle}`}
                    side="buyer"
                    time="14:33"
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: "#333",
                        margin: 0,
                        fontFamily: "system-ui",
                      }}
                    >
                      {t("msg2_text")}
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>

              {/* Typing 3 */}
              <AnimatePresence mode="popLayout">
                {phase === "typing3" && (
                  <TypingIndicator key="t3" side="business" />
                )}
              </AnimatePresence>

              {/* Message 3: Brand answers sizing */}
              <AnimatePresence>
                {showMsg("msg3") && (
                  <ChatMessage
                    key={`m3-${cycle}`}
                    side="business"
                    time="14:33"
                    showChecks
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: "#333",
                        margin: 0,
                        fontFamily: "system-ui",
                      }}
                    >
                      {t("msg3_text")}
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>

              {/* Typing 4 */}
              <AnimatePresence mode="popLayout">
                {phase === "typing4" && (
                  <TypingIndicator key="t4" side="buyer" />
                )}
              </AnimatePresence>

              {/* Message 4: Customer decides to buy */}
              <AnimatePresence>
                {showMsg("msg4") && (
                  <ChatMessage
                    key={`m4-${cycle}`}
                    side="buyer"
                    time="14:34"
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: "#333",
                        margin: 0,
                        fontFamily: "system-ui",
                      }}
                    >
                      {t("msg4_text")}
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>

              {/* Typing 5 */}
              <AnimatePresence mode="popLayout">
                {phase === "typing5" && (
                  <TypingIndicator key="t5" side="business" />
                )}
              </AnimatePresence>

              {/* Message 5: Brand sends payment link */}
              <AnimatePresence>
                {showMsg("msg5") && (
                  <ChatMessage
                    key={`m5-${cycle}`}
                    side="business"
                    time="14:34"
                    showChecks
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: "#333",
                        margin: 0,
                        fontFamily: "system-ui",
                      }}
                    >
                      {t("msg5_text")}
                    </p>
                    {/* Payment link card */}
                    <div
                      style={{
                        background: "#f0f4f0",
                        borderRadius: 6,
                        padding: "6px 8px",
                        marginTop: 4,
                        borderLeft: "3px solid #25d366",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          color: "#25d366",
                          fontWeight: 600,
                          fontFamily: "system-ui",
                        }}
                      >
                        🔗 {t("msg5_link")}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#333",
                        margin: "4px 0 0",
                        fontFamily: "system-ui",
                      }}
                    >
                      {t("msg5_note")}
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <InputBar placeholder={t("inputPlaceholder")} />
        </div>

        {/* Phone frame */}
        <img
          src="/phone-frame.png"
          alt=""
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "auto",
            display: "block",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
