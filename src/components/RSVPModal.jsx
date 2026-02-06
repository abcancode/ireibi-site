// src/components/RSVPModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function RSVPModal({
  open,
  initialStatus = "yes", // "yes" | "no" | "other"
  onClose,
  onSubmit,
}) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    // ✅ Other fields
    arrivalDate: "",
    departureDate: "",
    daysAttending: "",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setStatus(initialStatus);
  }, [open, initialStatus]);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // If user switches away from "other", clear other-only fields (keeps data clean)
  useEffect(() => {
    if (status !== "other") {
      setForm((p) => ({
        ...p,
        arrivalDate: "",
        departureDate: "",
        daysAttending: "",
      }));
    }
  }, [status]);

  const chips = useMemo(() => {
    if (status === "no") {
      return [
        "Sorry I won't be available to attend the event.",
        "Sad to miss this!",
        "Thanks for thinking of me!",
      ];
    }

    if (status === "other") {
      return [
        "I’ll attend for part of the trip.",
        "I’ll join from (date) to (date).",
        "I can’t stay the full duration, but I’ll be there!",
      ];
    }

    return [
      "Thanks for thinking of me!",
      "Excited to be there!",
      "See you in Kenya!",
    ];
  }, [status]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    return e;
  }, [form.name, form.phone]);

  const handleChange = (key) => (evt) => {
    setForm((p) => ({ ...p, [key]: evt.target.value }));
  };

  const handleChip = (text) => {
    setForm((p) => ({
      ...p,
      message: p.message?.trim() ? `${p.message}\n${text}` : text,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) return;

    const payload = {
      status, // "yes" | "no" | "other"
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      arrivalDate: status === "other" ? form.arrivalDate : "",
      departureDate: status === "other" ? form.departureDate : "",
      daysAttending: status === "other" ? form.daysAttending : "",
    };

    onSubmit?.(payload);
  };

  if (!mounted) return null;

  const modalUi = (
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
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close RSVP form"
            className="absolute inset-0 h-[100svh] w-full bg-black/35 backdrop-blur-[6px]"
            onClick={onClose}
          />

          {/* Centering wrapper */}
          <div className="relative z-[10000] flex h-[100svh] w-full items-center justify-center px-3 py-4 sm:px-6 sm:py-8">
            <motion.div
              className={[
                "relative w-full",
                "max-w-[96vw] sm:max-w-[680px] md:max-w-[860px] lg:max-w-[1040px] xl:max-w-[1100px]",
                "overflow-hidden rounded-2xl sm:rounded-3xl bg-white",
                "shadow-[0_30px_80px_rgba(0,0,0,0.25)] ring-1 ring-black/10",
                "max-h-[92svh]",
              ].join(" ")}
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative border-b border-black/10 px-4 py-3 sm:px-8 sm:py-4">
                <h3 className="text-center text-[16px] font-semibold text-neutral-900 sm:text-[18px]">
                  Are you coming to this event?
                </h3>

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-black/5 sm:right-4 sm:top-3"
                  aria-label="Close"
                >
                  <span className="text-[18px] leading-none">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="bg-white">
                {/* Scrollable content area */}
                <div className="max-h-[calc(92svh-132px)] overflow-y-auto">
                  <div className="px-4 py-4 sm:px-8 sm:py-6">
                    {/* Toggle */}
                    <div className="rounded-2xl sm:rounded-full bg-neutral-100 p-1">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => setStatus("yes")}
                          className={[
                            "rounded-xl sm:rounded-full px-4 py-3 text-[13px] sm:text-sm font-semibold transition",
                            status === "yes"
                              ? "bg-[#7A5A43] text-white shadow"
                              : "text-neutral-700 hover:bg-white/60",
                          ].join(" ")}
                        >
                          I will attend
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatus("other")}
                          className={[
                            "rounded-xl sm:rounded-full px-4 py-3 text-[13px] sm:text-sm font-semibold transition",
                            status === "other"
                              ? "bg-[#7A5A43] text-white shadow"
                              : "text-neutral-700 hover:bg-white/60",
                          ].join(" ")}
                        >
                          Other (Partial)
                        </button>

                        <button
                          type="button"
                          onClick={() => setStatus("no")}
                          className={[
                            "rounded-xl sm:rounded-full px-4 py-3 text-[13px] sm:text-sm font-semibold transition",
                            status === "no"
                              ? "bg-[#7A5A43] text-white shadow"
                              : "text-neutral-700 hover:bg-white/60",
                          ].join(" ")}
                        >
                          I will not attend
                        </button>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label className="mb-2 block text-[12px] sm:text-[13px] font-semibold text-neutral-700">
                          What’s your name?{" "}
                          <span className="text-emerald-600">*</span>
                        </label>
                        <input
                          value={form.name}
                          onChange={handleChange("name")}
                          placeholder="Enter your full name here"
                          className={[
                            "w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition",
                            errors.name
                              ? "border-red-300 focus:border-red-400"
                              : "border-neutral-200 focus:border-neutral-400",
                          ].join(" ")}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold text-neutral-700">
                          What’s your Email Address?
                          <span
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 text-[10px] font-bold text-neutral-500"
                            title="Optional"
                          >
                            i
                          </span>
                        </label>
                        <input
                          value={form.email}
                          onChange={handleChange("email")}
                          placeholder="Enter your Email Address"
                          type="email"
                          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[14px] outline-none transition focus:border-neutral-400"
                        />
                      </div>

                      {/* Phone */}
                      <div className="md:col-span-1">
                        <label className="mb-2 block text-[12px] sm:text-[13px] font-semibold text-neutral-700">
                          What’s your Phone Number?{" "}
                          <span className="text-emerald-600">*</span>
                        </label>
                        <input
                          value={form.phone}
                          onChange={handleChange("phone")}
                          placeholder="Enter your Phone Number"
                          inputMode="tel"
                          className={[
                            "w-full rounded-xl border px-4 py-3 text-[14px] outline-none transition",
                            errors.phone
                              ? "border-red-300 focus:border-red-400"
                              : "border-neutral-200 focus:border-neutral-400",
                          ].join(" ")}
                        />
                      </div>

                      {/* ✅ Other-only attendance info */}
                      {status === "other" ? (
                        <div className="md:col-span-1">
                          <label className="mb-2 block text-[12px] sm:text-[13px] font-semibold text-neutral-700">
                            Partial attendance details{" "}
                            <span className="text-neutral-400">(Optional)</span>
                          </label>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <input
                              value={form.arrivalDate}
                              onChange={handleChange("arrivalDate")}
                              type="date"
                              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[14px] outline-none transition focus:border-neutral-400"
                              aria-label="Arrival date"
                            />

                            <input
                              value={form.departureDate}
                              onChange={handleChange("departureDate")}
                              type="date"
                              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[14px] outline-none transition focus:border-neutral-400"
                              aria-label="Departure date"
                            />
                          </div>

                          <select
                            value={form.daysAttending}
                            onChange={handleChange("daysAttending")}
                            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-[14px] outline-none transition focus:border-neutral-400"
                            aria-label="Days attending"
                          >
                            <option value="">
                              How many days will you attend? (optional)
                            </option>
                            <option value="1-2">1–2 days</option>
                            <option value="3-4">3–4 days</option>
                            <option value="5-6">5–6 days</option>
                            <option value="7+">7+ days</option>
                            <option value="unsure">Not sure yet</option>
                          </select>

                          <p className="mt-2 text-[11px] text-neutral-500">
                            If you’re unsure, leave dates empty and explain in
                            your message.
                          </p>
                        </div>
                      ) : null}

                      {/* Message */}
                      <div className="md:col-span-2">
                        <div className="mb-2 text-[14px] sm:text-[16px] font-semibold text-neutral-900">
                          ✨ Your Private message to the host{" "}
                          <span className="font-normal text-neutral-500">
                            (Optional)
                          </span>
                        </div>

                        <textarea
                          value={form.message}
                          onChange={handleChange("message")}
                          placeholder={
                            status === "other"
                              ? "Tell the host what part of the trip you’ll attend (e.g., Aug 18–20 only)."
                              : "Enter your message to the host here"
                          }
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-neutral-200 px-4 py-4 text-[14px] outline-none transition focus:border-neutral-400"
                        />

                        {/* Chips */}
                        <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                          {chips.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleChip(t)}
                              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-[11px] sm:text-[12px] text-neutral-700 shadow-sm transition hover:bg-neutral-50"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-black/10 bg-neutral-50 px-4 py-4 sm:px-8 sm:py-5">
                  <button
                    type="submit"
                    className="mx-auto block w-full max-w-[560px] rounded-full bg-[#9C5A12] px-6 py-3 sm:py-4 text-sm font-semibold text-white shadow-md transition hover:brightness-105 active:brightness-95"
                  >
                    Confirm and Continue
                  </button>

                  <p className="mt-2 text-center text-[10px] sm:text-[11px] text-neutral-500">
                    We’ll use your details only for this RSVP.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalUi, document.body);
}
