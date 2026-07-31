import type { AgodaHotel } from "./agoda";

// Extended detail info shown on the hotel detail page.
// (Real Agoda API returns much of this in the detail endpoint.)
export type HotelDetail = {
  address: string;
  description: string;
  amenities: string[];
  photos: string[];
  rooms: { name: string; price: number; sqm: number; bed: string }[];
  location: { lat: number; lng: number };
};

export const HOTEL_DETAILS: Record<number, HotelDetail> = {
  1001: {
    address: "48 Oriental Avenue, Bang Rak, Bangkok 10500, Thailand",
    description:
      "A Bangkok institution since 1876, this legendary riverside property blends colonial heritage with modern luxury. Award-winning restaurants, a landmark spa, and views over the Chao Phraya River.",
    amenities: ["Free WiFi", "Riverside pool", "Award-winning spa", "5 restaurants", "Airport shuttle", "Fitness center", "Concierge"],
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=1200",
    ],
    rooms: [
      { name: "Deluxe Room", price: 385, sqm: 42, bed: "1 King" },
      { name: "River View Suite", price: 620, sqm: 68, bed: "1 King" },
      { name: "Oriental Suite", price: 1250, sqm: 120, bed: "1 King + Living Area" },
    ],
    location: { lat: 13.7248, lng: 100.5127 },
  },
  1002: {
    address: "333 Charoennakorn Road, Klongsan, Bangkok 10600, Thailand",
    description:
      "The Peninsula's Bangkok flagship offers panoramic river views from every room. Iconic W-shaped tower, three swimming pools, and Chao Phraya boat service to shopping and dining districts.",
    amenities: ["Free WiFi", "3 outdoor pools", "Peninsula Spa", "River shuttle", "Kids club", "Fitness center", "Butler service"],
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200",
      "https://images.unsplash.com/photo-1590490360836-95e9c7648c98?w=1200",
    ],
    rooms: [
      { name: "Deluxe Room", price: 340, sqm: 46, bed: "1 King or 2 Twins" },
      { name: "Grand Deluxe Suite", price: 780, sqm: 87, bed: "1 King" },
    ],
    location: { lat: 13.7263, lng: 100.5081 },
  },
};

// Fallback detail for hotels without hand-written data
export function getHotelDetail(id: number): HotelDetail {
  if (HOTEL_DETAILS[id]) return HOTEL_DETAILS[id];
  return {
    address: "Address available upon booking",
    description:
      "A well-appointed hotel offering comfortable rooms, quality service, and convenient access to the city's main attractions. Perfect for both business and leisure travelers.",
    amenities: ["Free WiFi", "24-hour reception", "Air conditioning", "Room service", "Daily housekeeping"],
    photos: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
    ],
    rooms: [
      { name: "Standard Room", price: 95, sqm: 25, bed: "1 Queen" },
      { name: "Deluxe Room", price: 145, sqm: 32, bed: "1 King" },
    ],
    location: { lat: 13.7563, lng: 100.5018 },
  };
}

// Mock data for development before Agoda API approval.
// Photos are Unsplash — free to use, replace with real Agoda CDN URLs when live.
export const MOCK_HOTELS: AgodaHotel[] = [
  {
    hotelId: 1001,
    hotelName: "Mandarin Oriental Bangkok",
    starRating: 5,
    reviewScore: 9.2,
    reviewCount: 3421,
    imageURL: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    dailyRate: 385,
    crossedOutRate: 520,
    currency: "USD",
    landingURL: "https://www.agoda.com/mandarin-oriental-bangkok?cid=DEMO",
    freeWifi: true,
    freeBreakfast: true,
  },
  {
    hotelId: 1002,
    hotelName: "The Peninsula Bangkok",
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 2890,
    imageURL: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    dailyRate: 340,
    currency: "USD",
    landingURL: "https://www.agoda.com/peninsula-bangkok?cid=DEMO",
    freeWifi: true,
  },
  {
    hotelId: 1003,
    hotelName: "Sofitel So Bangkok",
    starRating: 5,
    reviewScore: 8.9,
    reviewCount: 1876,
    imageURL: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    dailyRate: 210,
    crossedOutRate: 280,
    currency: "USD",
    landingURL: "https://www.agoda.com/sofitel-so-bangkok?cid=DEMO",
    freeWifi: true,
    freeBreakfast: true,
  },
  {
    hotelId: 1004,
    hotelName: "Riva Surya Bangkok",
    starRating: 4,
    reviewScore: 8.5,
    reviewCount: 1245,
    imageURL: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    dailyRate: 95,
    currency: "USD",
    landingURL: "https://www.agoda.com/riva-surya-bangkok?cid=DEMO",
    freeWifi: true,
  },
  {
    hotelId: 1005,
    hotelName: "Chatrium Riverside Bangkok",
    starRating: 5,
    reviewScore: 8.8,
    reviewCount: 4102,
    imageURL: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    dailyRate: 145,
    crossedOutRate: 195,
    currency: "USD",
    landingURL: "https://www.agoda.com/chatrium-riverside?cid=DEMO",
    freeWifi: true,
  },
  {
    hotelId: 1006,
    hotelName: "Anantara Riverside Bangkok Resort",
    starRating: 5,
    reviewScore: 9.0,
    reviewCount: 2567,
    imageURL: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    dailyRate: 245,
    currency: "USD",
    landingURL: "https://www.agoda.com/anantara-riverside?cid=DEMO",
    freeWifi: true,
    freeBreakfast: true,
  },
  {
    hotelId: 1007,
    hotelName: "Volve Hotel Bangkok",
    starRating: 4,
    reviewScore: 8.3,
    reviewCount: 890,
    imageURL: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    dailyRate: 78,
    currency: "USD",
    landingURL: "https://www.agoda.com/volve-hotel?cid=DEMO",
    freeWifi: true,
  },
  {
    hotelId: 1008,
    hotelName: "Bangkok Marriott Marquis Queen's Park",
    starRating: 5,
    reviewScore: 8.7,
    reviewCount: 5321,
    imageURL: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    dailyRate: 175,
    crossedOutRate: 225,
    currency: "USD",
    landingURL: "https://www.agoda.com/marriott-marquis?cid=DEMO",
    freeWifi: true,
    freeBreakfast: true,
  },
  {
    hotelId: 1009,
    hotelName: "Ibis Styles Bangkok Sukhumvit 4",
    starRating: 3,
    reviewScore: 8.1,
    reviewCount: 1543,
    imageURL: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    dailyRate: 52,
    currency: "USD",
    landingURL: "https://www.agoda.com/ibis-styles-sukhumvit?cid=DEMO",
    freeWifi: true,
  },
];
