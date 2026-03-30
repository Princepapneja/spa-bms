"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetBookingsQuery } from "../../store/features/bookingApiSlice";
import { useGetTherapistsQuery } from "../../store/features/therapistSlice";
import BookingSheet from "./BookingSheet";
import { useLazyGetTimingsQuery } from "../../store/features/outletTimingApiSlice";

const CELL_HEIGHT = 40;
const COLUMN_WIDTH = 140;
const TIME_COL_WIDTH = 64;
const HEADER_HEIGHT = 56;

const BookingCalendar = () => {
  const user = useSelector((state) => state.auth.user);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [interval, setInterval] = useState(15);
  const [search, setSearch] = useState("");

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);

  const [getTimings, { data: timingData }] = useLazyGetTimingsQuery();

  const formatApiDate = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  // 🔥 Fetch timing
  useEffect(() => {
    if (user?.outlet_id) {
      getTimings({
        outlet: user.outlet_id,
        start_date: formatApiDate(selectedDate),
        end_date: formatApiDate(selectedDate),
      });
    }
  }, [selectedDate, user]);

  // 🔥 Timing extraction
  const outletTiming =
    timingData?.data?.data?.list?.outlet_timing || {};

  const selectedKey = formatApiDate(selectedDate);
  const dayTiming = outletTiming[selectedKey]?.[0];

  // ✅ Fallback instead of closed
  const defaultOpen = "09:00:00";
  const defaultClose = "22:00:00";

  const openRaw =
    dayTiming && dayTiming.off !== 1
      ? dayTiming.open
      : defaultOpen;

  const closeRaw =
    dayTiming && dayTiming.off !== 1
      ? dayTiming.close
      : defaultClose;

  const formatTime = (t) => t.slice(0, 5);

  const openTime = formatTime(openRaw);
  const closeTime = formatTime(closeRaw);

  const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  let openMin = toMin(openTime);
  let closeMin = toMin(closeTime);

  // 🔥 Overnight support
  if (closeMin <= openMin) closeMin += 1440;

  // 🔥 Bookings
  const { data: bookingRes } = useGetBookingsQuery({
    pagination: 0,
    daterange: `${selectedKey} / ${selectedKey}`,
    outlet: user?.outlet_id,
    panel: "outlet",
    view_type: "calendar",
  });

  const bookings =
    bookingRes?.data?.data?.list?.bookings || [];

  // 🔥 Therapists
  const { data: therapistRes } = useGetTherapistsQuery({
    outlet: user?.outlet_id,
    pagination: 0,
    panel: "outlet",
  });

  const apiTherapists =
    therapistRes?.data?.data?.list?.staffs || [];

  const { therapists, therapistMap } = useMemo(() => {
    const list = apiTherapists.map((t) => ({
      id: t.id,
      name: t.alias,
    }));

    const map = {};
    list.forEach((t, i) => (map[t.id] = i));

    return { therapists: list, therapistMap: map };
  }, [apiTherapists]);

  // 🔥 Time slots
  const timeSlots = useMemo(() => {
    const arr = [];
    for (let t = openMin; t < closeMin; t += interval) {
      const val = t % 1440;
      const h = Math.floor(val / 60);
      const m = val % 60;

      arr.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
    return arr;
  }, [openMin, closeMin, interval]);

  // 🔥 Normalize bookings (SAFE)
  const normalized = useMemo(() => {
    const res = [];

    bookings.forEach((b) => {
      if (
        search &&
        !b.customer_name?.toLowerCase().includes(search.toLowerCase()) &&
        !b.mobile_number?.includes(search)
      )
        return;

      Object.values(b.booking_item || {}).forEach((items) => {
        items.forEach((item) => {
          const col = therapistMap[item.therapist_id];
          if (col === undefined) return;

          const [h, m] = item.start_time.split(":").map(Number);
          let min = h * 60 + m;

          if (min < openMin) min += 1440;

          const row = Math.floor((min - openMin) / interval);

          if (row < 0 || row >= timeSlots.length) return;

          res.push({
            id: item.id,
            client: b.customer_name,
            col,
            row,
            duration: item.duration || 60,
          });
        });
      });
    });

    return res;
  }, [bookings, therapistMap, openMin, interval, timeSlots.length, search]);

  const getTop = (i) => i * CELL_HEIGHT;
  const getLeft = (i) => i * COLUMN_WIDTH;
  const getHeight = (d) =>
    Math.max(1, Math.round(d / interval)) * CELL_HEIGHT;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / COLUMN_WIDTH);
    const row = Math.floor(y / CELL_HEIGHT);

    if (!therapists[col]) return;
    if (row < 0 || row >= timeSlots.length) return;

    const min = openMin + row * interval;
    const adj = min % 1440;

    const h = Math.floor(adj / 60);
    const m = adj % 60;

    const time = `${String(h).padStart(2, "0")}:${String(
      m
    ).padStart(2, "0")}`;

    setSelectedSlot({
      therapist: therapists[col],
      time,
      date: selectedDate,
    });

    setSelectedBooking(null);
    setOpenSheet(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <div className="h-14 flex justify-between items-center px-4 border">
        <select
          value={interval}
          onChange={(e) => setInterval(+e.target.value)}
        >
          <option value={15}>15 Min</option>
          <option value={30}>30 Min</option>
          <option value={60}>60 Min</option>
        </select>

        <div className="flex gap-2 items-center">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}>◀</button>
          <span>{selectedDate.toDateString()}</span>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}>▶</button>
        </div>

        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 text-sm"
        />
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-auto">
        <div
          className="relative"
          style={{
            width: therapists.length * COLUMN_WIDTH + TIME_COL_WIDTH,
            height: timeSlots.length * CELL_HEIGHT + HEADER_HEIGHT,
          }}
        >
          {/* HEADER */}
          <div className="sticky top-0 flex bg-white z-10">
            <div style={{ width: TIME_COL_WIDTH }} />
            {therapists.map((t) => (
              <div
                key={t.id}
                style={{ width: COLUMN_WIDTH }}
                className="border text-center text-xs"
              >
                {t.name}
              </div>
            ))}
          </div>

          {/* TIME COLUMN */}
          <div className="absolute left-0 top-[56px]">
            {timeSlots.map((t, i) => (
              <div
                key={i}
                style={{ height: CELL_HEIGHT, width: TIME_COL_WIDTH }}
                className="border text-xs text-center"
              >
                {t}
              </div>
            ))}
          </div>

          {/* GRID BODY */}
          <div
            style={{
              position: "absolute",
              left: TIME_COL_WIDTH,
              top: HEADER_HEIGHT,
              width: therapists.length * COLUMN_WIDTH,
              height: timeSlots.length * CELL_HEIGHT,
            }}
            onClick={handleClick}
          >
            {/* ROW LINES */}
            {timeSlots.map((_, r) => (
              <div
                key={r}
                style={{
                  position: "absolute",
                  top: r * CELL_HEIGHT,
                  width: "100%",
                  borderBottom: "1px solid #eee",
                }}
              />
            ))}

            {/* COLUMN LINES */}
            {therapists.map((_, c) => (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: c * COLUMN_WIDTH,
                  height: "100%",
                  borderRight: "1px solid #eee",
                }}
              />
            ))}

            {/* BOOKINGS */}
            {normalized.map((b) => {
              const top = getTop(b.row);

              return (
                <div
                  key={b.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBooking(b);
                    setSelectedSlot(null);
                    setOpenSheet(true);
                  }}
                  style={{
                    position: "absolute",
                    top,
                    left: getLeft(b.col) + 2,
                    height: getHeight(b.duration),
                    width: COLUMN_WIDTH - 4,
                    background: "blue",
                    color: "#fff",
                    fontSize: 12,
                    padding: 2,
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {b.client}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BookingSheet
        openSheet={openSheet}
        setOpenSheet={setOpenSheet}
        selectedSlot={selectedSlot}
        selectedBooking={selectedBooking}
      />
    </div>
  );
};

export default BookingCalendar;