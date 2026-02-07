import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const copyByStatus = {
  yes: {
    badge: "Confirmed",
    title: "RSVP Received",
    body: "Thank you. Your attendance has been confirmed for Irede & Ibi’s 40th Birthday Experience.",
    foot: "We can’t wait to celebrate with you in Kenya.",
  },
  other: {
    badge: "Noted",
    title: "RSVP Received",
    body: "Thank you. Your partial attendance has been recorded successfully.",
    foot: "We’ll follow up with curated details closer to the date.",
  },
  no: {
    badge: "Noted",
    title: "RSVP Received",
    body: "Thank you for letting us know. Your response has been recorded.",
    foot: "You’ll still receive key updates as they become available.",
  },
};

export default function RSVPConfirmModal({ open, status = "yes", onClose }) {
  const c = copyByStatus[status] || copyByStatus.yes;

  const ui = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* backdrop */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation"
            className="absolute inset-0 h-[100svh] w-full bg-black/45 backdrop-blur-[8px]"
          />

          <div className="relative z-[10000] flex h-[100svh] w-full items-center justify-center px-4 py-6">
            <motion.div
              initial={{ y: 18, opacity: 0, scale: 0.985 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
            >
              {/* luxury top glow */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F7E7D3] to-transparent opacity-80" />
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#D8B48A]/30 blur-3xl" />
              <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#9C5A12]/15 blur-3xl" />

              <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-[#D8B48A]/60 bg-[#F7E7D3]/45 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#7A5A43]">
                    {c.badge.toUpperCase()}
                  </span>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-black/5"
                    aria-label="Close"
                  >
                    <span className="text-[18px] leading-none">×</span>
                  </button>
                </div>

                <h3 className="mt-5 text-center text-[18px] sm:text-[20px] font-semibold text-neutral-900">
                  {c.title}
                </h3>

                <p className="mt-3 text-center text-[13px] sm:text-[14px] leading-6 text-neutral-600">
                  {c.body}
                </p>

                <div className="mx-auto mt-5 h-px w-24 bg-black/10" />

                <p className="mt-4 text-center text-[12px] sm:text-[13px] text-neutral-500">
                  {c.foot}
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="mx-auto block w-full max-w-[360px] rounded-full bg-[#9C5A12] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 active:brightness-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(ui, document.body);
}
