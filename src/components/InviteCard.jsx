// src/components/InviteCard.jsx
import React, { useState } from "react";
import headerBg from "../assets/cover-bg.png";
import africaBg from "../assets/africa-bg.png";
import RSVPModal from "./RSVPModal";
import RSVPConfirmModal from "./RSVPConfirmModal";

export default function InviteCard() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState("yes"); // "yes" | "no" | "other"

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState("yes");

  const openModal = (status) => {
    setInitialStatus(status);
    setRsvpOpen(true);
  };

  const closeModal = () => setRsvpOpen(false);

  const SHEET_WEBAPP_URL = import.meta.env.VITE_RSVP_SHEET_URL;

  const handleSubmit = async (payload) => {
    try {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));

      const res = await fetch(SHEET_WEBAPP_URL, {
        method: "POST",
        body: fd, // ✅ form POST
      });

      const data = await res.json().catch(() => ({}));
      console.log("RSVP saved:", data);

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to save RSVP");
      }

      // ✅ close RSVP modal
      setRsvpOpen(false);

      // ✅ show confirmation modal (tailored by yes/other/no)
      setConfirmStatus(payload.status || "yes");
      setConfirmOpen(true);
    } catch (err) {
      console.error("RSVP save error:", err);
      alert("Sorry — your RSVP could not be saved. Please try again.");
      throw err; // ✅ so RSVPModal can stop "Submitting..."
    }
  };

  return (
    <>
      {/* ✅ Keeps card inside viewport and prevents horizontal overflow on small screens */}
      <div className="min-h-[100svh] w-full overflow-x-hidden flex items-center justify-center px-3 sm:px-6 py-6">
        <div className="w-full max-w-[980px]">
          <div className="relative w-full max-w-[100vw] overflow-hidden rounded-3xl bg-[#F3F0E8] ring-1 ring-black/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 55% 60%, rgba(0,0,0,0.35), transparent 58%)",
              }}
            />

            {/* TOP HERO STRIP */}
            <div className="relative">
              <div
                className="w-full bg-cover bg-center bg-no-repeat h-40 xs:h-44 sm:h-52 md:h-56 lg:h-60"
                style={{ backgroundImage: `url(${headerBg})` }}
              />
              <div className="w-full bg-[#F3F0E8] h-10 sm:h-14" />

              {/* reserved logo space */}
              <div className="absolute inset-x-0 top-6 sm:top-10 flex items-center justify-center">
                <div className="h-16 w-36 sm:h-24 sm:w-44 rounded-[26px] bg-black/0" />
              </div>
            </div>

            {/* BODY */}
            <div className="px-4 xs:px-5 sm:px-8 md:px-10 pt-4 pb-10 sm:pb-12">
              {/* TITLE + DETAILS */}
              <div className="relative mx-auto max-w-[760px] text-center overflow-hidden">
                <img
                  src={africaBg}
                  alt=""
                  className="pointer-events-none absolute left-1/2 top-[56%]
                             w-[520px] xs:w-[640px] sm:w-[760px] md:w-[860px] lg:w-[920px]
                             max-w-none
                             -translate-x-1/2 -translate-y-1/2
                             opacity-[0.55] sm:opacity-[0.75]
                             select-none"
                  draggable="false"
                />

                <div className="relative z-10">
                  <div className="text-center">
                    <h1
                      className="font-semibold text-[#5A3E2C] tracking-[0.04em]"
                      style={{ fontSize: "clamp(22px, 3vw, 30px)" }}
                    >
                      Irede and Ibi’s 40th Birthday Experience
                    </h1>

                    <p
                      className="mt-2 text-[#A06A3B] tracking-[0.08em]"
                      style={{ fontSize: "clamp(13px, 1.6vw, 16px)" }}
                    >
                      Destination: Kenya
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 flex flex-col items-center justify-center gap-3 text-[#A06A3B]">
                    <div className="h-1 w-1 rounded-full bg-[#A06A3B]" />

                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 ring-1 ring-black/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-6 w-6 text-[#A06A3B]"
                      >
                        <path
                          d="M7 3v2M17 3v2M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>

                    <p className="text-[13px] sm:text-sm font-semibold">
                      August 16th - August 22nd, 2026
                    </p>
                  </div>

                  <div className="mx-auto mt-7 sm:mt-10 max-w-[600px] space-y-3 sm:space-y-4 text-center text-[12.5px] sm:text-[13px] leading-6 text-[#6B5A4E]">
                    <p>
                      Save the date for a joint milestone celebration rooted in
                      culture, style, and adventure, set against the beauty of
                      Kenya.
                    </p>
                    <p>
                      More information and curated travel details to follow.
                    </p>
                  </div>

                  {/* RSVP buttons */}
                  <div className="mt-8 sm:mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => openModal("yes")}
                        className="h-[52px] w-full rounded-full border border-[#D8B48A] bg-white/60 px-5 text-sm font-semibold text-[#5A3E2C] shadow-sm transition hover:bg-white"
                      >
                        Yes, I will be there!
                      </button>

                      <button
                        type="button"
                        onClick={() => openModal("other")}
                        className="h-[52px] w-full rounded-full border border-[#D8B48A] bg-[#F7E7D3]/70 px-5 text-sm font-semibold text-[#5A3E2C] shadow-sm transition hover:bg-[#F7E7D3]"
                      >
                        Other (Partial Stay)
                      </button>

                      <button
                        type="button"
                        onClick={() => openModal("no")}
                        className="h-[52px] w-full rounded-full border border-[#D8B48A] bg-white/60 px-5 text-sm font-semibold text-[#5A3E2C] shadow-sm transition hover:bg-white"
                      >
                        No, I can&apos;t make it.
                      </button>
                    </div>

                    <div className="mt-7 sm:mt-8 flex items-center justify-center gap-2 text-[#A06A3B]">
                      <span className="h-1 w-1 rounded-full bg-[#A06A3B]" />
                      <span className="h-1 w-1 rounded-full bg-[#A06A3B]/60" />
                      <span className="h-1 w-1 rounded-full bg-[#A06A3B]/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      <RSVPModal
        open={rsvpOpen}
        initialStatus={initialStatus}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* ✅ Royal confirmation modal */}
      <RSVPConfirmModal
        open={confirmOpen}
        status={confirmStatus}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
