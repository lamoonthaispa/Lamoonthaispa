"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

// Icons for controls (remains unchanged)
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

// --- Helper Functions ---
export const getWeekDays = (date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });
};

const DEFAULT_DURATION_OPTIONS = [
  { value: 30, label: "30 minutes", rowHeight: "h-10" },
  { value: 45, label: "45 minutes", rowHeight: "h-10" },
  { value: 60, label: "60 minutes", rowHeight: "h-10" },
  { value: 90, label: "90 minutes", rowHeight: "h-12" },
  { value: 120, label: "120 minutes", rowHeight: "h-20" },
  { value: 300, label: "5h", rowHeight: "h-14" },
  { value: 600, label: "10h", rowHeight: "h-14" }
];

const DEFAULT_MASSAGE_TYPES = [
  // Nos Massages
  { 
    value: "thai", 
    label: "Massage Thaï Traditionnel", 
    description: "Massage traditionnel thaïlandais",
    category: "massage",
    prices: { 30: 45, 60: 75, 90: 100 }
  },
  { 
    value: "oil", 
    label: "Massage aux huiles", 
    description: "Massage aux huiles essentielles",
    category: "massage",
    prices: { 30: 49, 60: 79, 90: 110 }
  },
  { 
    value: "hot-oil", 
    label: "Massage aux huiles chaudes", 
    description: "Coco, Monoï, Balinaise, Thé vert",
    category: "massage",
    prices: { 30: 55, 60: 85, 90: 120 }
  },
  { 
    value: "candle", 
    label: "Massage à la bougie", 
    description: "Massage à la bougie relaxant",
    category: "massage",
    prices: { 30: 59, 60: 95, 90: 130 }
  },
  { 
    value: "reflexology", 
    label: "Réflexologie Plantaire", 
    description: "Massage des pieds et réflexologie",
    category: "massage",
    prices: { 30: 55, 60: 85 }
  },
  { 
    value: "head-shoulder", 
    label: "Massage tête et épaules", 
    description: "Massage spécifique de la tête et des épaules",
    category: "massage",
    prices: { 30: 49 }
  },
  // Abonnements massage
  { 
    value: "abonnement-5h", 
    label: "Abonnement massage 5h", 
    description: "Forfait 5 heures de massage",
    category: "abonnement",
    prices: { 300: 350 }
  },
  { 
    value: "abonnement-10h", 
    label: "Abonnement massage 10h", 
    description: "Forfait 10 heures de massage",
    category: "abonnement",
    prices: { 600: 590 }
  },
  // Nos Gommages
  { 
    value: "gommage-simple", 
    label: "Gommages Fruits exotiques | Sel de Guérande | Sucre rose de Damas", 
    description: "Gommage exfoliant",
    category: "gommage",
    prices: { 30: 55 }
  },
  { 
    value: "gommage-massage", 
    label: "Gommages accompagné d'un massage", 
    description: "Gommage avec massage relaxant",
    category: "gommage",
    prices: { 60: 99, 90: 139 }
  },
  // Nos Soins du visage
  { 
    value: "soin-yeux", 
    label: "Soin contours des yeux", 
    description: "Hydratant et illuminateur, pour une peau douce et éclatante",
    category: "soin-visage",
    prices: { 30: 55 }
  },
  { 
    value: "soin-signature", 
    label: "Soin signature Lamoon", 
    description: "Purifiant et hydratant, pour tout types de peau",
    category: "soin-visage",
    prices: { 45: 65 }
  },
  { 
    value: "soin-rose", 
    label: "Soin douceur de rose", 
    description: "Rituel éclatant pour tout types de peau",
    category: "soin-visage",
    prices: { 60: 72 }
  },
  { 
    value: "soin-argan", 
    label: "Soin sublime argan", 
    description: "Réparation et éclat naturel, pour tout types de peau",
    category: "soin-visage",
    prices: { 60: 82 }
  },
  // Epilation cire orientale - Pour les femmes (lock à 60 minutes)
  { 
    value: "epilation-femme-jambes", 
    label: "Epilation - Jambes entière (Femme)", 
    description: "Epilation cire orientale - Jambes entière",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 29 }
  },
  { 
    value: "epilation-femme-cuisses", 
    label: "Epilation - Cuisses ou demi-jambes (Femme)", 
    description: "Epilation cire orientale - Cuisses ou demi-jambes",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 23 }
  },
  { 
    value: "epilation-femme-aisselles", 
    label: "Epilation - Aisselles (Femme)", 
    description: "Epilation cire orientale - Aisselles",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 15 }
  },
  { 
    value: "epilation-femme-maillot-simple", 
    label: "Epilation - Maillot simple (Femme)", 
    description: "Epilation cire orientale - Maillot simple",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 15 }
  },
  { 
    value: "epilation-femme-maillot-semi", 
    label: "Epilation - Maillot semi-intégral (Femme)", 
    description: "Epilation cire orientale - Maillot semi-intégral",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 27 }
  },
  { 
    value: "epilation-femme-maillot-integral", 
    label: "Epilation - Maillot intégral (Femme)", 
    description: "Epilation cire orientale - Maillot intégral",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 35 }
  },
  { 
    value: "epilation-femme-avant-bras", 
    label: "Epilation - Avant-bras (Femme)", 
    description: "Epilation cire orientale - Avant-bras",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 23 }
  },
  { 
    value: "epilation-femme-sourcils", 
    label: "Epilation - Sourcils (Femme)", 
    description: "Epilation cire orientale - Sourcils",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 12 }
  },
  { 
    value: "epilation-femme-remodeling-sourcils", 
    label: "Epilation - Remodeling sourcils (Femme)", 
    description: "Epilation cire orientale - Remodeling sourcils",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 20 }
  },
  { 
    value: "epilation-femme-menton", 
    label: "Epilation - Menton (Femme)", 
    description: "Epilation cire orientale - Menton",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 10 }
  },
  { 
    value: "epilation-femme-levres", 
    label: "Epilation - Lèvres (Femme)", 
    description: "Epilation cire orientale - Lèvres",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 10 }
  },
  { 
    value: "epilation-femme-visage", 
    label: "Epilation - Visage entier (Femme)", 
    description: "Epilation cire orientale - Visage entier",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 25 }
  },
  { 
    value: "epilation-femme-bras", 
    label: "Epilation - Bras entier (Femme)", 
    description: "Epilation cire orientale - Bras entier",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 29 }
  },
  { 
    value: "epilation-femme-fessier", 
    label: "Epilation - Fessier (Femme)", 
    description: "Epilation cire orientale - Fessier",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 19 }
  },
  { 
    value: "epilation-femme-sillon", 
    label: "Epilation - Sillon interfessier (Femme)", 
    description: "Epilation cire orientale - Sillon interfessier",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 15 }
  },
  // Epilation cire orientale - Pour les hommes (lock à 60 minutes)
  { 
    value: "epilation-homme-jambes-bras-dos", 
    label: "Epilation - Jambes/Bras/Dos (Homme)", 
    description: "Epilation cire orientale - Jambes/Bras/Dos",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 45 }
  },
  { 
    value: "epilation-homme-aisselles", 
    label: "Epilation - Aisselles (Homme)", 
    description: "Epilation cire orientale - Aisselles",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 20 }
  },
  { 
    value: "epilation-homme-sourcils-epaules", 
    label: "Epilation - Sourcils/épaules (Homme)", 
    description: "Epilation cire orientale - Sourcils/épaules",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 20 }
  },
  { 
    value: "epilation-homme-jambes-entieres", 
    label: "Epilation - Jambes entières (Homme)", 
    description: "Epilation cire orientale - Jambes entières",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 45 }
  },
  { 
    value: "epilation-homme-demi-bras", 
    label: "Epilation - Demi-bras (Homme)", 
    description: "Epilation cire orientale - Demi-bras",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 25 }
  },
  { 
    value: "epilation-homme-torse", 
    label: "Epilation - Torse (Homme)", 
    description: "Epilation cire orientale - Torse",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 40 }
  },
  { 
    value: "epilation-homme-maillot-simple", 
    label: "Epilation - Maillot simple (Homme)", 
    description: "Epilation cire orientale - Maillot simple",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 35 }
  },
  { 
    value: "epilation-homme-maillot-integral", 
    label: "Epilation - Maillot intégrale (Homme)", 
    description: "Epilation cire orientale - Maillot intégrale",
    category: "epilation",
    lockedDuration: 60,
    prices: { 60: 60 }
  },
  // Teinture
  { 
    value: "teinture-simple", 
    label: "Teinture des cils ou sourcils", 
    description: "Teinture des cils ou sourcils",
    category: "teinture",
    prices: { 30: 20 }
  },
  { 
    value: "teinture-complete", 
    label: "Teinture des cils et sourcils", 
    description: "Teinture complète des cils et sourcils",
    category: "teinture",
    prices: { 30: 37 }
  },
];

