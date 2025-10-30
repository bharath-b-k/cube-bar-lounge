"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Cake, Briefcase, Heart, PartyPopper } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay } from "date-fns";
import { toast } from "sonner";
import { createEventBooking, type EventBooking } from "@/lib/supabase/bookings";

type Step = 1 | 2 | 3 | 4;

const EVENT_TYPES = [
  { key: "Birthday Party", icon: Cake },
  { key: "Corporate Event", icon: Briefcase },
  { key: "Wedding Reception", icon: Heart },
  { key: "Other", icon: PartyPopper },
] as const;

const DURATIONS = [3, 4, 6] as const;
const ADD_ONS = [
  "Professional DJ",
  "Live Band/Drums",
  "West African Food Buffet",
  "Shisha Bar Setup",
  "Professional Photographer",
  "Premium Decorations",
] as const;

export default function EventBookingPage() {
  const [step, setStep] = React.useState<Step>(1);
  const [eventType, setEventType] = React.useState<string>("");
  const [eventDate, setEventDate] = React.useState<Date | null>(null);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [guestCount, setGuestCount] = React.useState<number>(20);
  const [addOns, setAddOns] = React.useState<string[]>([]);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function toggleAddOn(item: string) {
    setAddOns((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }
  function next() {
    setStep((s) => Math.min((s + 1) as Step, 4 as Step));
  }
  function back() {
    setStep((s) => Math.max((s - 1) as Step, 1 as Step));
  }

  async function onSubmit() {
    if (!eventType || !eventDate || !duration || !name || !phone || !email) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (guestCount < 20 || guestCount > 200) {
      toast.error("Guest count must be between 20 and 200.");
      return;
    }
    setLoading(true);
    try {
      const booking: EventBooking = {
        event_type: eventType,
        event_date: eventDate.toISOString().slice(0, 10),
        duration,
        guest_count: guestCount,
        add_ons: addOns,
        customer_name: name,
        phone,
        email,
        event_details: details || null,
      };
      await createEventBooking(booking);
      toast.success("Event inquiry submitted! We'll contact you with a quote.");
      // Reset form
      setStep(1);
      setEventType("");
      setEventDate(undefined);
      setDuration(null);
      setGuestCount(20);
      setAddOns([]);
      setName("");
      setPhone("");
      setEmail("");
      setDetails("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to submit event booking: " + message);
    } finally {
      setLoading(false);
    }
  }

  const today = startOfDay(new Date());

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-pink-900 to-gray-900 text-white">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Home
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 text-black shadow-xl backdrop-blur-lg md:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Host an Event</h1>
          <p className="mt-1 text-sm text-gray-600">
            Tell us about your event and we'll help make it unforgettable.
          </p>

          {/* Progress */}
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-pink-600 transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="mt-8">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">What type of event?</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {EVENT_TYPES.map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEventType(key)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition hover:translate-y-[-1px] min-h-[44px] ${
                        eventType === key
                          ? "border-pink-600 bg-pink-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 text-pink-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="font-semibold text-gray-900">{key}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => (eventType ? next() : toast.error("Select an event type"))}
                    className="rounded-lg bg-pink-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-pink-500"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Event details</h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div className="rounded-xl bg-black/5 p-4">
                    <Calendar
                      selected={eventDate}
                      onChange={setEventDate}
                      minDate={today}
                    />
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-medium text-gray-900">Duration</div>
                    <div className="flex flex-wrap gap-3">
                      {DURATIONS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={`rounded-xl border px-5 py-3 font-semibold transition hover:translate-y-[-1px] min-h-[44px] ${
                            duration === d
                              ? "border-pink-600 bg-pink-50 text-pink-700"
                              : "border-gray-200 bg-white text-gray-900"
                          }`}
                        >
                          {d} hours
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Guest count
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={200}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <p className="mt-1 text-xs text-gray-600">Min 20, max 200.</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 min-h-[44px] min-w-[44px]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      eventDate && duration
                        ? next()
                        : toast.error("Select date and duration")
                    }
                    className="rounded-lg bg-pink-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-pink-500 min-h-[44px] min-w-[44px]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add-ons</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {ADD_ONS.map((item) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:translate-y-[-1px] hover:bg-gray-50 min-h-[44px]"
                    >
                      <input
                        type="checkbox"
                        checked={addOns.includes(item)}
                        onChange={() => toggleAddOn(item)}
                        className="h-4 w-4 accent-pink-600"
                      />
                      <span className="text-gray-900">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 min-h-[44px] min-w-[44px]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-lg bg-pink-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-pink-500 min-h-[44px] min-w-[44px]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-2.5"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-2.5"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-2.5"
                    required
                  />
                  <textarea
                    placeholder="Event details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="min-h-28 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-2.5"
                  />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 min-h-[44px] min-w-[44px]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="rounded-lg bg-pink-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-pink-500 disabled:opacity-60 min-h-[44px] min-w-[44px]"
                  >
                    {loading ? "Submitting..." : "Submit Inquiry"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


