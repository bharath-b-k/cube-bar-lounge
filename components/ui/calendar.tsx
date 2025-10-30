"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

export interface CalendarProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function Calendar({ selected, onChange, minDate, maxDate, className }: CalendarProps) {
  return (
    <div className={className}>
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={selected ?? undefined}
          onSelect={(d) => onChange(d ?? null)}
          required={false}
          fromDate={minDate}
          toDate={maxDate}
          showOutsideDays
          fixedWeeks
          captionLayout="dropdown"
          className="rdp"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-3",
            caption: "flex justify-between px-2 pt-2 items-center",
            caption_label: "text-sm font-medium text-gray-900",
            nav: "flex items-center gap-2",
            button_previous:
              "h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            button_next:
              "h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell: "text-xs font-medium text-gray-500 w-9 text-center",
            row: "grid grid-cols-7",
            cell: "h-9 w-9 text-center p-0 relative",
            day: "h-9 w-9 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500",
            day_selected: "bg-purple-600 text-white hover:bg-purple-600",
            day_today: "border border-purple-300",
            day_outside: "text-gray-300",
            day_disabled: "text-gray-300 opacity-50",
            day_hidden: "invisible",
          }}
          modifiersClassNames={{
            selected: "!bg-purple-600 !text-white",
            today: "!border !border-purple-300",
            disabled: "opacity-50 cursor-not-allowed",
          }}
        />
      </div>
    </div>
  );
}

export default Calendar;


