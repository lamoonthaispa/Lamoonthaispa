"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Card from "@/components/Card";
import { useMockCards } from "@/hooks/useMockCards";
import { mapPriceToDurations } from "@/lib/durations";
import messages from '@/content/messages.json'



export const serviceSlugMap: Record<string, string> = {
  "Nos Soins du visage": "soin-du-visage",
  "Massages": "massage",
  "Epilation cire orientale (sucre)": "cire-orientale",
  "Teinture des cils et sourcils": "teinture",
  "Nos Gommages": "gommage",
};

export function mapServiceToSlug(input: string): string {
  return serviceSlugMap[input] ?? input.toLowerCase().replace(/\s+/g, "-");
}


type ServicesDetailKeys = keyof typeof messages['services_detail']; // 'massage' | 'gommage' | ...

export default function Cards({ type }: { type: string }) {
  const { cards: allCards } = useMockCards();
  const slug = mapServiceToSlug(type) as ServicesDetailKeys;
  const img = messages.services_detail[slug]?.hero?.image;
  
console.log(img)
console.log(type)


  const cards = useMemo(
    () => allCards.filter((card) => card.type === type),
    [allCards, type]
  );

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[6.22px] md:gap-[10px] lg:gap-[30px] w-full pb-3 md:pb-5 py-10">

      <div className="flex flex-col w-full">
        <div className="w-full lg:hidden mt-4">
          <Swiper
            slidesPerView="auto"
            spaceBetween={15}
            breakpoints={{
              820: {
                spaceBetween: 24,
              },
            }}
            className="w-full"
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index} style={{ width: "auto" }} className="flex justify-center">
                <Card
                  type={card.type}
                  title={card.title}
                  description={card.description}
                  image={img}
              durations={mapPriceToDurations(card.prices)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div
          className="hidden lg:grid gap-6 w-full mt-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}
        >
          {cards.map((card, index) => (
            <Card
              key={index}
              type={card.type}
              title={card.title}
              description={card.description}
              image={img}
              durations={mapPriceToDurations(card.prices)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}