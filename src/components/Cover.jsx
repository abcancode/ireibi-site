// src/components/Cover.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InviteCard from "./InviteCard";

const BG_VIDEO_URL = import.meta.env.VITE_INVITE_VIDEO_URL;

export default function Cover() {
  const [scene, setScene] = useState("intro"); // "intro" | "details"
  const videoRef = useRef(null);

  const [soundOn, setSoundOn] = useState(false);

  const ease = useMemo(() => [0.16, 1, 0.3, 1], []);
  const easeSoft = useMemo(() => [0.22, 1, 0.36, 1], []);

  // Gentle "cinematic camera" movement on the whole background stack
  const bgMotion = useMemo(
    () => ({
      scale: [1.06, 1.085, 1.06],
      x: [0, -10, 0],
      y: [0, 6, 0],
    }),
    [],
  );

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      v.volume = 1;
      v.play?.().catch(() => {});
      setSoundOn(true);
    } catch {
      // ignore
    }
  };

  const disableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = true;
      v.volume = 0;
      setSoundOn(false);
    } catch {
      // ignore
    }
  };

  const toggleSound = () => {
    if (soundOn) disableSound();
    else enableSound();
  };

  const goDetails = () => {
    enableSound();
    setScene("details");
  };

  const goIntro = () => setScene("intro");

  // Optional: user first interaction enables sound
  useEffect(() => {
    const handler = () => enableSound();
    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  return (
    <section
      className={[
        // ✅ clamp horizontal overflow ALWAYS (fixes right overflow)
        "relative w-full h-[100svh] overflow-x-hidden",
        // ✅ only y-scroll changes per scene
        scene === "details" ? "overflow-y-auto" : "overflow-y-hidden",
      ].join(" ")}
    >
      {/* ===== CINEMATIC BACKGROUND STACK ===== */}
      <motion.div
        // ✅ also clip inside the animated stack so transforms can't expand layout width
        className="absolute inset-0 overflow-hidden"
        animate={bgMotion}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {BG_VIDEO_URL ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover brightness-[1.08] contrast-[1.05] saturate-[1.03]"
            autoPlay
            loop
            playsInline
            muted
            preload="auto"
          >
            <source src={BG_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-black" />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/22 via-black/10 to-black/45" />

        {/* soft vignette */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* subtle film grain */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.13]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 2px, transparent 4px)",
          }}
        />

        {/* slow royal light sweep */}
        <motion.div
          // ✅ keep effect, but ensure it can’t create horizontal scroll width
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 0%, rgba(255,220,160,0.35) 35%, transparent 70%)",
            willChange: "transform",
          }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>

      {/* 🔉 SOUND TOGGLE (top-right) */}
      <div className="absolute right-4 top-4 z-30">
        <button
          type="button"
          onClick={toggleSound}
          className="rounded-full bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 backdrop-blur
                     hover:bg-white/15 transition shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          aria-label={soundOn ? "Mute sound" : "Unmute sound"}
          title={soundOn ? "Mute" : "Unmute"}
        >
          {soundOn ? "🔊" : "🔉"}
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 h-[100svh] w-full px-3 sm:px-4">
        <div className="mx-auto h-full w-full max-w-[980px]">
          <AnimatePresence mode="wait">
            {/* ===================== INTRO SCENE ===================== */}
            {scene === "intro" ? (
              <motion.div
                key="intro"
                className="h-full flex items-center justify-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <motion.div
                  className="relative w-full max-w-[720px]"
                  initial={{ y: 18, scale: 0.99, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: easeSoft }}
                >
                  {/* SAVE THE DATE - slightly bigger */}
                  <div className="relative inline-block">
                    <motion.h1
                      className="text-white text-center drop-shadow-[0_10px_35px_rgba(0,0,0,0.55)]"
                      initial={{ opacity: 0, y: 10, letterSpacing: "0.35em" }}
                      animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
                      transition={{
                        duration: 1.1,
                        ease: easeSoft,
                        delay: 0.05,
                      }}
                      style={{
                        fontSize: "clamp(34px, 5.2vw, 66px)",
                        lineHeight: 1.02,
                        fontWeight: 700,
                      }}
                    >
                      SAVE THE DATE
                    </motion.h1>

                    {/* Shimmer sweep */}
                    <motion.span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 0%, rgba(255,235,200,0.55) 35%, transparent 70%)",
                        mixBlendMode: "soft-light",
                        filter: "blur(1px)",
                      }}
                      animate={{ x: ["-130%", "130%"], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 2.6,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2.8,
                      }}
                    />
                  </div>

                  {/* subtitle */}
                  <motion.p
                    className="mt-5 text-white font-bold tracking-[0.04em]
             whitespace-nowrap text-center
             drop-shadow-[0_12px_35px_rgba(0,0,0,0.6)]"
                    style={{
                      fontSize: "clamp(12px, 3.5vw, 20px)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.22 }}
                  >
                    Irede and Ibi’s 40th Birthday&nbsp;Experience
                  </motion.p>

                  <motion.p
                    className="mt-2 text-white/85 tracking-[0.09em]"
                    style={{ fontSize: "clamp(12px, 1.4vw, 15px)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.32 }}
                  >
                    Destination: Kenya
                  </motion.p>

                  <motion.button
                    onClick={goDetails}
                    className="mt-10 inline-flex items-center justify-center rounded-full px-6 py-3
                               text-sm font-semibold text-white
                               bg-white/10 ring-1 ring-white/20 backdrop-blur
                               hover:bg-white/15 transition"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.48 }}
                  >
                    ARE YOU COMING?
                  </motion.button>

                  <motion.div
                    className="
    mt-3
    text-[10px] sm:text-[11px]
    tracking-[0.18em]
    text-white/45
    font-medium
    select-none
  "
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.7 }}
                  >
                    Tap to get more information
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              /* ===================== DETAILS SCENE ===================== */
              <motion.div
                key="details"
                className="h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <motion.div
                  className="w-full"
                  initial={{ y: 22, scale: 0.99, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: easeSoft }}
                >
                  <InviteCard />

                  <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={goIntro}
                      className="pointer-events-auto rounded-full bg-white/10 px-4 py-2
                               text-xs font-semibold text-white
                               ring-1 ring-white/20 backdrop-blur
                               hover:bg-white/15 transition
                               shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
