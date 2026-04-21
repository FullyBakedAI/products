// Shared data — destinations, testimonials, etc.
const KITE_DESTINATIONS = [
  { city: 'Lisbon', country: 'Portugal', tag: 'Trending', days: '5 days', cls: 'ph-lisbon' },
  { city: 'Tokyo', country: 'Japan', tag: 'Editor\'s pick', days: '10 days', cls: 'ph-tokyo' },
  { city: 'Ubud', country: 'Bali, Indonesia', tag: 'Slow travel', days: '7 days', cls: 'ph-bali' },
  { city: 'Reykjavík', country: 'Iceland', tag: 'Adventure', days: '6 days', cls: 'ph-iceland' },
  { city: 'Marrakech', country: 'Morocco', tag: 'Cultural', days: '5 days', cls: 'ph-morocco' },
  { city: 'New York', country: 'USA', tag: 'City break', days: '4 days', cls: 'ph-nyc' },
  { city: 'Paris', country: 'France', tag: 'Romance', days: '5 days', cls: 'ph-paris' },
  { city: 'Patagonia', country: 'Argentina', tag: 'Hiking', days: '12 days', cls: 'ph-patagonia' },
  { city: 'Kyoto', country: 'Japan', tag: 'Traditional', days: '6 days', cls: 'ph-kyoto' },
  { city: 'Rome', country: 'Italy', tag: 'History', days: '5 days', cls: 'ph-rome' },
  { city: 'Oslo', country: 'Norway', tag: 'Nordic', days: '4 days', cls: 'ph-oslo' },
  { city: 'Cape Town', country: 'South Africa', tag: 'Wild', days: '9 days', cls: 'ph-cape' },
];

const KITE_TESTIMONIALS = [
  { quote: "Replaced three travel apps and my group chat. Kite just gets what we want.", author: "Mira K.", role: "Berlin · Planned 4 trips" },
  { quote: "Booked a last-minute weekend in Lisbon in under 10 minutes. Flights, hotel, dinner — all sorted.", author: "Theo R.", role: "London · Solo traveler" },
  { quote: "Honeymoon in Japan, zero stress. It even knew which onsen allowed tattoos.", author: "Ana & Sam", role: "Barcelona · 14 days" },
];

window.KITE_DESTINATIONS = KITE_DESTINATIONS;
window.KITE_TESTIMONIALS = KITE_TESTIMONIALS;