/**
 * Reusable Booking Calendar Component with Dialog
 */
const BookingCalendar = ({
  initialDate = new Date(),
  bookedSlots = {}, // Changed from array to object: { 'isoString': count }
  bookingLimit = 4, // New prop to set max bookings per slot (4 staff members)
  onSlotClick = () => {},
  selectedSlot = null,
  startTime = 11,
  endTime = 22,
  durationOptions = DEFAULT_DURATION_OPTIONS,
  massageTypes = DEFAULT_MASSAGE_TYPES,
  preSelectedService = null, // Pre-selected service type from benefit card
  triggerButton, // Optional custom trigger button
  dialogTitle = "จองนัดหมาย", // Dialog title
  onConfirmBooking, // Callback when booking is confirmed
}) => {
  // allow a small overtime window (minutes) so late slots can still be booked
  const overtimeMinutes = 30;
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [fetchedBookedSlots, setFetchedBookedSlots] = useState({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(60); // Default to 60 minutes
  const [selectedMassageType, setSelectedMassageType] = useState(preSelectedService || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const checkoutContainerRef = useRef(null);
  const checkoutUnmountRef = useRef(null);
  const [isFailDialogOpen, setIsFailDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Update selected massage type when preSelectedService changes
  useEffect(() => {
    if (preSelectedService) {
      setSelectedMassageType(preSelectedService);
    }
  }, [preSelectedService]);

  // Reset duration when service changes and has locked duration
  useEffect(() => {
    const service = massageTypes.find(type => type.value === selectedMassageType);
    if (service?.lockedDuration) {
      setSelectedDuration(service.lockedDuration);
    } else if (selectedMassageType) {
      // Set to first available duration
      const availableDurations = Object.keys(service?.prices || {}).map(Number).sort((a, b) => a - b);
      if (availableDurations.length > 0) {
        setSelectedDuration(availableDurations[0]);
      }
    }
  }, [selectedMassageType, massageTypes]);

  // Fetch booked slots for the current week from backend
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      try {
        // Calculate week range (ISO strings)
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

        // If backend returns an array of bookings (with slot & duration), keep it
        // If backend returns an object map (legacy), keep the map
        if (Array.isArray(data)) {
          // ensure each booking has slot and duration
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

  {/* Handle next week */}
  const handlePrevWeek = () =>
    setCurrentDate(
      (prev) => new Date(new Date(prev).setDate(prev.getDate() - 7))
    );
  const handleNextWeek = () =>
    setCurrentDate(
      (prev) => new Date(new Date(prev).setDate(prev.getDate() + 7))
    );

  const getSlotStatus = (date) => {
    // determine if this slot is in the past based on slot end time
    const now = new Date();
    // prefer fetchedBookedSlots (live data), fallback to prop bookedSlots
    if (Array.isArray(fetchedBookedSlots) && fetchedBookedSlots.length) {
      // candidate slot interval [date, date + selectedDuration minutes)
      const slotStart = new Date(date);
      const slotEnd = new Date(slotStart.getTime() + selectedDuration * 60 * 1000);

      // consider slot past only when its end time is <= now
      const isPast = slotEnd <= now;

      // closing time for this day, allow small overtime window
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

        // overlap if bookingStart < slotEnd && bookingEnd > slotStart
        if (bookingStart < slotEnd && bookingEnd > slotStart) {
          count += 1;
        }
      }
      const isFull = count >= bookingLimit;
      const isBooked = count > 0;
      return { count, isBooked, isFull, isPast, isTooLate };
    }

    // fallback to legacy map
    const map = Object.keys(fetchedBookedSlots).length ? fetchedBookedSlots : bookedSlots;
    const count = map[date.toISOString()] || 0;
    const slotStart = new Date(date);
    const slotEnd = new Date(slotStart.getTime() + selectedDuration * 60 * 1000);
    // consider slot past only when its end time is <= now
    const isPast = slotEnd <= now;
    const closing = new Date(slotStart);
    closing.setHours(endTime, 0, 0, 0);
    const closingWithOvertime = new Date(closing.getTime() + overtimeMinutes * 60 * 1000);
    const isTooLate = slotEnd > closingWithOvertime;

    const isFull = count >= bookingLimit;
    const isBooked = count > 0;
    return { count, isBooked, isFull, isPast, isTooLate };
  };

  const internalSlotClickHandler = (day, hour, minute) => {
    const clickedDate = new Date(day);
    clickedDate.setHours(hour, minute, 0, 0);

    if (getSlotStatus(clickedDate).isFull) return;

    onSlotClick(clickedDate);
    setIsConfirmDialogOpen(true);
  };

  const handleServiceSelection = () => {
    if (!selectedMassageType) {
      alert("Veuillez sélectionner un type de service");
      return;
    }
    setIsServiceSelectionOpen(false);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const payload = {
      slot: selectedSlot.toISOString(),
      duration: selectedDuration,
      massageType: selectedMassageType,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
    };

    try {
      setIsSubmitting(true);
      // Create Stripe Checkout Embedded session
      const res = await fetch('/api_stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { fullname: customerName, address: '-' },
          product: { name: `Réservation ${selectedMassageType} ${selectedDuration} minutes`, price: getCurrentPrice(), quantity: 1 },
          booking: payload,
          returnUrl: `${window.location.origin}${window.location.pathname}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'ไม่สามารถสร้างการชำระเงินได้');
      }
      const data = await res.json();
      if (!data?.url) {
        throw new Error('ไม่พบ Checkout URL จากเซสชัน');
      }
      setCheckoutClientSecret(data.client_secret || "");
      setCheckoutUrl(data.url || "");
      setOrderId(data.order_id || "");
      setIsConfirmDialogOpen(false);
      setIsDialogOpen(false);
      // Redirect to Stripe Checkout at top-level
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (e) {
      setCheckoutError(e.message || 'เกิดข้อผิดพลาดขณะเตรียมการชำระเงิน');
      alert(e.message || 'เกิดข้อผิดพลาดขณะบันทึกการจอง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Detect return from Stripe Checkout on this page and show result modal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const result = params.get('checkout_result') || params.get('result');
    if (!result) return;
    if (result === 'success') {
      setIsSuccessDialogOpen(true);
    } else {
      setIsFailDialogOpen(true);
    }
    // Clean URL
    const newUrl = `${window.location.origin}${window.location.pathname}${window.location.hash || ''}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  // Poll order status after opening checkout to detect payment completion via webhook
  useEffect(() => {
    if (!isCheckoutOpen || !orderId) return;
    let timer;
    const poll = async () => {
      try {
        const res = await fetch(`/api_stripe/get_order/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        const status = data?.order?.status;
        if (status === 'paid') {
          setIsCheckoutOpen(false);
          setIsSuccessDialogOpen(true);
          setCustomerName("");
          setCustomerEmail("");
          setCustomerPhone("");
          onSlotClick(null);
          return; // stop polling
        }
        if (status === 'expired' || status === 'canceled') {
          setIsCheckoutOpen(false);
          alert('การชำระเงินไม่สำเร็จ');
          return;
        }
      } catch {}
      timer = setTimeout(poll, 2000);
    };
    poll();
    return () => { if (timer) clearTimeout(timer); };
  }, [isCheckoutOpen, orderId]);

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
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} ${
        monthNames[firstDay.getMonth()]
      } ${firstDay.getFullYear() + 543}`;
    }
    return `${firstDay.getDate()} ${
      monthNames[firstDay.getMonth()]
    } - ${lastDay.getDate()} ${monthNames[lastDay.getMonth()]} ${
      lastDay.getFullYear() + 543
    }`;
  };

  const today = new Date();
  const currentDurationConfig = durationOptions.find(option => option.value === selectedDuration) || durationOptions[0];
  
  const getCurrentPrice = () => {
    const selectedType = massageTypes.find(type => type.value === selectedMassageType);
    if (!selectedType || !selectedType.prices) return 0;
    return selectedType.prices[selectedDuration] || 0;
  };

  const CalendarContent = () => (
    <div className="bg-white p-4 sm:p-6 rounded-2xl w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
         <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center ml-4">
            {formatWeekHeader(weekDays)}
          </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="massage-type-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Type de service :
            </label>
            <select
              id="massage-type-select"
              value={selectedMassageType}
              onChange={(e) => setSelectedMassageType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[150px]"
            >
              {massageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="duration-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Durée :
            </label>
            <select
              id="duration-select"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
              disabled={massageTypes.find(type => type.value === selectedMassageType)?.lockedDuration !== undefined}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[120px] disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {(() => {
                const selectedService = massageTypes.find(type => type.value === selectedMassageType);
                const lockedDuration = selectedService?.lockedDuration;
                
                // If service has locked duration, show only that
                if (lockedDuration) {
                  return [{ value: lockedDuration, label: `${lockedDuration} minutes` }].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ));
                }
                
                // Otherwise, filter durations based on available prices
                const availableDurations = durationOptions.filter(d => {
                  if (!selectedService || !selectedService.prices) return true;
                  return selectedService.prices[d.value] !== undefined;
                });
                
                return availableDurations.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ));
              })()}
            </select>
          </div>

          {selectedMassageType && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Prix :</span>
              <span className="text-lg font-bold text-green-800">
                {getCurrentPrice()} THB
              </span>
            </div>
          )}
        </div>
      </div>
       <div className="flex items-center gap-2 w-full justify-between">
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
                    isToday ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"][day.getDay()]}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isToday
                      ? "text-blue-600 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto"
                      : "text-gray-800"
                  }`}
                >
                  {day.getDate()}
                </p>
              </div>
            );
          })}

          {timeSlots.map(({ hour, minute }) => (
            <React.Fragment key={`${hour}-${minute}`}>
              <div className="text-right pr-2 text-xs text-gray-500 -mt-2 sticky left-0 bg-white z-10">
                {`${hour}:${String(minute).padStart(2, "0")}`}
              </div>

              {weekDays.map((day) => {
                const slotDate = new Date(day);
                slotDate.setHours(hour, minute, 0, 0);
                const status = getSlotStatus(slotDate);
                const isSelected =
                  selectedSlot?.getTime() === slotDate.getTime();

                const slotClasses = [
                  "border-t border-r border-gray-200 flex items-center justify-center text-xs text-gray-600",
                  currentDurationConfig.rowHeight,
                  isSelected
                    ? "bg-blue-500 !text-white ring-2 ring-blue-700 z-10"
                    : status.isFull
                    ? "bg-red-100 !text-red-700 cursor-not-allowed"
                    : status.isBooked
                    ? "bg-yellow-100 hover:bg-blue-50 cursor-pointer"
                    : status.isPast || status.isTooLate
                    ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-50 cursor-pointer",
                ].join(" ");

                return (
                  <div
                    key={day.toISOString()}
                    className={slotClasses.trim()}
                    onClick={() => {
                      if (status.isFull || status.isPast || status.isTooLate) return;
                      internalSlotClickHandler(day, hour, minute);
                    }}
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

          {/* End time row (show closing time like 22:00) */}
          <React.Fragment key="end-time-row">
            <div className="text-right pr-2 text-xs text-gray-500 -mt-2 sticky left-0 bg-white z-10">
              {`${endTime}:00`}
            </div>
            {weekDays.map((day) => (
              <div
                key={`end-${day.toISOString()}`}
                className={[
                  "border-t border-r border-gray-200 flex items-center justify-center text-xs text-gray-600",
                  currentDurationConfig.rowHeight,
                  "bg-white",
                ].join(" ")}
              >
                {/* closing time label row - intentionally empty */}
              </div>
            ))}
          </React.Fragment>
        </div>
      </div>

    </div>
  );

  return (
    <>
      <Dialog.Root open={isServiceSelectionOpen} onOpenChange={setIsServiceSelectionOpen} >
        <Dialog.Trigger asChild>
          {triggerButton || (
            <button className="px-6 py-3 bg-[#9f0600] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 font-semibold">
              จองคิวเลย
            </button>
          )}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-[90vw] max-w-md sm:max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                เลือกบริการ
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* Massage Type Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Type de service</h3>
                  <div className="grid items-center justify-center grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {massageTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedMassageType(type.value)}
                        className={`p-2 sm:p-4 text-center border-2 rounded-lg transition-all flex items-center justify-center ${
                          selectedMassageType === type.value
                            ? "border-[#9f0600] bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <div className="font-semibold text-gray-800 flex text-sm sm:text-base">{type.label}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Durée</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(() => {
                      const selectedType = massageTypes.find(type => type.value === selectedMassageType);
                      const lockedDuration = selectedType?.lockedDuration;
                      
                      // If service has locked duration, show only that
                      if (lockedDuration) {
                        const lockedOption = durationOptions.find(d => d.value === lockedDuration);
                        if (!lockedOption) return null;
                        return (
                          <button
                            key={lockedOption.value}
                            disabled
                            className="p-3 text-center border-2 rounded-lg transition-all border-[#9f0600] bg-red-50 text-[#9f0600] cursor-not-allowed"
                          >
                            <div className="font-semibold">{lockedOption.label}</div>
                          </button>
                        );
                      }
                      
                      // Otherwise, filter and show available durations
                      const availableDurations = durationOptions.filter(d => {
                        if (!selectedType || !selectedType.prices) return true;
                        return selectedType.prices[d.value] !== undefined;
                      });
                      
                      return availableDurations.map((option) => {
                        const price = selectedType?.prices?.[option.value] || 0;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setSelectedDuration(option.value)}
                            className={`p-3 text-center border-2 rounded-lg transition-all ${
                              selectedDuration === option.value
                                ? "border-[#9f0600] bg-red-50 text-[#9f0600]"
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            <div className="font-semibold">{option.label}</div>
                            {selectedMassageType && price > 0 && (
                              <div className="text-xs mt-1 font-semibold text-[#9f0600]">
                                {price} €
                              </div>
                            )}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Price Summary */}
                {selectedMassageType && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Prix total</div>
                      <div className="text-2xl font-bold text-green-800">
                        {getCurrentPrice()} €
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-4">
                  <button
                    onClick={handleServiceSelection}
                    disabled={!selectedMassageType}
                    className="w-full px-6 py-3 bg-[#9f0600] text-white rounded-lg hover:bg-[#8a0500] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Choisir un créneau horaire
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Calendar Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-[90vw] max-w-5xl sm:max-w-7xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                {dialogTitle}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            <div className="p-4 sm:p-6 overflow-auto max-h-[calc(90vh-100px)]">
              <CalendarContent />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Confirmation Dialog with Form */}
      <Dialog.Root open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[70] w-[95vw] sm:w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <Dialog.Title className="text-xl font-bold text-gray-800">
                ยืนยันการจอง
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                  onClick={() => {
                    setIsConfirmDialogOpen(false);
                    setCustomerName("");
                    setCustomerPhone("");
                  }}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            <div className="p-4 sm:p-6">
              {selectedSlot && (
                <div className="mb-6 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Heure sélectionnée :</p>
                    <p className="text-lg font-semibold text-blue-800">
                      {selectedSlot.toLocaleString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Service sélectionné :</p>
                    <p className="text-lg font-semibold text-green-800">
                      {massageTypes.find(type => type.value === selectedMassageType)?.label || selectedMassageType}
                    </p>
                    <p className="text-sm text-green-700">
                      Durée : {durationOptions.find(opt => opt.value === selectedDuration)?.label || selectedDuration + " minutes"}
                    </p>
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-sm text-gray-600">Prix total :</p>
                      <p className="text-xl font-bold text-green-800">
                        {getCurrentPrice()} THB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom et prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Entrez votre nom complet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Entrez votre adresse e-mail"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Entrez votre numéro de téléphone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setIsConfirmDialogOpen(false);
                    setCustomerName("");
                    setCustomerPhone("");
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 rounded-lg transition-colors font-semibold ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-[#9f0600] text-white hover:bg-[#8a0500]'
                  }`}
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการจอง'}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Success Dialog */}
      <Dialog.Root open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[80] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[90] w-[95vw] sm:w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              {/* Success Message */}
              <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                จองสำเร็จ!
              </Dialog.Title>
              <p className="text-gray-600 mb-6">
                การจองของคุณได้รับการบันทึกเรียบร้อยแล้ว
              </p>
              
              {/* Booking Details */}
              {selectedSlot && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Détails de la réservation</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Service :</span> {massageTypes.find(type => type.value === selectedMassageType)?.label || selectedMassageType}</p>
                    <p><span className="font-medium">Durée :</span> {durationOptions.find(opt => opt.value === selectedDuration)?.label || selectedDuration + " minutes"}</p>
                    <p><span className="font-medium">Date :</span> {selectedSlot.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                    <p><span className="font-medium">Heure :</span> {selectedSlot.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                    <p><span className="font-medium">Prix :</span> <span className="font-bold text-green-600">{getCurrentPrice()} €</span></p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsSuccessDialogOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#9f0600] text-white rounded-lg hover:bg-[#8a0500] transition-colors font-semibold"
                >
                  ตกลง
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Fail Dialog */}
      <Dialog.Root open={isFailDialogOpen} onOpenChange={setIsFailDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[80] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[90] w-[95vw] sm:w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">การชำระเงินไม่สำเร็จ</Dialog.Title>
              <p className="text-gray-600 mb-6">โปรดลองอีกครั้งหรือติดต่อเราเพื่อขอความช่วยเหลือ</p>
              <div className="flex gap-3">
                <button onClick={() => setIsFailDialogOpen(false)} className="flex-1 px-6 py-3 bg-[#9f0600] text-white rounded-lg hover:bg-[#8a0500] transition-colors font-semibold">ตกลง</button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
export default BookingCalendar;
