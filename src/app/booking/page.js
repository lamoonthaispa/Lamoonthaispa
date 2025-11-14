"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import CalendarView from "@/components/BookingCalendar/CalendarView";



const DEFAULT_MASSAGE_TYPES = [
  // Nos Massages
  { 
    value: "Massage Thaï Traditionnel", 
    label: "Massage Thaï Traditionnel", 
    description: "Massage traditionnel thaïlandais",
    category: "massage",
    prices: { 30: 45, 60: 75, 90: 100 },
    image: "/massage.jpg"
  },
  { 
    value: "Massage aux huiles", 
    label: "Massage aux huiles", 
    description: "Massage aux huiles essentielles",
    category: "massage",
    prices: { 30: 49, 60: 79, 90: 110 },
    image: "/massage.jpg"
  },
  { 
    value: "Massage aux huiles chaudes", 
    label: "Massage aux huiles chaudes", 
    description: "Coco, Monoï, Balinaise, Thé vert",
    category: "massage",
    prices: { 30: 55, 60: 85, 90: 120 },
    image: "/massage.jpg"
  },
  { 
    value: "Massage à la bougie", 
    label: "Massage à la bougie", 
    description: "Massage à la bougie relaxant",
    category: "massage",
    prices: { 30: 59, 60: 95, 90: 130 },
    image: "/massage.jpg"
  },
  { 
    value: "Réflexologie Plantaire", 
    label: "Réflexologie Plantaire", 
    description: "Massage des pieds et réflexologie",
    category: "massage",
    prices: { 30: 55, 60: 85 },
    image: "/massage.jpg"
  },
  { 
    value: "Massage tête et épaules", 
    label: "Massage tête et épaules", 
    description: "Massage spécifique de la tête et des épaules",
    category: "massage",
    prices: { 30: 49 },
    image: "/massage.jpg"
  },
  // Abonnements massage
  { 
    value: "Abonnement massage 5h", 
    label: "Abonnement massage 5h", 
    description: "Forfait 5 heures de massage",
    category: "abonnement",
    prices: { 300: 350 },
    image: "/massage.jpg"
  },
  { 
    value: "Abonnement massage 10h", 
    label: "Abonnement massage 10h", 
    description: "Forfait 10 heures de massage",
    category: "abonnement",
    prices: { 600: 590 },
    image: "/massage.jpg"
  },
  // Nos Gommages
  { 
    value: "Gommages Fruits exotiques | Sel de Guérande | Sucre rose de Damas", 
    label: "Gommages Fruits exotiques | Sel de Guérande | Sucre rose de Damas", 
    description: "Gommage exfoliant",
    category: "gommage",
    prices: { 30: 55 },
    image: "/gommage.jpg"
  },
  { 
    value: "Gommages accompagné d'un massage", 
    label: "Gommages accompagné d'un massage", 
    description: "Gommage avec massage relaxant",
    category: "gommage",
    prices: { 60: 99, 90: 139 },
    image: "/gommage.jpg"
  },
  // Nos Soins du visage
  { 
    value: "Soin contours des yeux", 
    label: "Soin contours des yeux", 
    description: "Hydratant et illuminateur, pour une peau douce et éclatante",
    category: "soin-visage",
    prices: { 30: 55 },
    image: "/soin-du-visage.jpg"
  },
  { 
    value: "Soin signature Lamoon", 
    label: "Soin signature Lamoon", 
    description: "Purifiant et hydratant, pour tout types de peau",
    category: "soin-visage",
    prices: { 45: 65 },
    image: "/soin-du-visage.jpg"
  },
  { 
    value: "Soin douceur de rose", 
    label: "Soin douceur de rose", 
    description: "Rituel éclatant pour tout types de peau",
    category: "soin-visage",
    prices: { 60: 72 },
    image: "/soin-du-visage.jpg"
  },
  { 
    value: "Soin sublime argan", 
    label: "Soin sublime argan", 
    description: "Réparation et éclat naturel, pour tout types de peau",
    category: "soin-visage",
    prices: { 60: 82 },
    image: "/soin-du-visage.jpg"
  },
  // Épilation Femme
  { value: "Epilation - Jambes entière (Femme)", label: "Epilation - Jambes entière (Femme)", description: "Epilation cire orientale - Jambes entière", category: "epilation", lockedDuration: 60, prices: { 60: 29 }, image: "/cire-orientale.png" },
  { value: "Epilation - Cuisses ou demi-jambes (Femme)", label: "Epilation - Cuisses ou demi-jambes (Femme)", description: "Epilation cire orientale - Cuisses ou demi-jambes", category: "epilation", lockedDuration: 60, prices: { 60: 23 }, image: "/cire-orientale.png" },
  { value: "Epilation - Aisselles (Femme)", label: "Epilation - Aisselles (Femme)", description: "Epilation cire orientale - Aisselles", category: "epilation", lockedDuration: 60, prices: { 60: 15 }, image: "/cire-orientale.png" },
  { value: "Epilation - Maillot simple (Femme)", label: "Epilation - Maillot simple (Femme)", description: "Epilation cire orientale - Maillot simple", category: "epilation", lockedDuration: 60, prices: { 60: 15 }, image: "/cire-orientale.png" },
  { value: "Epilation - Maillot semi-intégral (Femme)", label: "Epilation - Maillot semi-intégral (Femme)", description: "Epilation cire orientale - Maillot semi-intégral", category: "epilation", lockedDuration: 60, prices: { 60: 27 }, image: "/cire-orientale.png" },
  { value: "Epilation - Maillot intégral (Femme)", label: "Epilation - Maillot intégral (Femme)", description: "Epilation cire orientale - Maillot intégral", category: "epilation", lockedDuration: 60, prices: { 60: 35 }, image: "/cire-orientale.png" },
  { value: "Epilation - Avant-bras (Femme)", label: "Epilation - Avant-bras (Femme)", description: "Epilation cire orientale - Avant-bras", category: "epilation", lockedDuration: 60, prices: { 60: 23 }, image: "/cire-orientale.png" },
  { value: "Epilation - Sourcils (Femme)", label: "Epilation - Sourcils (Femme)", description: "Epilation cire orientale - Sourcils", category: "epilation", lockedDuration: 60, prices: { 60: 12 }, image: "/cire-orientale.png" },
  { value: "Epilation - Remodeling sourcils (Femme)", label: "Epilation - Remodeling sourcils (Femme)", description: "Epilation cire orientale - Remodeling sourcils", category: "epilation", lockedDuration: 60, prices: { 60: 20 }, image: "/cire-orientale.png" },
  { value: "Epilation - Menton (Femme)", label: "Epilation - Menton (Femme)", description: "Epilation cire orientale - Menton", category: "epilation", lockedDuration: 60, prices: { 60: 10 }, image: "/cire-orientale.png" },
  { value: "Epilation - Lèvres (Femme)", label: "Epilation - Lèvres (Femme)", description: "Epilation cire orientale - Lèvres", category: "epilation", lockedDuration: 60, prices: { 60: 10 }, image: "/cire-orientale.png" },
  { value: "Epilation - Visage entier (Femme)", label: "Epilation - Visage entier (Femme)", description: "Epilation cire orientale - Visage entier", category: "epilation", lockedDuration: 60, prices: { 60: 25 }, image: "/cire-orientale.png" },
  { value: "Epilation - Bras entier (Femme)", label: "Epilation - Bras entier (Femme)", description: "Epilation cire orientale - Bras entier", category: "epilation", lockedDuration: 60, prices: { 60: 29 }, image: "/cire-orientale.png" },
  { value: "Epilation - Fessier (Femme)", label: "Epilation - Fessier (Femme)", description: "Epilation cire orientale - Fessier", category: "epilation", lockedDuration: 60, prices: { 60: 19 }, image: "/cire-orientale.png" },
  { value: "Epilation - Sillon interfessier (Femme)", label: "Epilation - Sillon interfessier (Femme)", description: "Epilation cire orientale - Sillon interfessier", category: "epilation", lockedDuration: 60, prices: { 60: 15 }, image: "/cire-orientale.png" },

  // Épilation Homme
  { value: "Epilation - Jambes/Bras/Dos (Homme)", label: "Epilation - Jambes/Bras/Dos (Homme)", description: "Epilation cire orientale - Jambes/Bras/Dos", category: "epilation", lockedDuration: 60, prices: { 60: 45 }, image: "/cire-orientale.png" },
  { value: "Epilation - Aisselles (Homme)", label: "Epilation - Aisselles (Homme)", description: "Epilation cire orientale - Aisselles", category: "epilation", lockedDuration: 60, prices: { 60: 20 }, image: "/cire-orientale.png" },
  { value: "Epilation - Sourcils/épaules (Homme)", label: "Epilation - Sourcils/épaules (Homme)", description: "Epilation cire orientale - Sourcils/épaules", category: "epilation", lockedDuration: 60, prices: { 60: 20 }, image: "/cire-orientale.png" },
  { value: "Epilation - Jambes entières (Homme)", label: "Epilation - Jambes entières (Homme)", description: "Epilation cire orientale - Jambes entières", category: "epilation", lockedDuration: 60, prices: { 60: 45 }, image: "/cire-orientale.png" },
  { value: "Epilation - Demi-bras (Homme)", label: "Epilation - Demi-bras (Homme)", description: "Epilation cire orientale - Demi-bras", category: "epilation", lockedDuration: 60, prices: { 60: 25 }, image: "/cire-orientale.png" },
  { value: "Epilation - Torse (Homme)", label: "Epilation - Torse (Homme)", description: "Epilation cire orientale - Torse", category: "epilation", lockedDuration: 60, prices: { 60: 40 }, image: "/cire-orientale.png" },
  { value: "Epilation - Maillot simple (Homme)", label: "Epilation - Maillot simple (Homme)", description: "Epilation cire orientale - Maillot simple", category: "epilation", lockedDuration: 60, prices: { 60: 35 }, image: "/cire-orientale.png" },
  { value: "Epilation - Maillot intégrale (Homme)", label: "Epilation - Maillot intégrale (Homme)", description: "Epilation cire orientale - Maillot intégrale", category: "epilation", lockedDuration: 60, prices: { 60: 60 }, image: "/cire-orientale.png" },

  // Teinture
  { value: "Teinture des cils ou sourcils", label: "Teinture des cils ou sourcils", description: "Teinture des cils ou sourcils", category: "teinture", prices: { 30: 20 }, image: "/teinture.jpg" },
  { value: "Teinture des cils et sourcils", label: "Teinture des cils et sourcils", description: "Teinture complète des cils et sourcils", category: "teinture", prices: { 30: 37 }, image: "/teinture.jpg" },
];


