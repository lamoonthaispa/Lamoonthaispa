export type DurationPriceMap = {
  "30m"?: number | null;
  "45m"?: number | null;
  "1h"?: number | null;
  "1h30"?: number | null;
  "5h"?: number | null;
  "10h"?: number | null;
  "15h"?: number | null;
};

export type DurationDisplay = {
  time: string;
  price: string;
};

// ฟอร์แมตราคา: null/undefined → "-"
const formatPrice = (value: number | null | undefined) =>
  value !== undefined && value !== null ? `${value}€` : "-";

// mapping ชื่อเวลาให้ display-friendly
const displayName: Record<string, string> = {
  "30m": "30min",
  "45m": "45min",
  "1h": "1h",
  "1h30": "1.5h",
  "5h": "5h",
  "10h": "10h",
  "15h": "15h",
};

// ลำดับเวลา default สำหรับเรียง
const timeOrder = ["30m", "45m", "1h", "1h30", "5h", "10h", "15h"];

export const mapPriceToDurations = (prices: DurationPriceMap): DurationDisplay[] => {
  // เอาเฉพาะ key ที่มีใน object
  const keys = Object.keys(prices)
    .filter((key) => key in displayName)
    .sort((a, b) => timeOrder.indexOf(a) - timeOrder.indexOf(b)); // เรียงตาม order

  return keys.map((key) => ({
    time: displayName[key],
    price: formatPrice(prices[key as keyof DurationPriceMap]),
  }));
};
