# Hero Phone Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a realistic floating phone mockup with an animated WhatsApp conversation to the hero section's right column.

**Architecture:** iPhone PNG frame with transparent screen layered over HTML chat content. CSS 3D perspective provides the tilted floating effect. Framer Motion drives a looping message sequence with typing indicators. All keyframes in `app/globals.css`.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Framer Motion (`useReducedMotion`, `motion.div`), CSS keyframes

---

## File Structure

| File | Responsibility |
|------|---------------|
| `app/globals.css` | `@keyframes phone-float` and `@keyframes dot-bounce` |
| `components/hero/hero-phone.tsx` | `"use client"` — Phone frame + screen content + animation loop |
| `components/hero/hero-section.tsx` | Import and mount `<HeroPhone />` in right column |
| `public/phone-frame.png` | iPhone X frame PNG with transparent screen (already present) |

---

### Task 1: Add CSS keyframes to globals.css

**Files:**
- Modify: `app/globals.css:119-132` (after `@keyframes rainbow-shift` block)

- [ ] **Step 1: Add `phone-float` and `dot-bounce` keyframes**

Add these immediately before the `.rainbow-border-animated:hover` rule (line 124):

```css
@keyframes phone-float {
  0%, 100% { transform: rotateY(-8deg) rotateX(3deg) translateY(0); }
  50% { transform: rotateY(-8deg) rotateX(3deg) translateY(-12px); }
}

@keyframes dot-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add phone-float and dot-bounce keyframes"
```

---

### Task 2: Create HeroPhone component

**Files:**
- Create: `components/hero/hero-phone.tsx`

- [ ] **Step 1: Create the component file**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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
        padding: "8px 10px",
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
            style={{ fontSize: 10, color: "#53bdeb" }}
          >
            ✓✓
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

// --- WhatsApp header -----------------------------------------------------

function WhatsAppHeader() {
  return (
    <div
      style={{
        background: "#075e54",
        padding: "12px 14px",
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
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#25d366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
          C
        </span>
      </div>
      <div>
        <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
          ConvertChat
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>
          en línea
        </div>
      </div>
    </div>
  );
}

// --- Input bar -----------------------------------------------------------

function InputBar() {
  return (
    <div
      style={{
        background: "#f0f0f0",
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: 11,
          color: "#999",
          fontFamily: "system-ui",
        }}
      >
        Mensaje...
      </div>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#25d366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "white", fontSize: 14 }}>▶</span>
      </div>
    </div>
  );
}

// --- Broadcast message content -------------------------------------------

function BroadcastContent() {
  return (
    <>
      <div
        style={{
          background: "#c8e6b0",
          borderRadius: 6,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 6,
        }}
      >
        📱
      </div>
      <p
        style={{
          fontSize: 11,
          margin: "0 4px",
          color: "#333",
          lineHeight: 1.4,
          fontFamily: "system-ui",
        }}
      >
        <strong>iPhone 15 Pro 256GB</strong>
        <br />
        €890/ud — 40% bajo retail
        <br />
        Stock limitado. Pedido mín: 10 uds
      </p>
    </>
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
  | "fadeout";

const TIMELINE: { phase: Phase; delay: number }[] = [
  { phase: "empty", delay: 1000 },
  { phase: "typing1", delay: 1500 },
  { phase: "msg1", delay: 1500 },
  { phase: "typing2", delay: 1000 },
  { phase: "msg2", delay: 1500 },
  { phase: "typing3", delay: 1000 },
  { phase: "msg3", delay: 2500 },
  { phase: "fadeout", delay: 1000 },
];

// --- Main component ------------------------------------------------------

export function HeroPhone() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(
    prefersReducedMotion ? "msg3" : "empty",
  );
  const [cycle, setCycle] = useState(0);

  const showMsg1 = phase === "msg1" || phase === "typing2" || phase === "msg2" || phase === "typing3" || phase === "msg3" || phase === "fadeout";
  const showMsg2 = phase === "msg2" || phase === "typing3" || phase === "msg3" || phase === "fadeout";
  const showMsg3 = phase === "msg3" || phase === "fadeout";
  const fading = phase === "fadeout";

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let step = 0;

    function advance() {
      if (step >= TIMELINE.length) {
        // Let the new effect cycle start fresh
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
      style={{ perspective: 1000, maxWidth: 320, width: "100%" }}
    >
      <div
        style={{
          position: "relative",
          animation: prefersReducedMotion
            ? "none"
            : "phone-float 4s ease-in-out infinite",
          transform: "rotateY(-8deg) rotateX(3deg)",
        }}
      >
        {/* Screen content — behind frame */}
        <div
          style={{
            position: "absolute",
            top: "6.2%",
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
          <WhatsAppHeader />

          {/* Chat area */}
          <div
            style={{
              flex: 1,
              background: "#ece5dd",
              padding: "12px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ opacity: fading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
              }}
            >
              <AnimatePresence mode="popLayout">
                {phase === "typing1" && (
                  <TypingIndicator key="t1" side="business" />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showMsg1 && (
                  <ChatMessage
                    key={`m1-${cycle}`}
                    side="business"
                    time="14:32"
                    showChecks
                  >
                    <BroadcastContent />
                  </ChatMessage>
                )}
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                {phase === "typing2" && (
                  <TypingIndicator key="t2" side="buyer" />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showMsg2 && (
                  <ChatMessage
                    key={`m2-${cycle}`}
                    side="buyer"
                    time="14:33"
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "#333",
                        margin: 0,
                        fontFamily: "system-ui",
                      }}
                    >
                      Me llevo 30 unidades 👍
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                {phase === "typing3" && (
                  <TypingIndicator key="t3" side="business" />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showMsg3 && (
                  <ChatMessage
                    key={`m3-${cycle}`}
                    side="business"
                    time="14:34"
                    showChecks
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "#333",
                        margin: 0,
                        fontFamily: "system-ui",
                      }}
                    >
                      Hecho. Factura en camino 🤝
                    </p>
                  </ChatMessage>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <InputBar />
        </div>

        {/* Phone frame — on top */}
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
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/hero/hero-phone.tsx
git commit -m "feat: add HeroPhone component with animated WhatsApp conversation"
```

---

### Task 3: Integrate HeroPhone into hero section

**Files:**
- Modify: `components/hero/hero-section.tsx:1-87`

- [ ] **Step 1: Add import**

Add after the existing imports (line 6):

```tsx
import { HeroPhone } from "./hero-phone";
```

- [ ] **Step 2: Replace the empty right column**

Replace line 81:
```tsx
          <div className="hidden lg:block" />
```

With:
```tsx
          {/* Right column — phone mockup */}
          <div className="hidden lg:flex lg:justify-center">
            <HeroPhone />
          </div>
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Visual check**

Run: `npm run dev`
Open `http://localhost:3000` and verify:
1. Phone appears in the right column on desktop (lg+)
2. Phone is hidden on mobile/tablet
3. WhatsApp header shows "ConvertChat" / "en línea"
4. Messages animate in one by one with typing indicators
5. Conversation loops after all messages appear
6. Phone floats with subtle 3D tilt
7. On `prefers-reduced-motion`, all messages show immediately with no animation

- [ ] **Step 5: Commit**

```bash
git add components/hero/hero-section.tsx
git commit -m "feat: integrate HeroPhone into hero section right column"
```