const serviceTypeMapping = {
  // Massages
  "thai": "Massage Thaï Traditionnel",
  "oil": "Massage aux huiles",
  "hot-oil": "Massage aux huiles chaudes",
  "candle": "Massage à la bougie",
  "reflexology": "Réflexologie Plantaire",
  "head-shoulder": "Massage tête et épaules",

  // Abonnements
  "abonnement-5h": "Abonnement massage 5h",
  "abonnement-10h": "Abonnement massage 10h",

  // Gommages
  "gommage-simple": "Gommages Fruits exotiques | Sel de Guérande | Sucre rose de Damas",
  "gommage-massage": "Gommages accompagné d'un massage",

  // Soins du visage
  "soin-yeux": "Soin contours des yeux",
  "soin-signature": "Soin signature Lamoon",
  "soin-rose": "Soin douceur de rose",
  "soin-argan": "Soin sublime argan",

  // Épilation Femme
  "epilation-femme-jambes": "Epilation - Jambes entière (Femme)",
  "epilation-femme-cuisses": "Epilation - Cuisses ou demi-jambes (Femme)",
  "epilation-femme-aisselles": "Epilation - Aisselles (Femme)",
  "epilation-femme-maillot-simple": "Epilation - Maillot simple (Femme)",
  "epilation-femme-maillot-semi": "Epilation - Maillot semi-intégral (Femme)",
  "epilation-femme-maillot-integral": "Epilation - Maillot intégral (Femme)",
  "epilation-femme-avant-bras": "Epilation - Avant-bras (Femme)",
  "epilation-femme-sourcils": "Epilation - Sourcils (Femme)",
  "epilation-femme-remodeling-sourcils": "Epilation - Remodeling sourcils (Femme)",
  "epilation-femme-menton": "Epilation - Menton (Femme)",
  "epilation-femme-levres": "Epilation - Lèvres (Femme)",
  "epilation-femme-visage": "Epilation - Visage entier (Femme)",
  "epilation-femme-bras": "Epilation - Bras entier (Femme)",
  "epilation-femme-fessier": "Epilation - Fessier (Femme)",
  "epilation-femme-sillon": "Epilation - Sillon interfessier (Femme)",

  // Épilation Homme
  "epilation-homme-jambes-bras-dos": "Epilation - Jambes/Bras/Dos (Homme)",
  "epilation-homme-aisselles": "Epilation - Aisselles (Homme)",
  "epilation-homme-sourcils-epaules": "Epilation - Sourcils/épaules (Homme)",
  "epilation-homme-jambes-entieres": "Epilation - Jambes entières (Homme)",
  "epilation-homme-demi-bras": "Epilation - Demi-bras (Homme)",
  "epilation-homme-torse": "Epilation - Torse (Homme)",
  "epilation-homme-maillot-simple": "Epilation - Maillot simple (Homme)",
  "epilation-homme-maillot-integral": "Epilation - Maillot intégrale (Homme)",

  // Teinture
  "teinture-simple": "Teinture des cils ou sourcils",
  "teinture-complete": "Teinture des cils et sourcils",
};


