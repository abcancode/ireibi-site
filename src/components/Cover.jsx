import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InviteCard from "./InviteCard";

import bg from "../assets/cover-bg.png";
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
        "min-h-screen w-full bg-cover bg-center bg-no-repeat relative",
        "overflow-x-hidden", // ✅ keep horizontal hidden
        opened ? "overflow-y-auto" : "overflow-y-hidden", // ✅ allow scroll ONLY when opened
      ].join(" ")}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* optional overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* ✅ On mobile we align to top so the lifted card never gets cut */}
      <div className="relative z-10 min-h-screen flex items-start sm:items-center justify-center px-4 sm:px-6 py-10">
        <motion.div
          className="w-full max-w-[720px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        >
          <div className="relative">
            {/* CONTENT CARD (slides out) */}
            <AnimatePresence>
              {opened && (
                <motion.div
                  key="invite-card"
                  className="relative z-20 mx-auto w-[92%] rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5"
                  initial={{ opacity: 0, y: 80, scale: 0.985 }}
                  // ✅ Less lift on mobile so the top doesn't go off screen
                  animate={{ opacity: 1, y: isMobile ? -18 : -45, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.985 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <InviteCard />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ENVELOPE */}
            <motion.button
              type="button"
              onClick={() => setOpened(true)}
              className="relative z-10 mx-auto block w-full focus:outline-none"
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
                y: opened ? 28 : [0, -6, 0],
                scale: opened ? 0.985 : 1,
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
                y: opened
                  ? { duration: 0.95, ease }
                  : { duration: 3.5, ease: "easeInOut", repeat: Infinity },
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
