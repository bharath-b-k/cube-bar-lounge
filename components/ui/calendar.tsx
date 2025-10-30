"use client";

import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        <DatePicker
          selected={selected ?? null}
          onChange={onChange}
          inline
          minDate={minDate}
          maxDate={maxDate}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          calendarClassName="cbl-datepicker"
          dayClassName={() => "cbl-datepicker-day"}
          todayButton="Today"
        />
      </div>
    </div>
  );
}

export default Calendar;