export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const serviceImage = searchParams.get('image');
  
  const [selectedMassageType, setSelectedMassageType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(60);
  
  // Reset duration when service changes and has locked duration
  useEffect(() => {
    const service = DEFAULT_MASSAGE_TYPES.find(type => type.value === selectedMassageType);
    if (service?.lockedDuration) {
      setSelectedDuration(service.lockedDuration);
    } else if (selectedMassageType) {
      // Set to first available duration
      const availableDurations = Object.keys(service?.prices || {}).map(Number).sort((a, b) => a - b);
      if (availableDurations.length > 0) {
        setSelectedDuration(availableDurations[0]);
      }
    }
  }, [selectedMassageType]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    if (serviceId) {
      const mappedType = serviceTypeMapping[serviceId];
      if (mappedType) {
        setSelectedMassageType(mappedType);
      }
    }
  }, [serviceId]);

  const selectedService = useMemo(() => {
    return DEFAULT_MASSAGE_TYPES.find(type => type.value === selectedMassageType);
  }, [selectedMassageType]);

  const getCurrentPrice = () => {
    if (!selectedService || !selectedService.prices) return 0;
    return selectedService.prices[selectedDuration] || 0;
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !selectedMassageType) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        slot: selectedSlot.toISOString(),
        duration: selectedDuration,
        massageType: selectedMassageType,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      };

      const res = await fetch('/api_stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { fullname: customerName, address: '-' },
          product: { 
            name: `Réservation ${selectedService?.label || selectedMassageType} ${selectedDuration} minutes`, 
            price: getCurrentPrice(), 
            quantity: 1 
          },
          booking: payload,
          returnUrl: `${window.location.origin}/booking/result`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Impossible de créer le paiement');
      }

      const data = await res.json();
      if (!data?.url) {
        throw new Error('URL de paiement non trouvée');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (e) {
      alert(e.message || 'Erreur lors de la réservation');
      setIsSubmitting(false);
    }
  };

  const durationOptions = useMemo(() => {
    const selectedService = DEFAULT_MASSAGE_TYPES.find(type => type.value === selectedMassageType);
    const lockedDuration = selectedService?.lockedDuration;
    
    // Si service lock duration, return only that duration
    if (lockedDuration) {
      return [{ value: lockedDuration, label: `${lockedDuration} minutes`, rowHeight: "h-10" }];
    }
    
    // Sinon, return all available durations based on service
    const allDurations = [
      { value: 30, label: "30 minutes", rowHeight: "h-10" },
      { value: 45, label: "45 minutes", rowHeight: "h-10" },
      { value: 60, label: "1 heure", rowHeight: "h-10" },
      { value: 90, label: "1 heure 30 minutes", rowHeight: "h-12" },
      { value: 120, label: "2 heures", rowHeight: "h-14" },
      { value: 300, label: "5h", rowHeight: "h-14" },
      { value: 600, label: "10h", rowHeight: "h-14" },
    ];
    
    // Filter durations based on available prices for selected service
    if (selectedService && selectedService.prices) {
      return allDurations.filter(d => selectedService.prices[d.value] !== undefined);
    }
    
    return allDurations;
  }, [selectedMassageType]);

  return (
    <div className="min-h-screen bg-[#F6F1EA] px-4 sm:px-8 lg:px-[110px] pt-[40px] sm:pt-[60px] flex flex-col gap-6 sm:gap-10">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex text-black items-center gap-2 hover:text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="underline text-sm sm:text-base">Annuler la réservation</span>
        </button>
      </div>
  
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2 text-center lg:text-left">
          Réservez votre rendez-vous
        </h1>
        <p className="text-sm sm:text-base text-[#7A6A55] text-center lg:text-left">
          Prenez soin de vous dès aujourd'hui. Offrez-vous un moment de détente.
        </p>
      </div>
  
      {/* Service Card */}
      <div className="flex flex-col sm:flex-row bg-[#F7F6FA] p-3 sm:p-4 rounded-[12px] gap-4 sm:gap-6">
        {selectedService && (
          <>
            <div className="w-full sm:w-1/2 relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={selectedService?.image || serviceImage || "/thaimassage.webp"}
                alt={selectedService.label}
                fill
                className="object-cover"
              />
            </div>
  
            <div className="flex flex-col justify-center sm:w-1/2">
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-1">
                {selectedService.label}
              </h2>
              <p className="text-sm text-[#757575] mb-3">
                {Object.keys(selectedService.prices).map((dur, i, arr) => {
                  const durNum = parseInt(dur);
                  const label =
                    durNum === 60
                      ? "1h"
                      : durNum === 90
                      ? "1h30"
                      : durNum === 120
                      ? "2h"
                      : durNum + "min";
                  return label + (i < arr.length - 1 ? " / " : "");
                })}
              </p>
              <div className="flex items-center gap-2 text-sm text-[#757575]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Lamoon Thaï Spa 25 rue de turin, Paris 75008</span>
              </div>
            </div>
          </>
        )}
      </div>
  
      {/* Booking Form */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Massage Type */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Type de massage
            </label>
            <select
              value={selectedMassageType}
              onChange={(e) => setSelectedMassageType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-[#3C2A17] focus:ring-2 focus:ring-[#4F3921] focus:border-transparent"
            >
              <option value="">Choisir un type de massage</option>
              {DEFAULT_MASSAGE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
  
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Durée du service
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {durationOptions.map((option) => {
                const price = selectedService?.prices?.[option.value] || 0;
                return (
                  <label
                    key={option.value}
                    className={`flex flex-col gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDuration === option.value
                        ? "border-[#4F3921] bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="duration"
                        value={option.value}
                        checked={selectedDuration === option.value}
                        onChange={(e) =>
                          setSelectedDuration(parseInt(e.target.value))
                        }
                        className="w-4 h-4 text-[#4F3921] focus:ring-[#4F3921]"
                      />
                      <span className="text-[#3C2A17] font-medium">
                        {option.label}
                      </span>
                    </div>
                    {price > 0 && (
                      <span className="text-xs font-semibold text-[#4F3921] ml-7">
                        {price} €
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
  
          {/* Calendar */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Choisissez le créneau horaire souhaité
            </label>
            <CalendarView
              selectedSlot={selectedSlot}
              onSlotClick={setSelectedSlot}
              selectedDuration={selectedDuration}
              durationOptions={durationOptions}
              bookingLimit={4}
            />
          </div>
        </div>
  
        {/* Right */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Nom et prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Veuillez indiquer votre nom complet."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-[#3C2A17] focus:ring-2 focus:ring-[#4F3921]"
            />
          </div>
  
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Adresse e-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Utilisée pour confirmer votre réservation."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-[#3C2A17] focus:ring-2 focus:ring-[#4F3921]"
            />
          </div>
  
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-[#3C2A17] focus:ring-2 focus:ring-[#4F3921]"
            />
          </div>
  
          {/* Preferences */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Préférences particulières (facultatif)
            </label>
            <textarea
              placeholder="Mentionnez toute demande spécifique (ex: masseur homme/femme)."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-[#3C2A17] focus:ring-2 focus:ring-[#4F3921]"
            />
          </div>
  
          {/* Payment */}
          <div>
            <label className="block text-sm font-medium text-[#3C2A17] mb-2">
              Méthode de paiement
            </label>
            <label className="flex items-center gap-3 p-3 border-2 border-[#4F3921] bg-red-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                defaultChecked
                className="w-4 h-4 text-[#4F3921] focus:ring-[#4F3921]"
              />
              <span className="text-[#3C2A17] font-medium">Credit / Debit Card</span>
              <span className="ml-auto text-xs text-[#757575]">VISA</span>
            </label>
          </div>
        </div>
      </div>
  
      {/* Summary */}
      <div className="mt-4 sm:mt-6">
        <div className="space-y-2 text-[#757575] text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Service principal</span>
            <span>{getCurrentPrice()} €</span>
          </div>
          <div className="flex justify-between">
            <span>Frais de réservation</span>
            <span>00,00 €</span>
          </div>
          <div className="flex justify-between">
            <span>Remise</span>
            <span>-00,00 €</span>
          </div>
        </div>
  
        <div className="border-t border-[#7A6A55] pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg sm:text-xl font-semibold text-[#3C2A17]">
              Total à payer
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#3C2A17]">
              {getCurrentPrice()} €
            </span>
          </div>
        </div>
  
        <button
          onClick={handleConfirmBooking}
          disabled={
            isSubmitting ||
            !selectedSlot ||
            !customerName.trim() ||
            !customerEmail.trim() ||
            !customerPhone.trim() ||
            !selectedMassageType
          }
          className={`w-full px-6 py-4 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 mb-10 ${
            isSubmitting ||
            !selectedSlot ||
            !customerName.trim() ||
            !customerEmail.trim() ||
            !customerPhone.trim() ||
            !selectedMassageType
              ? "bg-[#4F3921] text-white opacity-50 cursor-not-allowed"
              : "bg-[#4F3921] text-white"
          }`}
        >
          {isSubmitting ? "Traitement..." : "Découvrir"}
          {!isSubmitting && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}  