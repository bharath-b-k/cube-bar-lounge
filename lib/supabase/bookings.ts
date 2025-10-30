import supabase from "./client";

export interface TableBooking {
  booking_date: string; // ISO date (YYYY-MM-DD)
  time_slot: string; // e.g., "20:00-22:00"
  table_number: number;
  guest_count: number;
  customer_name: string;
  phone: string;
  email: string;
  special_requests?: string | null;
}

export interface EventBooking {
  event_type: string; // e.g., "Birthday", "Corporate", etc.
  event_date: string; // ISO date (YYYY-MM-DD)
  duration: number; // hours
  guest_count: number;
  add_ons: string[]; // e.g., ["bottle service", "decor"]
  customer_name: string;
  phone: string;
  email: string;
  event_details?: string | null;
}

export async function createTableBooking(booking: TableBooking) {
  const { data, error } = await supabase
    .from("table_bookings")
    .insert(booking)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create table booking: ${error.message}`);
  }

  return data;
}

export async function createEventBooking(booking: EventBooking) {
  const { data, error } = await supabase
    .from("event_bookings")
    .insert(booking)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event booking: ${error.message}`);
  }

  return data;
}

export async function getTableAvailability(date: string) {
  const { data, error } = await supabase
    .from("table_bookings")
    .select("*")
    .eq("booking_date", date)
    .in("status", ["pending", "approved"]);

  if (error) {
    throw new Error(`Failed to fetch table availability: ${error.message}`);
  }

  return data ?? [];
}

export async function getConfig() {
  const { data, error } = await supabase.from("config").select("*").single();

  if (error) {
    throw new Error(`Failed to fetch config: ${error.message}`);
  }

  return data;
}


