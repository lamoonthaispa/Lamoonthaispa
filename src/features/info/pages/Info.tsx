"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Promotion from "@/components/Promotion";
import Header from "../components/Header";
import ServiceCards from "../components/ServiceCards";
import messages from "@/content/messages.json";
import { useMockCards } from "@/hooks/useMockCards";
import type { MockCard } from "@/lib/mockCards";

export default function InfoPage() {
  const { cards: mockCards } = useMockCards();
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type")?.toLowerCase().trim();

  // สร้าง mapping type lowercase -> original
  const typeMapping = useMemo(() => {
    const mapping: Record<string, string> = {};
    mockCards.forEach((card) => {
      mapping[card.type.toLowerCase()] = card.type;
    });
    return mapping;
  }, [mockCards]);

  const filteredType = queryType ? typeMapping[queryType] : null;

  // กรองการ์ดตาม query
  const filteredCards = useMemo(() => {
    if (!filteredType) return mockCards;
    return mockCards.filter((card: MockCard) => card.type === filteredType);
  }, [mockCards, filteredType]);

  // จัดกลุ่มการ์ดตาม type (เมื่อไม่มี query)
  const groupedCards = useMemo(() => {
    if (filteredType) return null; // ถ้ามี query ไม่ต้องจัดกลุ่ม

    const groups: Record<string, MockCard[]> = {};
    mockCards.forEach((card) => {
      if (!groups[card.type]) {
        groups[card.type] = [];
      }
      groups[card.type].push(card);
    });
    return groups;
  }, [mockCards, filteredType]);

  return (
    <main className="flex flex-col bg-background">
      <Promotion />
      <Header />

      {/* กรณีมี ?type=... แสดงเฉพาะกลุ่มนั้น */}
      {filteredType ? (
        <ServiceCards serviceType={filteredType} cards={filteredCards} />
      ) : (
        /* กรณีไม่มี query แสดงทุกกลุ่ม */
        <div className="space-y-12">
          {Object.entries(groupedCards || {}).map(([type, cards]) => (
            <ServiceCards key={type} serviceType={type} cards={cards} />
          ))}
        </div>
      )}
    </main>
  );
}