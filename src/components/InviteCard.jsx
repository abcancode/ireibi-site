// src/components/InviteCard.jsx
import React, { useState } from "react";
import waxSeal from "../assets/waxseal.png";
import headerBg from "../assets/cover-bg.png";
import africaBg from "../assets/africa-bg.png";
import RSVPModal from "./RSVPModal";

const VIDEO_URL = import.meta.env.VITE_INVITE_VIDEO_URL;

export default function InviteCard() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState("yes"); // "yes" | "no"

  const openModal = (status) => {
    setInitialStatus(status);
    setRsvpOpen(true);
  };

  const closeModal = () => setRsvpOpen(false);

  const handleSubmit = (payload) => {
    // payload = { status: "yes" | "no", name, email, phone, message }
    console.log("RSVP SUBMIT:", payload);

    // for now: just close after submit (we’ll wire backend later)
    setRsvpOpen(false);
  };

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-3xl bg-[#F3F0E8] ring-1 ring-black/5">
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
            className="h-56 w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${headerBg})` }}
          />

          <div className="h-16 w-full bg-[#F3F0E8]" />

          <div className="absolute inset-x-0 top-[190px] flex items-center justify-center pointer-events-none">
            <img
              src={waxSeal}
              alt="Wax seal"
              className="w-[70px] drop-shadow-xl select-none"
              draggable="false"
            />
          </div>

          <div className="absolute inset-x-0 top-10 flex items-center justify-center">
            <div className="h-24 w-44 rounded-[26px] bg-black/0" />
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 pb-36 pt-2 sm:px-10">
          {/* VIDEO */}
          <div className="mx-auto w-full max-w-[720px] rounded-2xl bg-white/60 p-3 shadow-sm ring-1 ring-black/10">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              {VIDEO_URL ? (
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                  crossOrigin="anonymous"
                >
                  <source src={VIDEO_URL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
                  Set VITE_INVITE_VIDEO_URL in your .env file
                </div>
              )}
            </div>
          </div>

          {/* TITLE + DETAILS */}
          <div className="relative mx-auto mt-10 max-w-[720px] text-center">
            <img
              src={africaBg}
              alt=""
              className="pointer-events-none absolute left-1/2 top-[60%] w-[820px] -translate-x-1/2 -translate-y-1/2 opacity-[0.45] select-none"
              draggable="false"
            />

            <div className="relative z-10">
              <h1 className="text-[#5A3E2C]">
                IREDE AND IBI&apos;S 40TH
                <br />
                BIRTHDAY EXPERIENCE:
                <br />
                DESTINATION KENYA
              </h1>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 text-[#A06A3B]">
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

                <p className="text-sm font-semibold">
                  August 16th - August 22nd, 2026
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-[560px] space-y-4 text-center text-[13px] leading-6 text-[#6B5A4E]">
                <p>
                  Save the date for a joint milestone celebration rooted in
                  culture, style, and adventure, set against the beauty of
                  Kenya.
                </p>
                <p>More information and curated travel details to follow.</p>
              </div>

              {/* RSVP */}
              <div className="mt-10">
                <h2 className="text-sm font-semibold tracking-[0.25em] text-[#5A3E2C]">
                  ARE YOU COMING?
                </h2>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openModal("yes")}
                    className="w-full max-w-[260px] rounded-full border border-[#D8B48A] bg-white/60 px-5 py-3 text-sm font-semibold text-[#5A3E2C] shadow-sm transition hover:bg-white"
                  >
                    Yes, I will be there!
                  </button>

                  <button
                    type="button"
                    onClick={() => openModal("no")}
                    className="w-full max-w-[260px] rounded-full border border-[#D8B48A] bg-white/60 px-5 py-3 text-sm font-semibold text-[#5A3E2C] shadow-sm transition hover:bg-white"
                  >
                    No, I can&apos;t make it.
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[#A06A3B]">
                  <span className="h-1 w-1 rounded-full bg-[#A06A3B]" />
                  <span className="h-1 w-1 rounded-full bg-[#A06A3B]/60" />
                  <span className="h-1 w-1 rounded-full bg-[#A06A3B]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RSVPModal
        open={rsvpOpen}
        initialStatus={initialStatus}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
