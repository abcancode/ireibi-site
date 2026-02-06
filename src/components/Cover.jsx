// src/components/Cover.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InviteCard from "./InviteCard";

const BG_VIDEO_URL = import.meta.env.VITE_INVITE_VIDEO_URL;

export default function Cover() {
  const [scene, setScene] = useState("intro"); // "intro" | "details"
  const videoRef = useRef(null);

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
    // Browser policy: autoplay must be muted; unmute on user interaction
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      v.volume = 1;
      v.play?.().catch(() => {});
    } catch {
      // ignore
    }
  };

  const goDetails = () => {
    enableSound();
    setScene("details");
  };

  const goIntro = () => setScene("intro");

  // Optional: allow user click anywhere on intro to enable sound (still keeps CTA)
  useEffect(() => {
    if (scene !== "intro") return;
    const handler = () => enableSound();
    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, [scene]);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden">
      {/* ===== CINEMATIC BACKGROUND STACK ===== */}
      <motion.div
        className="absolute inset-0"
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
            className="h-full w-full object-cover"
            autoPlay
            loop
            playsInline
            muted // required for autoplay; we unmute on interaction
            preload="auto"
          >
            <source src={BG_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-black" />
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/60" />

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
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background:
              "linear-gradient(115deg, transparent 0%, rgba(255,220,160,0.35) 35%, transparent 70%)",
          }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 h-[100svh] w-full px-4 sm:px-6">
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
                  {/* ornamental top line */}
                  <motion.div
                    className="mx-auto mb-5 h-[1px] w-[140px] sm:w-[180px] bg-white/30"
                    initial={{ opacity: 0, scaleX: 0.6 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.15 }}
                    style={{ transformOrigin: "50% 50%" }}
                  />

                  {/* SAVE THE DATE - cinematic royal shimmer */}
                  <div className="relative inline-block">
                    <motion.h1
                      className="text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.55)]"
                      initial={{ opacity: 0, y: 10, letterSpacing: "0.35em" }}
                      animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
                      transition={{
                        duration: 1.1,
                        ease: easeSoft,
                        delay: 0.05,
                      }}
                      style={{
                        fontSize: "clamp(28px, 4.5vw, 58px)",
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
             drop-shadow-[0_12px_35px_rgba(0,0,0,0.6)]"
                    style={{ fontSize: "clamp(15px, 2vw, 20px)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.22 }}
                  >
                    Irede and Ibi’s 40th Birthday Experience
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

                  {/* ARE YOU COMING */}
                  <motion.div
                    className="mt-10 text-white/85 font-semibold tracking-[0.26em]"
                    style={{ fontSize: "clamp(11px, 1.2vw, 14px)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.45 }}
                  >
                    ARE YOU COMING?
                  </motion.div>

                  {/* CTA */}
                  <motion.button
                    onClick={goDetails}
                    className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white
                               bg-white/10 ring-1 ring-white/20 backdrop-blur
                               hover:bg-white/15 transition"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.55 }}
                  >
                    Tap to get more information
                  </motion.button>

                  {/* tiny hint about sound */}
                  <motion.div
                    className="mt-4 text-[11px] text-white/55"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease, delay: 0.8 }}
                  >
                    (Sound will play after your first tap)
                  </motion.div>

                  {/* ornamental bottom line */}
                  <motion.div
                    className="mx-auto mt-8 h-[1px] w-[140px] sm:w-[180px] bg-white/20"
                    initial={{ opacity: 0, scaleX: 0.6 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.9, ease: easeSoft, delay: 0.2 }}
                    style={{ transformOrigin: "50% 50%" }}
                  />
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

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={goIntro}
                      className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/15 transition"
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
