"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getWeekDays } from "./page";

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const DEFAULT_DURATION_OPTIONS = [
  { value: 30, label: "30 minutes", rowHeight: "h-8" },
  { value: 45, label: "45 minutes", rowHeight: "h-8" },
  { value: 60, label: "60 minutes", rowHeight: "h-10" },
  { value: 90, label: "90 minutes", rowHeight: "h-12" },
  { value: 120, label: "120 minutes", rowHeight: "h-20" }
];

export default function CalendarView({
  initialDate = new Date(),
  bookedSlots = {},
  bookingLimit = 4, // 4 staff members
  onSlotClick = () => {},
  selectedSlot = null,
  startTime = 11,
  endTime = 22,
  durationOptions = DEFAULT_DURATION_OPTIONS,
  selectedDuration = 60,
  overtimeMinutes = 30,
}) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [fetchedBookedSlots, setFetchedBookedSlots] = useState({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Fetch booked slots for the current week from backend
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      try {
        const week = getWeekDays(currentDate);
        const start = new Date(week[0]);
        start.setHours(0, 0, 0, 0);
        const end = new Date(week[6]);
        end.setHours(23, 59, 59, 999);

        const params = new URLSearchParams({
          start: start.toISOString(),
          end: end.toISOString(),
        });

        const res = await fetch(`/api/bookings/slots?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load slots');
        const data = await res.json();

        if (cancelled) return;

        if (Array.isArray(data)) {
          const normalized = data.map(b => ({ slot: b.slot, duration: b.duration }));
          setFetchedBookedSlots(normalized);
        } else if (data && typeof data === 'object') {
          setFetchedBookedSlots(data);
        } else {
          setFetchedBookedSlots({});
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching slots', err);
        setSlotsError(err.message || String(err));
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [currentDate]);

  const handlePrevWeek = () =>
    setCurrentDate(
      (prev) => new Date(new Date(prev).setDate(prev.getDate() - 7))
    );
  
  const handleNextWeek = () =>
    setCurrentDate(
      (prev) => new Date(new Date(prev).setDate(prev.getDate() + 7))
    );

  const getSlotStatus = (date) => {
    const now = new Date();
    if (Array.isArray(fetchedBookedSlots) && fetchedBookedSlots.length) {
      const slotStart = new Date(date);
      const slotEnd = new Date(slotStart.getTime() + selectedDuration * 60 * 1000);
      const isPast = slotEnd <= now;
      const closing = new Date(slotStart);
      closing.setHours(endTime, 0, 0, 0);
      const closingWithOvertime = new Date(closing.getTime() + overtimeMinutes * 60 * 1000);
      const isTooLate = slotEnd > closingWithOvertime;

      let count = 0;
      for (const b of fetchedBookedSlots) {
        if (!b || !b.slot) continue;
        const bookingStart = new Date(b.slot);
        const bookingDuration = Number(b.duration) || 0;
        const bookingEnd = new Date(bookingStart.getTime() + bookingDuration * 60 * 1000);
        if (bookingStart < slotEnd && bookingEnd > slotStart) {
          count += 1;
        }
      }
      const isFull = count >= bookingLimit;
      const isBooked = count > 0;
      return { count, isBooked, isFull, isPast, isTooLate };
    }

    const map = Object.keys(fetchedBookedSlots).length ? fetchedBookedSlots : bookedSlots;
    const count = map[date.toISOString()] || 0;
    const slotStart = new Date(date);
    const slotEnd = new Date(slotStart.getTime() + selectedDuration * 60 * 1000);
    const isPast = slotEnd <= now;
    const closing = new Date(slotStart);
    closing.setHours(endTime, 0, 0, 0);
    const closingWithOvertime = new Date(closing.getTime() + overtimeMinutes * 60 * 1000);
    const isTooLate = slotEnd > closingWithOvertime;
    const isFull = count >= bookingLimit;
    const isBooked = count > 0;
    return { count, isBooked, isFull, isPast, isTooLate };
  };

  const handleSlotClick = (day, hour, minute) => {
    const clickedDate = new Date(day);
    clickedDate.setHours(hour, minute, 0, 0);
    const status = getSlotStatus(clickedDate);
    if (status.isFull || status.isPast || status.isTooLate) return;
    onSlotClick(clickedDate);
  };

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const timeSlots = useMemo(() => {
    const slots = [];
    const startTimeInMinutes = startTime * 60;
    const endTimeInMinutes = endTime * 60;

    for (
      let minutes = startTimeInMinutes;
      minutes < endTimeInMinutes;
      minutes += selectedDuration
    ) {
      slots.push({
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      });
    }
    return slots;
  }, [selectedDuration, startTime, endTime]);

  const formatWeekHeader = (week) => {
    const firstDay = week[0];
    const lastDay = week[6];
    const monthNames = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ];
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} ${
        monthNames[firstDay.getMonth()]
      } ${firstDay.getFullYear()}`;
    }
    return `${firstDay.getDate()} ${
      monthNames[firstDay.getMonth()]
    } - ${lastDay.getDate()} ${monthNames[lastDay.getMonth()]} ${
      lastDay.getFullYear()
    }`;
  };

  const today = new Date();
  const currentDurationConfig = durationOptions.find(option => option.value === selectedDuration) || durationOptions[0];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full">
      <div className="flex flex-col items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#3C2A17] text-center ml-4">
          {formatWeekHeader(weekDays)}
        </h2>
        <div className="flex items-center justify-between w-full gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors bg-gray-200"
          >
            <ArrowLeftIcon />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors bg-gray-200"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className="overflow-auto" style={{ maxHeight: "65vh" }}>
        <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-0 w-full">
          <div className="sticky top-0 left-0 bg-white -z-10"></div>

          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === today.toDateString();
            return (
              <div
                key={index}
                className="text-center p-2 border-b-2 border-gray-200 sticky top-0 bg-white z-10"
              >
                <p
                  className={`text-sm ${
                    isToday ? "text-blue-600" : "text-[#757575]"
                  }`}
                >
                  {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][day.getDay()]}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isToday
                      ? "text-blue-600 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto"
                      : "text-[#3C2A17]"
                  }`}
                >
                  {day.getDate()}
                </p>
              </div>
            );
          })}

          {timeSlots.map(({ hour, minute }) => (
            <React.Fragment key={`${hour}-${minute}`}>
              <div className="text-right pr-2 text-xs text-[#757575] -mt-2 sticky left-0 bg-white z-10">
                {`${hour}:${String(minute).padStart(2, "0")}`}
              </div>

              {weekDays.map((day) => {
                const slotDate = new Date(day);
                slotDate.setHours(hour, minute, 0, 0);
                const status = getSlotStatus(slotDate);
                const isSelected = selectedSlot?.getTime() === slotDate.getTime();

                const slotClasses = [
                  "border-t border-r border-gray-400 flex items-center justify-center text-xs text-[#757575]",
                  currentDurationConfig.rowHeight,
                  isSelected
                    ? "bg-blue-500 !text-white ring-2 ring-blue-700 z-10"
                    : status.isFull
                    ? "bg-red-100 !text-red-700 cursor-not-allowed"
                    : status.isBooked
                    ? "bg-yellow-100 hover:bg-blue-50 cursor-pointer"
                    : status.isPast || status.isTooLate
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-50 cursor-pointer",
                ].join(" ");

                return (
                  <div
                    key={day.toISOString()}
                    className={slotClasses.trim()}
                    onClick={() => handleSlotClick(day, hour, minute)}
                  >
                    {status.isBooked && (
                      <span>
                        {status.isFull ? "Complet" : `Disponible ${status.count}/${bookingLimit}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          <React.Fragment key="end-time-row">
            <div className="text-right pr-2 text-xs text-[#757575] -mt-2 sticky left-0 bg-white z-10">
              {`${endTime}:00`}
            </div>
            {weekDays.map((day) => (
              <div
                key={`end-${day.toISOString()}`}
                className={[
                  "border-t border-r border-gray-200 flex items-center justify-center text-xs text-[#757575]",
                  currentDurationConfig.rowHeight,
                  "bg-white",
                ].join(" ")}
              >
              </div>
            ))}
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}

