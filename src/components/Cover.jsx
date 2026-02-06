// src/components/Cover.jsx
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InviteCard from "./InviteCard";

import envelopeClosed from "../assets/envelope-closed.png";
import envelopeFlap from "../assets/envelope-flap.png";
import envelopeOpen from "../assets/envelope-open.png";

export default function Cover() {
  // stages: closed -> opening -> opened
  const [stage, setStage] = useState("closed");
  const opening = stage === "opening";
  const opened = stage === "opened";

  // keep the open envelope visible behind the card after opening
  const [showOpenEnvelope, setShowOpenEnvelope] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const ease = useMemo(() => [0.16, 1, 0.3, 1], []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const openNow = () => {
    if (stage !== "closed") return;
    setStage("opening");
    setShowOpenEnvelope(true);

    // flap opens + little settle, then reveal InviteCard
    window.setTimeout(() => setStage("opened"), 900);
  };

  const closeNow = () => {
    setStage("closed");
    setShowOpenEnvelope(false);
  };

  // Card slide distance (starts "inside" the envelope)
  const cardFromY = isMobile ? 130 : 165;

  return (
    <section
      className={[
        "relative w-full min-h-screen overflow-x-hidden",
        opened ? "overflow-y-auto" : "overflow-y-hidden",
      ].join(" ")}
    >
      {/* 👑 Cinematic royal background (driven by your index.css) */}
      <div className="absolute inset-0 royal-parallax">
        <div className="royal-layer royal-layer--back" />
        <div className="royal-layer royal-layer--mid" />
        <div className="royal-layer royal-layer--front" />
        <div className="royal-sunGlow" />
        <div className="royal-lightSweep" />
        <div className="royal-grain" />
      </div>

      {/* Optional tint overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* LAYOUT WRAPPER */}
      <div
        className={[
          "relative z-10 w-full min-h-screen",
          "flex justify-center",
          opened ? "items-start" : "items-center",
          "px-3 sm:px-6",
          opened ? "py-10 sm:py-12" : "py-10",
        ].join(" ")}
      >
        <motion.div
          className="w-full max-w-[980px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        >
          <div className="relative">
            {/* ✅ INVITE CARD (slides out from envelope area) */}
            <AnimatePresence>
              {opened && (
                <motion.div
                  key="invite-card"
                  className="relative z-20 mx-auto w-full"
                  initial={{ opacity: 0, y: cardFromY, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.99 }}
                  transition={{ duration: 0.85, ease }}
                >
                  <InviteCard />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ ENVELOPE: closed slides in; tap -> flap lifts; open stays under card */}
            <motion.button
              type="button"
              onClick={openNow}
              className={[
                "relative mx-auto block w-full focus:outline-none",
                // once opened, it stays visible behind the card (no clicks)
                opened ? "pointer-events-none" : "",
                // behind card when opened
                opened ? "z-10" : "z-20",
              ].join(" ")}
              whileHover={!opening && !opened ? { y: -3 } : undefined}
              whileTap={!opening && !opened ? { scale: 0.985 } : undefined}
              initial={{ opacity: 0, x: -600, rotateZ: -90, scale: 0.96 }}
              animate={{
                opacity: 1,
                x: 0,
                rotateZ: 0,

                // closed floats; once opened, it drops slightly lower (like gravity)
                y: opened ? [0, 22, 18] : [0, -6, 0],
                scale: opening ? 1.01 : 1,
              }}
              transition={{
                opacity: { duration: 1.2, ease },
                x: { duration: 3.2, ease: [0.22, 1, 0.36, 1] },
                rotateZ: { duration: 3.2, ease: [0.22, 1, 0.36, 1] },

                y: opened
                  ? {
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      times: [0, 0.75, 1],
                    }
                  : { duration: 3.5, ease: "easeInOut", repeat: Infinity },

                scale: { duration: 0.6, ease },
              }}
              style={{ transformOrigin: "50% 50%" }}
              aria-label={opened ? "Envelope opened" : "Open invitation"}
            >
              {/* container for flap 3D */}
              <div
                className="relative mx-auto w-full max-w-[520px] sm:max-w-[640px] select-none"
                style={{ perspective: "1400px" }}
              >
                {/* ✅ CLOSED ENVELOPE (visible only before opening) */}
                <motion.img
                  src={envelopeClosed}
                  alt="Envelope (closed)"
                  draggable="false"
                  className="absolute inset-0 w-full"
                  initial={false}
                  animate={{ opacity: opening || opened ? 0 : 1 }}
                  transition={{ duration: 0.28, ease }}
                />

                {/* ✅ OPEN ENVELOPE (visible during opening and after opened) */}
                <motion.img
                  src={envelopeOpen}
                  alt="Envelope (open)"
                  draggable="false"
                  className="block w-full"
                  initial={false}
                  animate={{ opacity: showOpenEnvelope ? 1 : 0 }}
                  transition={{
                    duration: 0.28,
                    ease,
                    // appear just after click
                    delay: opening ? 0.15 : 0,
                  }}
                />

                {/* ✅ FLAP ONLY (lid) — raised on opening */}
                <motion.img
                  src={envelopeFlap}
                  alt="Envelope flap"
                  draggable="false"
                  className="absolute inset-0 w-full pointer-events-none"
                  style={{
                    transformOrigin: "50% 0%",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    // 👑 disappear BEFORE reaching full flip
                    opacity: opening ? [1, 1, 0] : 0,

                    // flap lifts upward
                    rotateX: opening ? [0, 150, 165] : 0,

                    y: opening ? [-2, -6] : 0,
                  }}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    times: [0, 0.75, 1], // 👑 fade out BEFORE end
                  }}
                />
              </div>

              {/* Tap hint only when closed */}
              {!opening && !opened && (
                <motion.div
                  className="absolute inset-x-0 -bottom-6 mx-auto w-fit rounded-full bg-black/40 px-4 py-2 text-xs font-semibold text-white backdrop-blur"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.75, ease }}
                >
                  Tap to open
                </motion.div>
              )}
            </motion.button>

            {/* Optional: close button when opened */}
            {opened && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={closeNow}
                  className="rounded-full bg-black/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-black/60"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
