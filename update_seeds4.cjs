const fs = require('fs');

const AIRLINES = [
  { name: 'EgyptAir', logo: '/assets/airlines/egyptair.png' },
  { name: 'Emirates', logo: '/assets/airlines/emirates.png' },
  { name: 'Lufthansa', logo: '/assets/airlines/lufthansa.png' },
  { name: 'Turkish Airlines', logo: '/assets/airlines/turkish.png' }
];

const CITIES = [
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, code: 'CAI' },
  { name: 'Luxor', country: 'Egypt', lat: 25.6872, lng: 32.6396, code: 'LXR' },
  { name: 'Aswan', country: 'Egypt', lat: 24.0889, lng: 32.8998, code: 'ASW' },
  { name: 'Sharm El Sheikh', country: 'Egypt', lat: 27.9158, lng: 34.3299, code: 'SSH' },
  { name: 'Hurghada', country: 'Egypt', lat: 27.2579, lng: 33.8116, code: 'HRG' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, code: 'DXB' },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, code: 'IST' },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, code: 'LHR' },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, code: 'CDG' }
];

const destinationImages = {
  "Cairo": [
    "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600&q=80",
    "https://images.unsplash.com/photo-1553603227-2358aabe8eb8?w=1600&q=80",
    "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80"
  ],
  "Luxor": [
    "https://images.unsplash.com/photo-1698228399564-969c6fc965f5?w=1600&q=80",
    "https://images.unsplash.com/photo-1600520611035-85dd4e48b598?w=1600&q=80",
    "https://images.unsplash.com/photo-1596733471018-8d4e9a31a5dc?w=1600&q=80"
  ],
  "Aswan": [
    "https://images.unsplash.com/photo-1549479361-b54b0e8b1b22?w=1600&q=80",
    "https://images.unsplash.com/photo-1574163935100-c9772bf220ca?w=1600&q=80",
    "https://images.unsplash.com/photo-1614725902096-7edbca2e0541?w=1600&q=80"
  ],
  "Sharm El Sheikh": [
    "https://images.unsplash.com/photo-1512413912196-189f7831f2de?w=1600&q=80",
    "https://images.unsplash.com/photo-1571165213459-71c1bd56fa06?w=1600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80"
  ],
  "Hurghada": [
    "https://images.unsplash.com/photo-1588691520147-386b033e6f96?w=1600&q=80",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1600&q=80",
    "https://images.unsplash.com/photo-1544158652-fef1bc3c92ce?w=1600&q=80"
  ],
  "Dubai": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    "https://images.unsplash.com/photo-1582672060624-ac926d117047?w=1600&q=80",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80"
  ],
  "Istanbul": [
    "https://images.unsplash.com/photo-1522083115456-fce117400ac5?w=1600&q=80",
    "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1600&q=80",
    "https://images.unsplash.com/photo-1526958434771-460d37e6da80?w=1600&q=80"
  ],
  "London": [
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80",
    "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&q=80",
    "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80"
  ],
  "Paris": [
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1600&q=80",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80"
  ]
};

let usedImages = new Set();
function getUniqueImage(destination) {
  const imgs = destinationImages[destination] || [
    "https://images.unsplash.com/photo-1436491865332-7a61a109ce05?w=1600&q=80",
    "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=1600&q=80"
  ];
  
  const unused = imgs.filter(img => !usedImages.has(img));
  let selected;
  
  if (unused.length > 0) {
    selected = unused[Math.floor(Math.random() * unused.length)];
  } else {
    // fallback
    selected = imgs[Math.floor(Math.random() * imgs.length)];
  }
  
  usedImages.add(selected);
  return selected;
}

function generatePrice(from, to, classType) {
  const routes = {
    "Cairo-Luxor": [800, 2500],
    "Cairo-Aswan": [900, 3000],
    "Cairo-Hurghada": [1000, 3500],
    "Cairo-Dubai": [4000, 9000],
    "Cairo-Istanbul": [5000, 10000],
    "Cairo-London": [9000, 20000],
    "Cairo-Paris": [10000, 22000]
  };

  const key = `${from}-${to}`;
  const revKey = `${to}-${from}`;
  const range = routes[key] || routes[revKey] || [3000, 12000];

  let base = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

  if (classType === "Business") base *= 1.8;
  if (classType === "First") base *= 2.5;

  return Math.round(base);
}

const CLASSES = ['Economy', 'Economy', 'Business', 'First'];
const TICKET_TYPES = ['One-way', 'Round-trip'];

const flights = [];

for (let i = 1; i <= 50; i++) {
  const fromCity = CITIES[Math.floor(Math.random() * CITIES.length)];
  let toCity = CITIES[Math.floor(Math.random() * CITIES.length)];
  while (fromCity.name === toCity.name) {
    toCity = CITIES[Math.floor(Math.random() * CITIES.length)];
  }

  const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
  const classType = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const ticketType = TICKET_TYPES[Math.floor(Math.random() * TICKET_TYPES.length)];
  const stops = Math.random() > 0.5 ? 0 : 1;
  const durationH = Math.floor(Math.random() * 8) + 1;
  const durationM = Math.floor(Math.random() * 6) * 10;
  const depTimeOffset = Math.random() * 14 * 24 * 3600000;
  
  const price = generatePrice(fromCity.name, toCity.name, classType);
  const image = getUniqueImage(toCity.name);

  // Skip generating if we randomly hit no image in fallback, though we have fallbacks.

  const f = {
    airline: airline.name,
    airlineLogo: airline.logo,
    flightNumber: `${airline.name.substring(0, 2).toUpperCase()}-${100 + i}`,
    departureCity: fromCity.name,
    arrivalCity: toCity.name,
    countryFrom: fromCity.country,
    countryTo: toCity.country,
    departureAirport: fromCity.code,
    arrivalAirport: toCity.code,
    departureTime: `__NEW_DATE__+ ${depTimeOffset}`,
    arrivalTime: `__NEW_DATE__+ ${depTimeOffset + (durationH * 3600000) + (durationM * 60000)}`,
    price: price,
    availableSeats: Math.floor(Math.random() * 100) + 10,
    class: classType,
    ticketType: ticketType,
    duration: `${durationH}h ${durationM}m`,
    stops: stops,
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 1000) + 50,
    image: image,
    coordinates: {
      from: { lat: fromCity.lat, lng: fromCity.lng },
      to: { lat: toCity.lat, lng: toCity.lng }
    }
  };
  
  flights.push(f);
}

let json = JSON.stringify(flights, null, 2);
json = json.replace(/"__NEW_DATE__\+ (.*?)"/g, "new Date(Date.now() + $1)");

let seedsStr = fs.readFileSync('server/seeds.ts', 'utf8');

const stratMatch = "const flights = [";
const endMatch = "];\n\nconst hotels = [";

const startIdx = seedsStr.indexOf(stratMatch);
const endIdx = seedsStr.indexOf("\n\nconst hotels = [");

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `const flights = ${json};`;
    
    // We must find where the array actually ends precisely.
    // '];\\n\\nconst hotels = [' is a bit brittle if spaces change, so let's stick to the end index + length of ']'
    seedsStr = seedsStr.substring(0, startIdx) + replacement + seedsStr.substring(endIdx);
    fs.writeFileSync('server/seeds.ts', seedsStr);
    console.log("Replaced seeds successfully. Generated flights:", flights.length);
} else {
    console.log("Could not find match indices in server/seeds.ts");
}
