"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  LayoutGrid,
  Table as TableIcon,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase/client";

type TableBookingRow = {
  id: string;
  booking_date: string;
  time_slot: string;
  table_number: number;
  guest_count: number;
  customer_name: string;
  phone: string;
  status: "pending" | "approved" | "rejected" | string;
  created_at?: string;
};

type EventBookingRow = {
  id: string;
  event_type: string;
  event_date: string;
  duration: number;
  guest_count: number;
  add_ons: string[];
  customer_name: string;
  phone: string;
  status: "inquiry" | "quoted" | "confirmed" | "cancelled" | string;
  created_at?: string;
};

type TabKey = "table" | "event";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabKey>("table");
  const [tableStatusFilter, setTableStatusFilter] = React.useState<
    "All" | "pending" | "approved" | "rejected"
  >("All");
  const [eventStatusFilter, setEventStatusFilter] = React.useState<
    "All" | "inquiry" | "quoted" | "confirmed" | "cancelled"
  >("All");

  const [tableBookings, setTableBookings] = React.useState<TableBookingRow[]>(
    []
  );
  const [eventBookings, setEventBookings] = React.useState<EventBookingRow[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);

  // Guard route by localStorage flag
  React.useEffect(() => {
    const isAdmin = typeof window !== "undefined" && localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [router]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [{ data: tData, error: tErr }, { data: eData, error: eErr }] =
        await Promise.all([
          supabase
            .from("table_bookings")
            .select("*")
            .order("booking_date", { ascending: false })
            .order("created_at", { ascending: false, nullsFirst: false }),
          supabase
            .from("event_bookings")
            .select("*")
            .order("event_date", { ascending: false })
            .order("created_at", { ascending: false, nullsFirst: false }),
        ]);
      if (tErr) throw tErr;
      if (eErr) throw eErr;
      setTableBookings((tData as TableBookingRow[]) ?? []);
      setEventBookings((eData as EventBookingRow[]) ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to load bookings: " + message);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  React.useEffect(() => {
    fetchAll();
  }, []);

  // Realtime subscriptions
  React.useEffect(() => {
    const channel = supabase
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "table_bookings" },
        () => fetchAll()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "table_bookings" },
        () => fetchAll()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "event_bookings" },
        () => fetchAll()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "event_bookings" },
        () => fetchAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateTableStatus(id: string, status: TableBookingRow["status"]) {
    try {
      const { error } = await supabase
        .from("table_bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success("Table booking updated.");
      await fetchAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Update failed: " + message);
    }
  }

  async function updateEventStatus(id: string, status: EventBookingRow["status"]) {
    try {
      const { error } = await supabase
        .from("event_bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      toast.success("Event booking updated.");
      await fetchAll();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Update failed: " + message);
    }
  }

  function logout() {
    localStorage.removeItem("isAdmin");
    router.replace("/admin/login");
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const pendingTables = tableBookings.filter((b) => b.status === "pending").length;
  const pendingEvents = eventBookings.filter((b) => b.status === "inquiry").length;
  const todaysCount =
    tableBookings.filter((b) => b.booking_date === todayStr).length +
    eventBookings.filter((b) => b.event_date === todayStr).length;

  const filteredTable = tableBookings.filter((b) =>
    tableStatusFilter === "All" ? true : b.status === tableStatusFilter
  );
  const filteredEvent = eventBookings.filter((b) =>
    eventStatusFilter === "All" ? true : b.status === eventStatusFilter
  );

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">Cube Bar Lounge Admin</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Go to site
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Pending Table Bookings"
            value={pendingTables}
            icon={<TableIcon className="h-5 w-5 text-purple-300" />}
          />
          <SummaryCard
            title="Pending Event Inquiries"
            value={pendingEvents}
            icon={<Clock className="h-5 w-5 text-pink-300" />}
          />
          <SummaryCard
            title="Today's Bookings"
            value={todaysCount}
            icon={<CalendarDays className="h-5 w-5 text-green-300" />}
          />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("table")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "table" ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            Table Bookings
          </button>
          <button
            onClick={() => setActiveTab("event")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "event" ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            Event Bookings
          </button>
        </div>

        {/* Tables */}
        <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
          {activeTab === "table" ? (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-white/80">{filteredTable.length} records</div>
                <select
                  value={tableStatusFilter}
                  onChange={(e) =>
                    setTableStatusFilter(e.target.value as typeof tableStatusFilter)
                  }
                  className="rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-sm text-white focus:outline-none"
                >
                  <option>All</option>
                  <option>pending</option>
                  <option>approved</option>
                  <option>rejected</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-white/70">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Time</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Guests</th>
                      <th className="px-3 py-2">Table #</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTable.map((b) => (
                      <tr key={b.id} className="border-t border-white/10">
                        <td className="px-3 py-2">{b.booking_date}</td>
                        <td className="px-3 py-2">{b.time_slot}</td>
                        <td className="px-3 py-2">{b.customer_name}</td>
                        <td className="px-3 py-2">{b.phone}</td>
                        <td className="px-3 py-2">{b.guest_count}</td>
                        <td className="px-3 py-2">{b.table_number}</td>
                        <td className="px-3 py-2 capitalize">{b.status}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateTableStatus(b.id, "approved")}
                              className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-white transition hover:bg-green-500"
                            >
                              <CheckCircle className="h-4 w-4" /> Approve
                            </button>
                            <button
                              onClick={() => updateTableStatus(b.id, "rejected")}
                              className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-white transition hover:bg-red-500"
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTable.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-white/70">
                          No records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm text-white/80">{filteredEvent.length} records</div>
                <select
                  value={eventStatusFilter}
                  onChange={(e) =>
                    setEventStatusFilter(e.target.value as typeof eventStatusFilter)
                  }
                  className="rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-sm text-white focus:outline-none"
                >
                  <option>All</option>
                  <option>inquiry</option>
                  <option>quoted</option>
                  <option>confirmed</option>
                  <option>cancelled</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-white/70">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Event Type</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Guests</th>
                      <th className="px-3 py-2">Add-ons</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvent.map((b) => (
                      <tr key={b.id} className="border-t border-white/10">
                        <td className="px-3 py-2">{b.event_date}</td>
                        <td className="px-3 py-2">{b.event_type}</td>
                        <td className="px-3 py-2">{b.customer_name}</td>
                        <td className="px-3 py-2">{b.phone}</td>
                        <td className="px-3 py-2">{b.guest_count}</td>
                        <td className="px-3 py-2">
                          {Array.isArray(b.add_ons) && b.add_ons.length > 0
                            ? b.add_ons.join(", ")
                            : "—"}
                        </td>
                        <td className="px-3 py-2 capitalize">{b.status}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updateEventStatus(b.id, "quoted")}
                              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-500"
                            >
                              <Clock className="h-4 w-4" /> Quoted
                            </button>
                            <button
                              onClick={() => updateEventStatus(b.id, "confirmed")}
                              className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-white transition hover:bg-green-500"
                            >
                              <CheckCircle className="h-4 w-4" /> Confirm
                            </button>
                            <button
                              onClick={() => updateEventStatus(b.id, "cancelled")}
                              className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-white transition hover:bg-red-500"
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEvent.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-white/70">
                          No records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur">
      <div>
        <div className="text-sm text-white/70">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      <div className="rounded-xl bg-white/10 p-3">{icon}</div>
    </div>
  );
}


