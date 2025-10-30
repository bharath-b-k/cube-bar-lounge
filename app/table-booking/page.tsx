"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay } from "date-fns";
import { toast } from "sonner";
import { createTableBooking, type TableBooking } from "@/lib/supabase/bookings";

type Step = 1 | 2 | 3 | 4;

const TIME_SLOTS = [
  "5:00 PM - 7:00 PM",
  "7:00 PM - 9:00 PM",
  "9:00 PM - 11:00 PM",
  "11:00 PM - 1:00 AM",
] as const;

export default function TableBookingPage() {
  const [step, setStep] = React.useState<Step>(1);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = React.useState<(typeof TIME_SLOTS)[number] | "">("");
  const [guestCount, setGuestCount] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [specialRequests, setSpecialRequests] = React.useState("");

  function next() {
    setStep((s) => (s === 4 ? 4 : ((s + 1) as Step)));
  }
  function back() {
    setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));
  }

  function autoAssignTableNumber(count: number): number {
    if (count <= 2) return 1;
    if (count <= 3) return 2;
    if (count <= 4) return 3;
    if (count <= 5) return 4;
    return 5;
  }

  async function onSubmit() {
    if (!selectedDate || !timeSlot || !guestCount || !name || !phone || !email) {
      toast.error("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const booking: TableBooking = {
        booking_date: selectedDate.toISOString().slice(0, 10),
        time_slot: timeSlot,
        table_number: autoAssignTableNumber(guestCount),
        guest_count: guestCount,
        customer_name: name,
        phone,
        email,
        special_requests: specialRequests || null,
      };
      await createTableBooking(booking);
      toast.success("Booking submitted! We'll confirm shortly.");
      // Reset form
      setStep(1);
      setSelectedDate(undefined);
      setTimeSlot("");
      setGuestCount(null);
      setName("");
      setPhone("");
      setEmail("");
      setSpecialRequests("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to submit booking: " + message);
    } finally {
      setLoading(false);
    }
  }

  const today = startOfDay(new Date());

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
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
          <h1 className="text-2xl font-bold text-gray-900">Book a Table</h1>
          <p className="mt-1 text-sm text-gray-600">
            Reserve your spot with a few quick steps.
          </p>

          {/* Progress */}
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-purple-600 transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="mt-8">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Select a date</h2>
                <div className="mt-4 rounded-xl bg-black/5 p-4">
                  <Calendar
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    minDate={today}
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => (selectedDate ? next() : toast.error("Pick a date"))}
                    className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-purple-500"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Choose a time slot</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`rounded-xl border p-4 text-left transition hover:translate-y-[-1px] min-h-[44px] ${
                        timeSlot === slot
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{slot}</div>
                    </button>
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
                    onClick={() => (timeSlot ? next() : toast.error("Select a time slot"))}
                    className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-purple-500 min-h-[44px] min-w-[44px]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">How many guests?</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGuestCount(n)}
                      className={`rounded-xl border px-5 py-3 font-semibold transition hover:translate-y-[-1px] min-h-[44px] ${
                        guestCount === n
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-white text-gray-900"
                      }`}
                    >
                      {n} {n === 1 ? "guest" : "guests"}
                    </button>
                  ))}
                </div>
                {guestCount && (
                  <p className="mt-3 text-sm text-gray-600">
                    Assigned table number: {autoAssignTableNumber(guestCount)}
                  </p>
                )}
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
                    onClick={() => (guestCount ? next() : toast.error("Select guest count"))}
                    className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-purple-500 min-h-[44px] min-w-[44px]"
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
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2.5"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2.5"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2.5"
                    required
                  />
                  <textarea
                    placeholder="Special requests (optional)"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="min-h-28 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:py-2.5"
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
                    className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-purple-500 disabled:opacity-60 min-h-[44px] min-w-[44px]"
                  >
                    {loading ? "Submitting..." : "Submit Booking"}
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


