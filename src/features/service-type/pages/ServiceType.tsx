import messages from "@/content/messages.json";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Formulas from "../components/Formulas";
import type { BenefitIconName } from "../components/Benefits/BenefitItem";

type DescriptionItem = {
  type: "text" | "highlight";
  value: string;
};

type TextDescriptionItem = {
  type: "text";
  value: string;
};

const SERVICE_DETAIL_KEY_MAP: Record<string, keyof typeof messages.services_detail> = {
  massage: "massage",
  gommage: "gommage",
  teinture: "teinture",
  "cire-orientale": "cire-orientale",
  "soin-du-visage": "soin-du-visage",
};

const SERVICE_TYPE_CARD_LABEL: Record<string, string> = {
  massage: "Massages",
  gommage: "Nos Gommages",
  teinture: "Teinture des cils et sourcils",
  "cire-orientale": "Epilation cire orientale (sucre)",
  "soin-du-visage": "Nos Soins du visage",
};

export default function ServiceTypePage({
  serviceType,
}: {
  serviceType: string;
}) {
  const detailKey = SERVICE_DETAIL_KEY_MAP[serviceType];
  const serviceDetail = detailKey ? messages.services_detail[detailKey] : undefined;

  if (!serviceDetail) {
    return null;
  }

  const {
    hero,
    benefits_section: benefitsSection,
    formulas_section: formulasSection,
  } = serviceDetail;

  const toDescriptionItems = (value?: string): TextDescriptionItem[] => {
    if (!value) {
      return [];
    }

    const item: TextDescriptionItem = {
      type: "text",
      value,
    };

    return [item];
  };

  const benefitsDescriptions = toDescriptionItems(benefitsSection.info_description) as DescriptionItem[];
  const formulasDescriptions = toDescriptionItems(formulasSection.description) as DescriptionItem[];
  const heroDescriptions = hero.description as DescriptionItem[];

  const cardsType = SERVICE_TYPE_CARD_LABEL[serviceType];

  const benefitsData = benefitsSection.benefits as { icon: BenefitIconName; label: string }[];

  return (
    <main className="flex flex-col bg-background min-h-screen">
      <Hero
        title={hero.title}
        descriptions={heroDescriptions}
        buttonText={hero.book}
        src={hero.image}
        alt={hero.title}
      />

      <Benefits
        type={serviceType}
        benefits={benefitsData}
        title={benefitsSection.info_title}
        descriptions={benefitsDescriptions}
      />

      <Formulas
        title={formulasSection.title}
        descriptions={formulasDescriptions}
        cardType={cardsType}
      />
    </main>
  );
}