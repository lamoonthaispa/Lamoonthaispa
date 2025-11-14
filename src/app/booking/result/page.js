"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function BookingResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const result = searchParams.get("checkout_result") || searchParams.get("result");
  const order_id = searchParams.get("order_id");

  const bookingDataFromParams = {
    booking: {
      slot: searchParams.get("slot"),
      duration: searchParams.get("duration"),
      massageType: searchParams.get("massageType"),
      name: searchParams.get("name"),
      email: searchParams.get("email"),
      phone: searchParams.get("phone"),
    },
    payment: {
      order_id,
      fullname: searchParams.get("name"),
      status: "Confirmé",
    },
  };

  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
  const [bookingData, setBookingData] = useState<any>(null);

  const formatDate = (iso) =>
    iso && !isNaN(new Date(iso).getTime())
      ? new Date(iso).toLocaleDateString("fr-FR")
      : "—";

  const formatTime = (iso) =>
    iso && !isNaN(new Date(iso).getTime())
      ? new Date(iso).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  useEffect(() => {
    if (result === "success") {
      setStatus("success");
      setBookingData(bookingDataFromParams);
    } else {
      setStatus("fail");
    }
  }, [result]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => router.push("/"), 10000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FBF6EF] flex items-center justify-center">
        <p className="text-[#4F3921] animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div className="min-h-screen bg-[#FBF6EF] flex flex-col items-center justify-between">
        <div className="flex flex-col w-full max-w-2xl px-4 sm:px-6 py-10">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center border border-[#E5DDD2]">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C2A17] mb-3">
              Paiement échoué
            </h1>
            <p className="text-[#7B6B55] text-sm sm:text-base mb-6">
              Votre paiement n’a pas pu être traité. Veuillez réessayer.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#4F3921] text-white px-6 py-3 rounded-md hover:bg-[#3C2A17] transition-all text-sm sm:text-base"
            >
              Retour à la page d’accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { booking, payment } = bookingData;

  return (
    <div className="min-h-screen bg-[#F6F1EA] flex flex-col items-center justify-between">
      <div className="flex flex-col w-full max-w-2xl px-4 sm:px-6 py-10">
        <div className="bg-[#F6F1EA] p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#3C2A17] mb-2">
            Votre réservation a été confirmée.
          </h1>
          <p className="text-[#7B6B55] text-sm sm:text-base mb-6">
            Merci pour votre réservation. Un e-mail de confirmation vous sera envoyé sous peu. <br />
            <span className="font-medium">Redirection dans 10 secondes...</span>
          </p>

          <div className="bg-white border border-[#E5DDD2] rounded-lg shadow-sm overflow-hidden pl-5 text-left">
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <div className="sm:w-1/3 w-full flex items-center justify-center p-4">
                <Image
                  src="/lamoon_logo.png"
                  alt="Lamoon Logo"
                  width={400}
                  height={200}
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
              <div className="p-4 sm:p-6 flex-1 text-sm sm:text-base text-[#4F3921] space-y-1">
                <p className="font-medium mb-2">#{payment.order_id || "—"}</p>
                <p><span className="font-semibold">Massage :</span> {booking.massageType || "—"}</p>
                <p><span className="font-semibold">Client :</span> {booking.name || payment.fullname || "—"}</p>
                <p><span className="font-semibold">Date :</span> {formatDate(booking.slot)}</p>
                <p><span className="font-semibold">Heure :</span> {formatTime(booking.slot)}</p>
                <p><span className="font-semibold">E-mail :</span> {booking.email || "—"}</p>
                <p><span className="font-semibold">Téléphone :</span> {booking.phone || "—"}</p>
                <p><span className="font-semibold">Paiement :</span> Carte bancaire</p>
                <p><span className="font-semibold">Statut :</span> {payment.status || "Confirmé"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-8 bg-[#4F3921] text-white px-6 py-3 rounded-md hover:bg-[#3C2A17] transition-all text-sm sm:text-base"
          >
            Retour à la page d’accueil
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Page wrapper with Suspense
export default function BookingResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF6EF] flex items-center justify-center">
          <p className="text-[#4F3921] animate-pulse">Chargement...</p>
        </div>
      }
    >
      <BookingResultContent />
    </Suspense>
  );
}

function Footer() {
  return (
    <footer className="bg-[#4F3921] w-full py-6 mt-10">
      <div className="text-center text-white text-sm">
        <p className="font-serif tracking-wide">LAMOON THAÏ SPA</p>
        <p className="text-xs mt-1 opacity-80">
          © 2025 Lamoon Thaï Spa | Tous droits réservés
        </p>
      </div>
    </footer>
  );
}