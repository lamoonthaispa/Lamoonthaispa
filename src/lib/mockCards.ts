export type MockCard = {
  title: string;
  description: string;
  type: string;
  prices: {
    "30m"?: number | null;
    "45m"?: number | null;
    "1h"?: number | null;
    "1h30"?: number | null;
    "5h"?:number | null;
    "10h"?:number | null;
    "15h"?:number | null;
  };
};

let cachedMockCards: MockCard[] | null = null;
let pendingRequest: Promise<MockCard[]> | null = null;

export async function fetchMockCards(): Promise<MockCard[]> {
  if (cachedMockCards) {
    return cachedMockCards;
  }

  if (!pendingRequest) {
    pendingRequest = fetch("/data/mock_cards.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch mock cards: ${response.status}`);
        }

        return response.json() as Promise<MockCard[]>;
      })
      .then((data) => {
        cachedMockCards = data;
        pendingRequest = null;
        return data;
      })
      .catch((error) => {
        pendingRequest = null;
        throw error;
      });
  }

  return pendingRequest;
}

