import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InviteCard from "./InviteCard";
import ScrollToTopButton from "./ScrollToTopButton";

import envelopeOpen from "../assets/envelope-open.png";

export default function Cover() {
  const [opened, setOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ease = useMemo(() => [0.16, 1, 0.3, 1], []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

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

      {/* Optional tint overlay (keep if you like the mood) */}
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
            {/* INVITE CARD */}
            <AnimatePresence>
              {opened && (
                <motion.div
                  key="invite-card"
                  className="relative z-20 mx-auto w-full"
                  initial={{ opacity: 0, y: 24, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.99 }}
                  transition={{ duration: 0.8, ease }}
                >
                  <InviteCard />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ENVELOPE */}
            <motion.button
              type="button"
              onClick={() => setOpened(true)}
              className={[
                "relative z-10 mx-auto block w-full focus:outline-none",
                opened ? "pointer-events-none opacity-0" : "opacity-100",
              ].join(" ")}
              whileHover={!opened ? { y: -3 } : undefined}
              whileTap={!opened ? { scale: 0.985 } : undefined}
              initial={{
                opacity: 0,
                x: -600,
                rotateZ: -90,
                scale: 0.96,
              }}
              animate={{
                opacity: [0, 1, 1],
                x: [-600, -40, 0],
                rotateZ: [-90, -90, 0],
                y: [0, -6, 0],
                scale: 1,
              }}
              transition={{
                opacity: { duration: 1.2, ease },
                x: {
                  duration: 3.2,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.7, 1],
                },
                rotateZ: {
                  duration: 3.2,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.7, 1],
                },
                y: { duration: 3.5, ease: "easeInOut", repeat: Infinity },
                scale: { duration: 0.95, ease },
              }}
              style={{ transformOrigin: "50% 50%" }}
              aria-label={opened ? "Envelope opened" : "Open invitation"}
            >
              <motion.img
                src={envelopeOpen}
                alt="Envelope"
                className="mx-auto w-full max-w-[520px] sm:max-w-[640px] select-none"
                draggable="false"
              />

              {!opened && (
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
                  onClick={() => setOpened(false)}
                  className="rounded-full bg-black/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-black/60"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <ScrollToTopButton />
    </section>
  );
}
