import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Flight, Hotel, Review } from './models.js';
import { Car } from './models/Car.js';
import { Journal } from './models/Journal.js';

dotenv.config();

const flights = [
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-101",
    "departureCity": "Cairo",
    "arrivalCity": "Sharm El Sheikh",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "CAI",
    "arrivalAirport": "SSH",
    "departureTime": new Date(Date.now() + 936951879.542725),
    "arrivalTime": new Date(Date.now() + 949551879.542725),
    "price": 8748,
    "availableSeats": 32,
    "class": "First",
    "ticketType": "One-way",
    "duration": "3h 30m",
    "stops": 1,
    "rating": 4.4,
    "reviewCount": 418,
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 27.9158,
        "lng": 34.3299
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-102",
    "departureCity": "Luxor",
    "arrivalCity": "Cairo",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "LXR",
    "arrivalAirport": "CAI",
    "departureTime": new Date(Date.now() + 33387214.767455403),
    "arrivalTime": new Date(Date.now() + 37587214.7674554),
    "price": 2190,
    "availableSeats": 11,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "1h 10m",
    "stops": 1,
    "rating": 3.6,
    "reviewCount": 112,
    "image": "https://images.unsplash.com/photo-1553603227-2358aabe8eb8?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-103",
    "departureCity": "Aswan",
    "arrivalCity": "Paris",
    "countryFrom": "Egypt",
    "countryTo": "France",
    "departureAirport": "ASW",
    "arrivalAirport": "CDG",
    "departureTime": new Date(Date.now() + 281722989.04777354),
    "arrivalTime": new Date(Date.now() + 292522989.04777354),
    "price": 6380,
    "availableSeats": 18,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "3h 0m",
    "stops": 0,
    "rating": 3.7,
    "reviewCount": 701,
    "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-104",
    "departureCity": "Luxor",
    "arrivalCity": "Istanbul",
    "countryFrom": "Egypt",
    "countryTo": "Turkey",
    "departureAirport": "LXR",
    "arrivalAirport": "IST",
    "departureTime": new Date(Date.now() + 391164866.4701319),
    "arrivalTime": new Date(Date.now() + 419964866.4701319),
    "price": 10678,
    "availableSeats": 41,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "8h 0m",
    "stops": 1,
    "rating": 5,
    "reviewCount": 1002,
    "image": "https://images.unsplash.com/photo-1526958434771-460d37e6da80?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 41.0082,
        "lng": 28.9784
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-105",
    "departureCity": "Hurghada",
    "arrivalCity": "Aswan",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "HRG",
    "arrivalAirport": "ASW",
    "departureTime": new Date(Date.now() + 270983394.7021625),
    "arrivalTime": new Date(Date.now() + 293783394.7021625),
    "price": 7375,
    "availableSeats": 72,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "6h 20m",
    "stops": 0,
    "rating": 4,
    "reviewCount": 425,
    "image": "https://images.unsplash.com/photo-1574163935100-c9772bf220ca?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.2579,
        "lng": 33.8116
      },
      "to": {
        "lat": 24.0889,
        "lng": 32.8998
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-106",
    "departureCity": "Istanbul",
    "arrivalCity": "Luxor",
    "countryFrom": "Turkey",
    "countryTo": "Egypt",
    "departureAirport": "IST",
    "arrivalAirport": "LXR",
    "departureTime": new Date(Date.now() + 1200071882.8449695),
    "arrivalTime": new Date(Date.now() + 1209071882.8449695),
    "price": 7544,
    "availableSeats": 63,
    "class": "Business",
    "ticketType": "Round-trip",
    "duration": "2h 30m",
    "stops": 0,
    "rating": 3.7,
    "reviewCount": 285,
    "image": "https://images.unsplash.com/photo-1698228399564-969c6fc965f5?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 41.0082,
        "lng": 28.9784
      },
      "to": {
        "lat": 25.6872,
        "lng": 32.6396
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-107",
    "departureCity": "Istanbul",
    "arrivalCity": "Dubai",
    "countryFrom": "Turkey",
    "countryTo": "UAE",
    "departureAirport": "IST",
    "arrivalAirport": "DXB",
    "departureTime": new Date(Date.now() + 1116161221.7780392),
    "arrivalTime": new Date(Date.now() + 1146761221.7780392),
    "price": 13498,
    "availableSeats": 79,
    "class": "First",
    "ticketType": "One-way",
    "duration": "8h 30m",
    "stops": 1,
    "rating": 4.3,
    "reviewCount": 87,
    "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 41.0082,
        "lng": 28.9784
      },
      "to": {
        "lat": 25.2048,
        "lng": 55.2708
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-108",
    "departureCity": "Cairo",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "CAI",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 8709974.600345703),
    "arrivalTime": new Date(Date.now() + 34509974.6003457),
    "price": 36590,
    "availableSeats": 103,
    "class": "First",
    "ticketType": "Round-trip",
    "duration": "7h 10m",
    "stops": 0,
    "rating": 4.7,
    "reviewCount": 831,
    "image": "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-109",
    "departureCity": "Hurghada",
    "arrivalCity": "Luxor",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "HRG",
    "arrivalAirport": "LXR",
    "departureTime": new Date(Date.now() + 130547182.64047109),
    "arrivalTime": new Date(Date.now() + 137747182.6404711),
    "price": 19398,
    "availableSeats": 16,
    "class": "First",
    "ticketType": "Round-trip",
    "duration": "2h 0m",
    "stops": 1,
    "rating": 4.8,
    "reviewCount": 873,
    "image": "https://images.unsplash.com/photo-1600520611035-85dd4e48b598?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.2579,
        "lng": 33.8116
      },
      "to": {
        "lat": 25.6872,
        "lng": 32.6396
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-110",
    "departureCity": "Luxor",
    "arrivalCity": "Istanbul",
    "countryFrom": "Egypt",
    "countryTo": "Turkey",
    "departureAirport": "LXR",
    "arrivalAirport": "IST",
    "departureTime": new Date(Date.now() + 809485695.4062042),
    "arrivalTime": new Date(Date.now() + 817285695.4062042),
    "price": 3346,
    "availableSeats": 62,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "2h 10m",
    "stops": 0,
    "rating": 4.1,
    "reviewCount": 103,
    "image": "https://images.unsplash.com/photo-1522083115456-fce117400ac5?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 41.0082,
        "lng": 28.9784
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-111",
    "departureCity": "Paris",
    "arrivalCity": "Cairo",
    "countryFrom": "France",
    "countryTo": "Egypt",
    "departureAirport": "CDG",
    "arrivalAirport": "CAI",
    "departureTime": new Date(Date.now() + 164525090.39297366),
    "arrivalTime": new Date(Date.now() + 177725090.39297366),
    "price": 14233,
    "availableSeats": 46,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "3h 40m",
    "stops": 0,
    "rating": 3.9,
    "reviewCount": 444,
    "image": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 48.8566,
        "lng": 2.3522
      },
      "to": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-112",
    "departureCity": "Istanbul",
    "arrivalCity": "London",
    "countryFrom": "Turkey",
    "countryTo": "UK",
    "departureAirport": "IST",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 951512246.3486382),
    "arrivalTime": new Date(Date.now() + 962312246.3486382),
    "price": 7005,
    "availableSeats": 107,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "3h 0m",
    "stops": 0,
    "rating": 4.2,
    "reviewCount": 871,
    "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 41.0082,
        "lng": 28.9784
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-113",
    "departureCity": "Sharm El Sheikh",
    "arrivalCity": "Paris",
    "countryFrom": "Egypt",
    "countryTo": "France",
    "departureAirport": "SSH",
    "arrivalAirport": "CDG",
    "departureTime": new Date(Date.now() + 747854862.6697341),
    "arrivalTime": new Date(Date.now() + 760454862.6697341),
    "price": 10333,
    "availableSeats": 19,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "3h 30m",
    "stops": 0,
    "rating": 4.7,
    "reviewCount": 163,
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.9158,
        "lng": 34.3299
      },
      "to": {
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-114",
    "departureCity": "Cairo",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "CAI",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 360238842.15145713),
    "arrivalTime": new Date(Date.now() + 378838842.15145713),
    "price": 22401,
    "availableSeats": 75,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "5h 10m",
    "stops": 0,
    "rating": 3.7,
    "reviewCount": 407,
    "image": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-115",
    "departureCity": "Paris",
    "arrivalCity": "Luxor",
    "countryFrom": "France",
    "countryTo": "Egypt",
    "departureAirport": "CDG",
    "arrivalAirport": "LXR",
    "departureTime": new Date(Date.now() + 186104012.24770018),
    "arrivalTime": new Date(Date.now() + 193904012.24770018),
    "price": 9398,
    "availableSeats": 82,
    "class": "First",
    "ticketType": "Round-trip",
    "duration": "2h 10m",
    "stops": 0,
    "rating": 4.2,
    "reviewCount": 810,
    "image": "https://images.unsplash.com/photo-1596733471018-8d4e9a31a5dc?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 48.8566,
        "lng": 2.3522
      },
      "to": {
        "lat": 25.6872,
        "lng": 32.6396
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-116",
    "departureCity": "Aswan",
    "arrivalCity": "Dubai",
    "countryFrom": "Egypt",
    "countryTo": "UAE",
    "departureAirport": "ASW",
    "arrivalAirport": "DXB",
    "departureTime": new Date(Date.now() + 191397557.68912756),
    "arrivalTime": new Date(Date.now() + 223197557.68912756),
    "price": 26245,
    "availableSeats": 74,
    "class": "First",
    "ticketType": "One-way",
    "duration": "8h 50m",
    "stops": 0,
    "rating": 4.3,
    "reviewCount": 939,
    "image": "https://images.unsplash.com/photo-1582672060624-ac926d117047?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 25.2048,
        "lng": 55.2708
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-117",
    "departureCity": "Cairo",
    "arrivalCity": "Aswan",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "CAI",
    "arrivalAirport": "ASW",
    "departureTime": new Date(Date.now() + 8449237.49115526),
    "arrivalTime": new Date(Date.now() + 22249237.49115526),
    "price": 2915,
    "availableSeats": 53,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "3h 50m",
    "stops": 1,
    "rating": 3.6,
    "reviewCount": 228,
    "image": "https://images.unsplash.com/photo-1614725902096-7edbca2e0541?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 24.0889,
        "lng": 32.8998
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-118",
    "departureCity": "Hurghada",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "HRG",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 842919184.0933716),
    "arrivalTime": new Date(Date.now() + 847719184.0933716),
    "price": 11381,
    "availableSeats": 39,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "1h 20m",
    "stops": 1,
    "rating": 4.4,
    "reviewCount": 455,
    "image": "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.2579,
        "lng": 33.8116
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-119",
    "departureCity": "Aswan",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "ASW",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 1165000457.1702478),
    "arrivalTime": new Date(Date.now() + 1168600457.1702478),
    "price": 3732,
    "availableSeats": 57,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "1h 0m",
    "stops": 0,
    "rating": 3.9,
    "reviewCount": 583,
    "image": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-120",
    "departureCity": "Luxor",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "LXR",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 188233762.15266132),
    "arrivalTime": new Date(Date.now() + 195433762.15266132),
    "price": 8286,
    "availableSeats": 16,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "2h 0m",
    "stops": 1,
    "rating": 4.3,
    "reviewCount": 159,
    "image": "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-121",
    "departureCity": "Aswan",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "ASW",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 11721964.947241528),
    "arrivalTime": new Date(Date.now() + 18921964.94724153),
    "price": 8478,
    "availableSeats": 16,
    "class": "Business",
    "ticketType": "Round-trip",
    "duration": "2h 0m",
    "stops": 1,
    "rating": 3.9,
    "reviewCount": 873,
    "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-122",
    "departureCity": "Luxor",
    "arrivalCity": "Hurghada",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "LXR",
    "arrivalAirport": "HRG",
    "departureTime": new Date(Date.now() + 900863504.1026984),
    "arrivalTime": new Date(Date.now() + 918263504.1026984),
    "price": 3672,
    "availableSeats": 81,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "4h 50m",
    "stops": 0,
    "rating": 4.3,
    "reviewCount": 191,
    "image": "https://images.unsplash.com/photo-1544158652-fef1bc3c92ce?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 27.2579,
        "lng": 33.8116
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-123",
    "departureCity": "Sharm El Sheikh",
    "arrivalCity": "Dubai",
    "countryFrom": "Egypt",
    "countryTo": "UAE",
    "departureAirport": "SSH",
    "arrivalAirport": "DXB",
    "departureTime": new Date(Date.now() + 99663719.37041694),
    "arrivalTime": new Date(Date.now() + 117063719.37041694),
    "price": 9263,
    "availableSeats": 69,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "4h 50m",
    "stops": 0,
    "rating": 4.6,
    "reviewCount": 668,
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.9158,
        "lng": 34.3299
      },
      "to": {
        "lat": 25.2048,
        "lng": 55.2708
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-124",
    "departureCity": "Cairo",
    "arrivalCity": "Dubai",
    "countryFrom": "Egypt",
    "countryTo": "UAE",
    "departureAirport": "CAI",
    "arrivalAirport": "DXB",
    "departureTime": new Date(Date.now() + 359423824.6856813),
    "arrivalTime": new Date(Date.now() + 381623824.6856813),
    "price": 4546,
    "availableSeats": 106,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "6h 10m",
    "stops": 0,
    "rating": 3.7,
    "reviewCount": 1003,
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 25.2048,
        "lng": 55.2708
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-125",
    "departureCity": "Hurghada",
    "arrivalCity": "Aswan",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "HRG",
    "arrivalAirport": "ASW",
    "departureTime": new Date(Date.now() + 1035876586.4221153),
    "arrivalTime": new Date(Date.now() + 1067076586.4221153),
    "price": 4498,
    "availableSeats": 32,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "8h 40m",
    "stops": 0,
    "rating": 3.7,
    "reviewCount": 807,
    "image": "https://images.unsplash.com/photo-1549479361-b54b0e8b1b22?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.2579,
        "lng": 33.8116
      },
      "to": {
        "lat": 24.0889,
        "lng": 32.8998
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-126",
    "departureCity": "Paris",
    "arrivalCity": "Istanbul",
    "countryFrom": "France",
    "countryTo": "Turkey",
    "departureAirport": "CDG",
    "arrivalAirport": "IST",
    "departureTime": new Date(Date.now() + 340850953.4779382),
    "arrivalTime": new Date(Date.now() + 364250953.4779382),
    "price": 4856,
    "availableSeats": 11,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "6h 30m",
    "stops": 1,
    "rating": 4.6,
    "reviewCount": 138,
    "image": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 48.8566,
        "lng": 2.3522
      },
      "to": {
        "lat": 41.0082,
        "lng": 28.9784
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-127",
    "departureCity": "Aswan",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "ASW",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 812816726.5772092),
    "arrivalTime": new Date(Date.now() + 832616726.5772092),
    "price": 7378,
    "availableSeats": 12,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "5h 30m",
    "stops": 0,
    "rating": 4.8,
    "reviewCount": 957,
    "image": "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-128",
    "departureCity": "Cairo",
    "arrivalCity": "Paris",
    "countryFrom": "Egypt",
    "countryTo": "France",
    "departureAirport": "CAI",
    "arrivalAirport": "CDG",
    "departureTime": new Date(Date.now() + 56474474.570575975),
    "arrivalTime": new Date(Date.now() + 79274474.57057598),
    "price": 28681,
    "availableSeats": 97,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "6h 20m",
    "stops": 1,
    "rating": 4.5,
    "reviewCount": 839,
    "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-129",
    "departureCity": "Dubai",
    "arrivalCity": "Aswan",
    "countryFrom": "UAE",
    "countryTo": "Egypt",
    "departureAirport": "DXB",
    "arrivalAirport": "ASW",
    "departureTime": new Date(Date.now() + 571471060.6190852),
    "arrivalTime": new Date(Date.now() + 589471060.6190852),
    "price": 16280,
    "availableSeats": 101,
    "class": "First",
    "ticketType": "One-way",
    "duration": "5h 0m",
    "stops": 1,
    "rating": 3.6,
    "reviewCount": 89,
    "image": "https://images.unsplash.com/photo-1549479361-b54b0e8b1b22?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.2048,
        "lng": 55.2708
      },
      "to": {
        "lat": 24.0889,
        "lng": 32.8998
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-130",
    "departureCity": "Sharm El Sheikh",
    "arrivalCity": "Hurghada",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "SSH",
    "arrivalAirport": "HRG",
    "departureTime": new Date(Date.now() + 593483072.9258847),
    "arrivalTime": new Date(Date.now() + 611483072.9258847),
    "price": 12532,
    "availableSeats": 96,
    "class": "Business",
    "ticketType": "Round-trip",
    "duration": "5h 0m",
    "stops": 0,
    "rating": 4.9,
    "reviewCount": 938,
    "image": "https://images.unsplash.com/photo-1588691520147-386b033e6f96?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.9158,
        "lng": 34.3299
      },
      "to": {
        "lat": 27.2579,
        "lng": 33.8116
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-131",
    "departureCity": "Paris",
    "arrivalCity": "Sharm El Sheikh",
    "countryFrom": "France",
    "countryTo": "Egypt",
    "departureAirport": "CDG",
    "arrivalAirport": "SSH",
    "departureTime": new Date(Date.now() + 741186525.6061304),
    "arrivalTime": new Date(Date.now() + 759786525.6061304),
    "price": 5538,
    "availableSeats": 80,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "5h 10m",
    "stops": 0,
    "rating": 3.6,
    "reviewCount": 576,
    "image": "https://images.unsplash.com/photo-1512413912196-189f7831f2de?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 48.8566,
        "lng": 2.3522
      },
      "to": {
        "lat": 27.9158,
        "lng": 34.3299
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-132",
    "departureCity": "Sharm El Sheikh",
    "arrivalCity": "Paris",
    "countryFrom": "Egypt",
    "countryTo": "France",
    "departureAirport": "SSH",
    "arrivalAirport": "CDG",
    "departureTime": new Date(Date.now() + 595886439.8894541),
    "arrivalTime": new Date(Date.now() + 622886439.8894541),
    "price": 4228,
    "availableSeats": 58,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "7h 30m",
    "stops": 1,
    "rating": 4.5,
    "reviewCount": 738,
    "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.9158,
        "lng": 34.3299
      },
      "to": {
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-133",
    "departureCity": "Cairo",
    "arrivalCity": "Sharm El Sheikh",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "CAI",
    "arrivalAirport": "SSH",
    "departureTime": new Date(Date.now() + 893581978.428431),
    "arrivalTime": new Date(Date.now() + 913381978.428431),
    "price": 9506,
    "availableSeats": 76,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "5h 30m",
    "stops": 1,
    "rating": 4.4,
    "reviewCount": 337,
    "image": "https://images.unsplash.com/photo-1571165213459-71c1bd56fa06?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 27.9158,
        "lng": 34.3299
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-134",
    "departureCity": "Istanbul",
    "arrivalCity": "Luxor",
    "countryFrom": "Turkey",
    "countryTo": "Egypt",
    "departureAirport": "IST",
    "arrivalAirport": "LXR",
    "departureTime": new Date(Date.now() + 685192.1256106095),
    "arrivalTime": new Date(Date.now() + 19285192.12561061),
    "price": 8051,
    "availableSeats": 20,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "5h 10m",
    "stops": 0,
    "rating": 3.6,
    "reviewCount": 366,
    "image": "https://images.unsplash.com/photo-1600520611035-85dd4e48b598?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 41.0082,
        "lng": 28.9784
      },
      "to": {
        "lat": 25.6872,
        "lng": 32.6396
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-135",
    "departureCity": "Aswan",
    "arrivalCity": "Luxor",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "ASW",
    "arrivalAirport": "LXR",
    "departureTime": new Date(Date.now() + 901208967.0529623),
    "arrivalTime": new Date(Date.now() + 910208967.0529623),
    "price": 3711,
    "availableSeats": 30,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "2h 30m",
    "stops": 0,
    "rating": 3.6,
    "reviewCount": 462,
    "image": "https://images.unsplash.com/photo-1596733471018-8d4e9a31a5dc?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 25.6872,
        "lng": 32.6396
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-136",
    "departureCity": "Hurghada",
    "arrivalCity": "Cairo",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "HRG",
    "arrivalAirport": "CAI",
    "departureTime": new Date(Date.now() + 168506595.37051243),
    "arrivalTime": new Date(Date.now() + 190106595.37051243),
    "price": 5063,
    "availableSeats": 102,
    "class": "First",
    "ticketType": "One-way",
    "duration": "6h 0m",
    "stops": 0,
    "rating": 4.7,
    "reviewCount": 951,
    "image": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.2579,
        "lng": 33.8116
      },
      "to": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-137",
    "departureCity": "London",
    "arrivalCity": "Istanbul",
    "countryFrom": "UK",
    "countryTo": "Turkey",
    "departureAirport": "LHR",
    "arrivalAirport": "IST",
    "departureTime": new Date(Date.now() + 696766669.3397454),
    "arrivalTime": new Date(Date.now() + 726166669.3397454),
    "price": 17808,
    "availableSeats": 22,
    "class": "First",
    "ticketType": "Round-trip",
    "duration": "8h 10m",
    "stops": 1,
    "rating": 3.6,
    "reviewCount": 254,
    "image": "https://images.unsplash.com/photo-1526958434771-460d37e6da80?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 51.5074,
        "lng": -0.1278
      },
      "to": {
        "lat": 41.0082,
        "lng": 28.9784
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-138",
    "departureCity": "Luxor",
    "arrivalCity": "London",
    "countryFrom": "Egypt",
    "countryTo": "UK",
    "departureAirport": "LXR",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 366036689.0559645),
    "arrivalTime": new Date(Date.now() + 370236689.0559645),
    "price": 15449,
    "availableSeats": 34,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "1h 10m",
    "stops": 0,
    "rating": 4.4,
    "reviewCount": 580,
    "image": "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-139",
    "departureCity": "Aswan",
    "arrivalCity": "Sharm El Sheikh",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "ASW",
    "arrivalAirport": "SSH",
    "departureTime": new Date(Date.now() + 1015212299.4699752),
    "arrivalTime": new Date(Date.now() + 1044012299.4699752),
    "price": 5609,
    "availableSeats": 107,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "8h 0m",
    "stops": 1,
    "rating": 3.8,
    "reviewCount": 549,
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 27.9158,
        "lng": 34.3299
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-140",
    "departureCity": "London",
    "arrivalCity": "Cairo",
    "countryFrom": "UK",
    "countryTo": "Egypt",
    "departureAirport": "LHR",
    "arrivalAirport": "CAI",
    "departureTime": new Date(Date.now() + 631169361.7935381),
    "arrivalTime": new Date(Date.now() + 640169361.7935381),
    "price": 46560,
    "availableSeats": 103,
    "class": "First",
    "ticketType": "Round-trip",
    "duration": "2h 30m",
    "stops": 0,
    "rating": 3.9,
    "reviewCount": 839,
    "image": "https://images.unsplash.com/photo-1553603227-2358aabe8eb8?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 51.5074,
        "lng": -0.1278
      },
      "to": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-141",
    "departureCity": "Sharm El Sheikh",
    "arrivalCity": "Cairo",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "SSH",
    "arrivalAirport": "CAI",
    "departureTime": new Date(Date.now() + 799469799.4861559),
    "arrivalTime": new Date(Date.now() + 821669799.4861559),
    "price": 4203,
    "availableSeats": 32,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "6h 10m",
    "stops": 1,
    "rating": 4.9,
    "reviewCount": 854,
    "image": "https://images.unsplash.com/photo-1553603227-2358aabe8eb8?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.9158,
        "lng": 34.3299
      },
      "to": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-142",
    "departureCity": "London",
    "arrivalCity": "Sharm El Sheikh",
    "countryFrom": "UK",
    "countryTo": "Egypt",
    "departureAirport": "LHR",
    "arrivalAirport": "SSH",
    "departureTime": new Date(Date.now() + 473347262.4055074),
    "arrivalTime": new Date(Date.now() + 487147262.4055074),
    "price": 13100,
    "availableSeats": 101,
    "class": "First",
    "ticketType": "One-way",
    "duration": "3h 50m",
    "stops": 0,
    "rating": 4.9,
    "reviewCount": 773,
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 51.5074,
        "lng": -0.1278
      },
      "to": {
        "lat": 27.9158,
        "lng": 34.3299
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-143",
    "departureCity": "Dubai",
    "arrivalCity": "Aswan",
    "countryFrom": "UAE",
    "countryTo": "Egypt",
    "departureAirport": "DXB",
    "arrivalAirport": "ASW",
    "departureTime": new Date(Date.now() + 1100150832.5513837),
    "arrivalTime": new Date(Date.now() + 1116950832.5513837),
    "price": 11870,
    "availableSeats": 20,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "4h 40m",
    "stops": 0,
    "rating": 4.2,
    "reviewCount": 160,
    "image": "https://images.unsplash.com/photo-1614725902096-7edbca2e0541?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.2048,
        "lng": 55.2708
      },
      "to": {
        "lat": 24.0889,
        "lng": 32.8998
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-144",
    "departureCity": "Sharm El Sheikh",
    "arrivalCity": "Paris",
    "countryFrom": "Egypt",
    "countryTo": "France",
    "departureAirport": "SSH",
    "arrivalAirport": "CDG",
    "departureTime": new Date(Date.now() + 616666018.6560279),
    "arrivalTime": new Date(Date.now() + 625666018.6560279),
    "price": 27033,
    "availableSeats": 93,
    "class": "First",
    "ticketType": "One-way",
    "duration": "2h 30m",
    "stops": 0,
    "rating": 3.9,
    "reviewCount": 519,
    "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 27.9158,
        "lng": 34.3299
      },
      "to": {
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-145",
    "departureCity": "Luxor",
    "arrivalCity": "Dubai",
    "countryFrom": "Egypt",
    "countryTo": "UAE",
    "departureAirport": "LXR",
    "arrivalAirport": "DXB",
    "departureTime": new Date(Date.now() + 976469998.322414),
    "arrivalTime": new Date(Date.now() + 1002269998.322414),
    "price": 20838,
    "availableSeats": 75,
    "class": "First",
    "ticketType": "One-way",
    "duration": "7h 10m",
    "stops": 0,
    "rating": 3.6,
    "reviewCount": 470,
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 25.2048,
        "lng": 55.2708
      }
    }
  },
  {
    "airline": "Lufthansa",
    "airlineLogo": "/assets/airlines/lufthansa.png",
    "flightNumber": "LU-146",
    "departureCity": "Cairo",
    "arrivalCity": "Paris",
    "countryFrom": "Egypt",
    "countryTo": "France",
    "departureAirport": "CAI",
    "arrivalAirport": "CDG",
    "departureTime": new Date(Date.now() + 1075900639.3209739),
    "arrivalTime": new Date(Date.now() + 1093900639.3209739),
    "price": 29556,
    "availableSeats": 60,
    "class": "Business",
    "ticketType": "Round-trip",
    "duration": "5h 0m",
    "stops": 1,
    "rating": 4.2,
    "reviewCount": 758,
    "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 30.0444,
        "lng": 31.2357
      },
      "to": {
        "lat": 48.8566,
        "lng": 2.3522
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-147",
    "departureCity": "Istanbul",
    "arrivalCity": "Luxor",
    "countryFrom": "Turkey",
    "countryTo": "Egypt",
    "departureAirport": "IST",
    "arrivalAirport": "LXR",
    "departureTime": new Date(Date.now() + 972180479.4076234),
    "arrivalTime": new Date(Date.now() + 1002180479.4076234),
    "price": 7859,
    "availableSeats": 45,
    "class": "Economy",
    "ticketType": "One-way",
    "duration": "8h 20m",
    "stops": 0,
    "rating": 4.6,
    "reviewCount": 394,
    "image": "https://images.unsplash.com/photo-1600520611035-85dd4e48b598?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 41.0082,
        "lng": 28.9784
      },
      "to": {
        "lat": 25.6872,
        "lng": 32.6396
      }
    }
  },
  {
    "airline": "EgyptAir",
    "airlineLogo": "/assets/airlines/egyptair.png",
    "flightNumber": "EG-148",
    "departureCity": "Dubai",
    "arrivalCity": "London",
    "countryFrom": "UAE",
    "countryTo": "UK",
    "departureAirport": "DXB",
    "arrivalAirport": "LHR",
    "departureTime": new Date(Date.now() + 977542226.4600052),
    "arrivalTime": new Date(Date.now() + 990742226.4600052),
    "price": 12395,
    "availableSeats": 45,
    "class": "First",
    "ticketType": "One-way",
    "duration": "3h 40m",
    "stops": 1,
    "rating": 4.2,
    "reviewCount": 668,
    "image": "https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.2048,
        "lng": 55.2708
      },
      "to": {
        "lat": 51.5074,
        "lng": -0.1278
      }
    }
  },
  {
    "airline": "Turkish Airlines",
    "airlineLogo": "/assets/airlines/turkish.png",
    "flightNumber": "TU-149",
    "departureCity": "Luxor",
    "arrivalCity": "Cairo",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "LXR",
    "arrivalAirport": "CAI",
    "departureTime": new Date(Date.now() + 412948073.4050254),
    "arrivalTime": new Date(Date.now() + 430948073.4050254),
    "price": 4001,
    "availableSeats": 75,
    "class": "Business",
    "ticketType": "One-way",
    "duration": "5h 0m",
    "stops": 0,
    "rating": 3.9,
    "reviewCount": 1020,
    "image": "https://images.unsplash.com/photo-1553603227-2358aabe8eb8?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 25.6872,
        "lng": 32.6396
      },
      "to": {
        "lat": 30.0444,
        "lng": 31.2357
      }
    }
  },
  {
    "airline": "Emirates",
    "airlineLogo": "/assets/airlines/emirates.png",
    "flightNumber": "EM-150",
    "departureCity": "Aswan",
    "arrivalCity": "Sharm El Sheikh",
    "countryFrom": "Egypt",
    "countryTo": "Egypt",
    "departureAirport": "ASW",
    "arrivalAirport": "SSH",
    "departureTime": new Date(Date.now() + 980466777.7201166),
    "arrivalTime": new Date(Date.now() + 993066777.7201166),
    "price": 5287,
    "availableSeats": 102,
    "class": "Economy",
    "ticketType": "Round-trip",
    "duration": "3h 30m",
    "stops": 0,
    "rating": 4.5,
    "reviewCount": 259,
    "image": "https://images.unsplash.com/photo-1512413912196-189f7831f2de?w=1600&q=80",
    "coordinates": {
      "from": {
        "lat": 24.0889,
        "lng": 32.8998
      },
      "to": {
        "lat": 27.9158,
        "lng": 34.3299
      }
    }
  }
];

const hotels = [
  {
    name: 'Burj Al Arab', city: 'Dubai', country: 'UAE', address: 'Jumeirah St, Dubai', pricePerNight: 1500, rating: 5.0, reviewCount: 1240,
    description: 'The iconic sail-shaped hotel, offering the absolute pinnacle of luxury with private butler service and a stunning terrace with pools.',
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'],
    amenities: ['Private Beach', 'Luxury Spa', 'Helipad', 'Personal Butler', 'WiFi', 'Pool'], location: { lat: 25.1412, lng: 55.1901 }
  },
  {
    name: 'The Savoy Elite', city: 'London', country: 'UK', address: 'Strand, London WC2R 0EZ', pricePerNight: 650, rating: 4.8, reviewCount: 520,
    description: 'Iconic luxury hotel offering an authentic British stay in the heart of London, featuring legendary service and elegant rooms.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'https://images.unsplash.com/photo-1551882547-ff40c0d12c56?w=800&q=80', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80'],
    amenities: ['Tea Room', 'Pool', 'Personal Butler', 'Fine Dining', 'Gym'], location: { lat: 51.5074, lng: -0.1278 }
  },
  {
    name: 'Le Meurice', city: 'Paris', country: 'France', address: '228 Rue de Rivoli, 75001', pricePerNight: 850, rating: 4.9, reviewCount: 410,
    description: 'A magical, serene Palace hotel steeped in art and rich historical design over looking the Louvre and Tuileries Garden.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028b12f63?w=800&q=80', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800&q=80'],
    amenities: ['Fine Dining', 'Luxury Spa', 'Wine Cellar', 'WiFi', 'Gym'], location: { lat: 48.8650, lng: 2.3283 }
  },
  {
    name: 'Aman Tokyo', city: 'Tokyo', country: 'Japan', address: '1-5-6 Otemachi, Chiyoda City', pricePerNight: 1100, rating: 5.0, reviewCount: 600,
    description: 'A serene sanctuary high above the vibrant city, blending traditional Japanese design with modern luxury.',
    images: ['https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
    amenities: ['Luxury Spa', 'Pool', 'Fine Dining', 'WiFi', 'Gym'], location: { lat: 35.6865, lng: 139.7645 }
  },
  {
    name: 'The Plaza', city: 'New York', country: 'USA', address: '768 5th Ave, NY 10019', pricePerNight: 750, rating: 4.7, reviewCount: 890,
    description: 'A quintessential New York luxury hotel located at the intersection of Central Park South and Fifth Avenue.',
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', 'https://images.unsplash.com/photo-1551882547-ff40c0d12c56?w=800&q=80', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800&q=80'],
    amenities: ['Gym', 'Luxury Spa', 'Tea Room', 'Personal Butler', 'WiFi'], location: { lat: 40.7644, lng: -73.9745 }
  },
  {
    name: 'Marriott Mena House', city: 'Cairo', country: 'Egypt', address: '6 Pyramids Road, Giza', pricePerNight: 350, rating: 4.8, reviewCount: 512,
    description: 'Historic luxury hotel offering rooms with direct, unobstructed views of the Great Pyramids and lush gardens.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'],
    amenities: ['Pool', 'Fine Dining', 'Luxury Spa', 'WiFi', 'Gym'], location: { lat: 29.9836, lng: 31.1309 }
  },
  {
    name: 'Raffles Singapore', city: 'Singapore', country: 'Singapore', address: '1 Beach Rd', pricePerNight: 900, rating: 4.9, reviewCount: 430,
    description: 'A colonial-style luxury hotel, famous for its lush gardens, iconic white facade, and the invention of the Singapore Sling.',
    images: ['https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028b12f63?w=800&q=80', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'],
    amenities: ['Pool', 'Luxury Spa', 'Fine Dining', 'Personal Butler', 'WiFi'], location: { lat: 1.2946, lng: 103.8533 }
  },
  {
    name: 'Hotel de Russie', city: 'Rome', country: 'Italy', address: 'Via del Babuino, 9', pricePerNight: 680, rating: 4.8, reviewCount: 375,
    description: 'An elegant luxury hotel known for its magnificent terraced courtyard and secret garden in the heart of Rome.',
    images: ['https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'https://images.unsplash.com/photo-1551882547-ff40c0d12c56?w=800&q=80'],
    amenities: ['Luxury Spa', 'Gym', 'WiFi', 'Fine Dining'], location: { lat: 41.9099, lng: 12.4764 }
  },
  {
    name: 'Beverly Hills Hotel', city: 'Los Angeles', country: 'USA', address: '9641 Sunset Blvd', pricePerNight: 950, rating: 4.9, reviewCount: 810,
    description: 'The iconic "Pink Palace" surrounded by lush tropical gardens, offering legendary glamour and service.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'],
    amenities: ['Pool', 'Luxury Spa', 'Fine Dining', 'WiFi', 'Gym'], location: { lat: 34.0815, lng: -118.4137 }
  },
  {
    name: 'Atlantis The Royal', city: 'Dubai', country: 'UAE', address: 'Crescent Road, The Palm', pricePerNight: 1200, rating: 4.9, reviewCount: 320,
    description: 'An architectural marvel offering ultra-luxury rooms, celebrity chef restaurants, and world-class entertainment.',
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
    amenities: ['Pool', 'Private Beach', 'Fine Dining', 'Luxury Spa', 'WiFi'], location: { lat: 25.1303, lng: 55.1166 }
  },
  {
    name: 'The Ritz, Paris', city: 'Paris', country: 'France', address: '15 Place Vendôme', pricePerNight: 1400, rating: 5.0, reviewCount: 750,
    description: 'Legendary opulence, immaculate service, and exquisite cuisine in the center of stylish Paris.',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c0d12c56?w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028b12f63?w=800&q=80', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800&q=80'],
    amenities: ['Pool', 'Luxury Spa', 'Wine Cellar', 'Fine Dining', 'WiFi'], location: { lat: 48.8683, lng: 2.3275 }
  },
  {
    name: 'Park Hyatt Sydney', city: 'Sydney', country: 'Australia', address: '7 Hickson Rd', pricePerNight: 850, rating: 4.8, reviewCount: 410,
    description: 'Unobstructed views of the Sydney Opera House and Harbour Bridge from this luxurious waterfront hotel.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
    amenities: ['Pool', 'Luxury Spa', 'Gym', 'WiFi', 'Fine Dining'], location: { lat: -33.8568, lng: 151.2100 }
  },
  {
    name: 'Four Seasons Kyoto', city: 'Kyoto', country: 'Japan', address: '445-3 Myohoin Maekawacho', pricePerNight: 1300, rating: 4.9, reviewCount: 280,
    description: 'A luxurious retreat centered around a massive 800-year-old pond garden, blending history with modern elegance.',
    images: ['https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800&q=80', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'],
    amenities: ['Luxury Spa', 'Pool', 'Fine Dining', 'WiFi', 'Gym'], location: { lat: 34.9904, lng: 135.7766 }
  },
  {
    name: 'Waldorf Astoria', city: 'Amsterdam', country: 'Netherlands', address: 'Herengracht 542', pricePerNight: 780, rating: 4.8, reviewCount: 390,
    description: 'Set across six 17th-century palaces on the Herengracht canal, offering aristocratic elegance and bespoke service.',
    images: ['https://images.unsplash.com/photo-1551882547-ff40c0d12c56?w=800&q=80', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
    amenities: ['Luxury Spa', 'Pool', 'Wine Cellar', 'WiFi', 'Gym'], location: { lat: 52.3644, lng: 4.8988 }
  },
  {
    name: 'The St. Regis', city: 'New York', country: 'USA', address: 'Two E 55th St', pricePerNight: 1050, rating: 4.8, reviewCount: 560,
    description: 'A timeless classic in Manhattan offering lavishly decorated rooms, legendary butler service, and exquisite dining.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1584132967334-10e028b12f63?w=800&q=80', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'],
    amenities: ['Personal Butler', 'Fine Dining', 'Gym', 'WiFi', 'Luxury Spa'], location: { lat: 40.7614, lng: -73.9745 }
  }
];

const cars = [
  { brand: 'Mercedes-Benz', model: 'S-Class', type: 'Luxury', pricePerDay: 250, seats: 5, transmission: 'Automatic', fuelType: 'Hybrid', city: 'Dubai', country: 'UAE', rating: 4.9, reviewCount: 120, location: { name: 'Dubai International Airport', lat: 25.2048, lng: 55.2708 }, images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'] },
  { brand: 'BMW', model: '7 Series', type: 'Luxury', pricePerDay: 230, seats: 5, transmission: 'Automatic', fuelType: 'Petrol', city: 'London', country: 'UK', rating: 4.8, reviewCount: 95, location: { name: 'Heathrow Airport Terminal 5', lat: 51.5074, lng: -0.1278 }, images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'] },
  { brand: 'Audi', model: 'Q8', type: 'SUV', pricePerDay: 180, seats: 5, transmission: 'Automatic', fuelType: 'Diesel', city: 'Paris', country: 'France', rating: 4.7, reviewCount: 150, location: { name: 'Charles de Gaulle Airport', lat: 48.8566, lng: 2.3522 }, images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bea?w=800&q=80'] },
  { brand: 'Toyota', model: 'Camry', type: 'Sedan', pricePerDay: 60, seats: 5, transmission: 'Automatic', fuelType: 'Hybrid', city: 'New York', country: 'USA', rating: 4.5, reviewCount: 430, location: { name: 'JFK International Airport', lat: 40.7128, lng: -74.0060 }, images: ['https://images.unsplash.com/photo-1621007947382-bb3c399b52c5?w=800&q=80'] },
  { brand: 'Honda', model: 'Civic', type: 'Economy', pricePerDay: 45, seats: 5, transmission: 'Automatic', fuelType: 'Petrol', city: 'Tokyo', country: 'Japan', rating: 4.6, reviewCount: 310, location: { name: 'Haneda Airport', lat: 35.6762, lng: 139.6503 }, images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80'] },
  { brand: 'Porsche', model: '911', type: 'Convertible', pricePerDay: 450, seats: 2, transmission: 'Automatic', fuelType: 'Petrol', city: 'Dubai', country: 'UAE', rating: 5.0, reviewCount: 85, location: { name: 'Dubai Marina Mall', lat: 25.2048, lng: 55.2708 }, images: ['https://images.unsplash.com/photo-1503376760367-13eea36663f7?w=800&q=80'] },
  { brand: 'Tesla', model: 'Model 3', type: 'Sedan', pricePerDay: 110, seats: 5, transmission: 'Automatic', fuelType: 'Electric', city: 'Los Angeles', country: 'USA', rating: 4.8, reviewCount: 220, location: { name: 'LAX International Airport', lat: 34.0522, lng: -118.2437 }, images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'] },
  { brand: 'Range Rover', model: 'Vogue', type: 'SUV', pricePerDay: 280, seats: 5, transmission: 'Automatic', fuelType: 'Diesel', city: 'London', country: 'UK', rating: 4.9, reviewCount: 140, location: { name: 'Gatwick Airport', lat: 51.5074, lng: -0.1278 }, images: ['https://images.unsplash.com/photo-1606016159991-efaefe6dc37b?w=800&q=80'] },
  { brand: 'Volkswagen', model: 'Golf', type: 'Economy', pricePerDay: 50, seats: 5, transmission: 'Manual', fuelType: 'Petrol', city: 'Rome', country: 'Italy', rating: 4.4, reviewCount: 560, location: { name: 'Fiumicino Airport', lat: 41.9028, lng: 12.4964 }, images: ['https://images.unsplash.com/photo-1541348263662-e068362d490a?w=800&q=80'] },
  { brand: 'Mercedes-Benz', model: 'G-Class', type: 'SUV', pricePerDay: 350, seats: 5, transmission: 'Automatic', fuelType: 'Petrol', city: 'Dubai', country: 'UAE', rating: 4.9, reviewCount: 190, location: { name: 'Burj Khalifa Valet', lat: 25.2048, lng: 55.2708 }, images: ['https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80'] }
];

const journals = [
  {
    title: 'The Timeless Majesty of the Pyramids of Giza',
    summary: 'Discover the ancient wonders of Egypt and unravel the mysteries of the pharaohs at the last standing wonder of the ancient world.',
    content: 'The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex bordering present-day Giza in Greater Cairo, Egypt. It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80',
    country: 'Egypt',
    city: 'Giza',
    category: 'History',
    author: 'Ahmed Hassan',
    readTime: '6 min read',
    featured: true,
    history: 'Built around 2560 BC, the Great Pyramid was the tomb of Pharaoh Khufu. It was the tallest man-made structure in the world for over 3,800 years.',
    whyFamous: 'It is the only surviving structure of the original Seven Wonders of the Ancient World.',
    bestTime: 'October to April when temperatures are cooler and more pleasant for outdoor exploration.',
    ticketPrices: 'Around $10-15 USD for general admission, extra for entering inside the pyramids.',
    travelTips: ['Wear comfortable walking shoes', 'Stay hydrated', 'Hire an official guide'],
    nearbyAttractions: [{ name: 'The Great Sphinx', description: 'Legendary limestone statue with a lion body and human head.' }, { name: 'Solar Boat Museum', description: 'Houses a reconstructed ancient Egyptian ship.' }],
    safetyTips: ['Beware of unofficial guides or aggressive vendors', 'Protect yourself from the sun'],
    localCulture: 'Egyptians are known for their hospitality. Tipping (baksheesh) is a common practice for good service.'
  },
  {
    title: 'A Romantic Escape to the Eiffel Tower',
    summary: 'Experience the magic of Paris at its most iconic landmark, offering breathtaking views and unforgettable memories.',
    content: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower as the centerpiece of the 1889 World\'s Fair.',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&q=80',
    country: 'France',
    city: 'Paris',
    category: 'Culture',
    author: 'Marie Dubois',
    readTime: '5 min read',
    featured: true,
    history: 'Constructed from 1887 to 1889 as the entrance to the 1889 World\'s Fair, it was initially criticized by some of France\'s leading artists and intellectuals but has become a global cultural icon of France.',
    whyFamous: 'A symbol of love and one of the most recognizable structures in the world.',
    bestTime: 'May, June, September, and October for good weather and fewer crowds.',
    ticketPrices: 'Ranges from €11.30 to €28.30 depending on how high you go and if you take the stairs or elevator.',
    travelTips: ['Book tickets in advance online to skip the lines', 'Visit at sunset for spectacular views'],
    nearbyAttractions: [{ name: 'Seine River Cruise', description: 'Taking a boat ride at night is magical.' }, { name: 'Trocadéro', description: 'Offers the best view of the Eiffel Tower.' }],
    safetyTips: ['Watch out for pickpockets in crowded areas', 'Be wary of street vendors selling cheap souvenirs'],
    localCulture: 'A polite "Bonjour" goes a long way when interacting with locals.'
  },
  {
    title: 'Gladiators and Glory: The Colosseum',
    summary: 'Step back in time to the Roman Empire and feel the echo of epic battles at the iconic Colosseum.',
    content: 'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built, and is still the largest standing amphitheatre in the world today.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    country: 'Italy',
    city: 'Rome',
    category: 'History',
    author: 'Giovanni Rossi',
    readTime: '7 min read',
    featured: false,
    history: 'Built under the emperors of the Flavian dynasty, construction began in 72 AD under Vespasian and was completed in 80 AD under his successor and heir, Titus.',
    whyFamous: 'Famous for its magnificent architecture and brutal gladiatorial games.',
    bestTime: 'Spring (April to June) and Fall (September and October).',
    ticketPrices: 'Around €16 for a standard adult ticket, which also includes the Roman Forum and Palatine Hill.',
    travelTips: ['Buy a Roma Pass for free and reduced entry', 'Wear comfortable shoes for walking on cobblestones'],
    nearbyAttractions: [{ name: 'Roman Forum', description: 'The ancient heart of Rome.' }, { name: 'Palatine Hill', description: 'One of the most ancient parts of the city.' }],
    safetyTips: ['Keep an eye on your belongings', 'Avoid eating at tourist trap restaurants right next to the site'],
    localCulture: 'When in Rome, enjoy a leisurely meal and don\'t rush the dining experience.'
  },
  {
    title: 'Touching the Sky: Burj Khalifa',
    summary: 'Experience extreme luxury and unparalleled views from the tallest building in the world.',
    content: 'The Burj Khalifa is a skyscraper in Dubai, United Arab Emirates. With a total height of 829.8 m (2,722 ft), it has been the tallest structure and building in the world since its topping out in 2009.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    country: 'UAE',
    city: 'Dubai',
    category: 'Luxury',
    author: 'Layla Al-Fayed',
    readTime: '4 min read',
    featured: true,
    history: 'Construction began in 2004, with the exterior completed five years later in 2009. The primary structure is reinforced concrete.',
    whyFamous: 'It holds the record for the tallest building in the world.',
    bestTime: 'November to March for the best weather in Dubai.',
    ticketPrices: 'Starting at around AED 169 (approx. $46 USD), prices vary based on the observation deck level and time of day.',
    travelTips: ['Book tickets weeks in advance', 'Combine your visit with the Dubai Fountain show'],
    nearbyAttractions: [{ name: 'The Dubai Mall', description: 'One of the world\'s largest shopping malls.' }, { name: 'The Dubai Fountain', description: 'Choreographed water fountain show.' }],
    safetyTips: ['Stay hydrated in the heat', 'Respect local customs regarding clothing in public spaces'],
    localCulture: 'Dress modestly when outside of tourist resorts, and respect local traditions and Islamic values.'
  },
  {
    title: 'Walking the Dragon: The Great Wall of China',
    summary: 'Embark on an epic adventure along one of the most impressive architectural feats in human history.',
    content: 'The Great Wall of China is a series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against various nomadic groups from the Eurasian Steppe.',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&q=80',
    country: 'China',
    city: 'Beijing',
    category: 'Adventure',
    author: 'Wei Chen',
    readTime: '8 min read',
    featured: false,
    history: 'Different sections were built by various dynasties over centuries, with the most famous sections built during the Ming dynasty (1368–1644).',
    whyFamous: 'It is the longest wall in the world and an awe-inspiring feat of ancient defensive architecture.',
    bestTime: 'Spring (April and May) or Autumn (September and October) for comfortable weather and clear views.',
    ticketPrices: 'Around 40-45 RMB (approx. $6-7 USD) depending on the section.',
    travelTips: ['The Mutianyu section is great for fewer crowds', 'Bring water and snacks'],
    nearbyAttractions: [{ name: 'Forbidden City', description: 'Former Chinese imperial palace in Beijing.' }, { name: 'Temple of Heaven', description: 'Imperial complex of religious buildings.' }],
    safetyTips: ['Be prepared for steep and uneven stairs', 'Check weather conditions before going'],
    localCulture: 'Respect the monument; do not leave trash or take bricks as souvenirs.'
  },
  {
    title: 'The Crossroads of the World: Times Square',
    summary: 'Dive into the neon-lit heart of New York City, where the energy is palpable and the city never sleeps.',
    content: 'Times Square is a major commercial intersection, tourist destination, entertainment center, and neighborhood in the Midtown Manhattan section of New York City, at the junction of Broadway and Seventh Avenue.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
    country: 'USA',
    city: 'New York',
    category: 'Culture',
    author: 'Sarah Johnson',
    readTime: '5 min read',
    featured: false,
    history: 'Formerly Longacre Square, it was renamed in 1904 after The New York Times moved its headquarters to the newly erected Times Building.',
    whyFamous: 'Famous for its bright lights, Broadway shows, and massive New Year\'s Eve ball drop.',
    bestTime: 'Anytime, but late at night is when the neon lights are most impactful.',
    ticketPrices: 'Free to visit, but Broadway shows and nearby attractions cost money.',
    travelTips: ['Walk fast and don\'t block the sidewalks', 'Buy discount Broadway tickets at the TKTS booth'],
    nearbyAttractions: [{ name: 'Broadway Theaters', description: 'World-renowned theatrical performances.' }, { name: 'Bryant Park', description: 'A beautiful public park just a few blocks away.' }],
    safetyTips: ['Be aware of your surroundings in dense crowds', 'Ignore individuals offering unsolicited "free" CDs or photos with costumed characters'],
    localCulture: 'New Yorkers are fast-paced; keep moving on the sidewalks and stand to the right on escalators.'
  }
];

const hotelReviewsSource = [
    { username: "Sophie M.", avatar: "SM", rating: 5, date: "April 2025", comment: "Amazing location and very luxurious rooms. Staff were extremely helpful and attentive." },
    { username: "James T.", avatar: "JT", rating: 4, date: "March 2025", comment: "Perfect stay in the heart of the city. Breakfast was excellent, but the wifi was a bit slow." },
    { username: "Isabella L.", avatar: "IL", rating: 5, date: "February 2025", comment: "A bit expensive but worth every penny. The spa services were out of this world." },
    { username: "Mark R.", avatar: "MR", rating: 3, date: "January 2025", comment: "Beautiful property but service at the restaurant could have been faster." },
    { username: "Elena V.", avatar: "EV", rating: 5, date: "March 2025", comment: "We celebrated our anniversary here and they upgraded our room. Unforgettable experience!" },
    { username: "David K.", avatar: "DK", rating: 4, date: "April 2025", comment: "Very clean, comfortable beds, and the concierge was incredibly knowledgeable." },
    { username: "Aisha N.", avatar: "AN", rating: 5, date: "December 2024", comment: "Absolutely flawless. Will be staying here again next time we visit." },
    { username: "Tom B.", avatar: "TB", rating: 4, date: "February 2025", comment: "Great location for sightseeing. The room decor was a bit dated, though." }
];

const flightReviewsSource = [
    { username: "Ahmed K.", avatar: "AK", rating: 4, date: "February 2025", comment: "Smooth flight, crew was friendly. Slight delay on boarding but overall good experience." },
    { username: "Layla R.", avatar: "LR", rating: 5, date: "January 2025", comment: "Loved the legroom in Economy Elite. Will definitely book again!" },
    { username: "Omar S.", avatar: "OS", rating: 3, date: "March 2025", comment: "Average experience. Food could be better but the price was fair." },
    { username: "John D.", avatar: "JD", rating: 4, date: "December 2024", comment: "Good service and on-time arrival. Check-in was a breeze." },
    { username: "Sarah M.", avatar: "SM", rating: 5, date: "February 2025", comment: "Exceptional service from start to finish. The in-flight entertainment was great." }
];

const generateReviews = (type: string) => {
  const source = type === 'hotel' ? hotelReviewsSource : flightReviewsSource;
  const shuffled = source.sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 reviews
  return shuffled.slice(0, count);
};

const flightItems = flights.map(f => {
  const reviews = generateReviews('flight');
  const avgRating = Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
  return { ...f, generatedReviews: reviews, rating: avgRating, reviewCount: reviews.length + Math.floor(Math.random() * 200) + 50 };
});

const hotelItems = hotels.map(h => {
  const reviews = generateReviews('hotel');
  const avgRating = Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
  return { ...h, generatedReviews: reviews, rating: avgRating, reviewCount: reviews.length + Math.floor(Math.random() * 500) + 100 };
});

const seedDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined');
    uri = uri.trim().replace(/^["'](.+)["']$/, '$1');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    await Flight.deleteMany();
    await Hotel.deleteMany();
    await Car.deleteMany();
    await Journal.deleteMany();
    await Review.deleteMany();

    const insertedFlights = await Flight.insertMany(flightItems);
    const insertedHotels = await Hotel.insertMany(hotelItems);
    await Car.insertMany(cars);
    await Journal.insertMany(journals);

    // Seed reviews
    const reviewDocs: any[] = [];
    insertedFlights.forEach((f: any, i) => {
       flightItems[i].generatedReviews.forEach(r => {
           reviewDocs.push({
               targetType: 'flight',
               targetId: f._id,
               userName: r.username,
               userAvatar: r.avatar,
               rating: r.rating,
               comment: r.comment,
               createdAt: new Date(r.date)
           });
       });
    });

    // We will collect room documents to insert
    const roomDocs: any[] = [];
    const hotelUpdates: Promise<any>[] = [];

    insertedHotels.forEach((h: any, i) => {
       // Create dummy rooms for each hotel
       const room1Id = new mongoose.Types.ObjectId();
       const room2Id = new mongoose.Types.ObjectId();

       roomDocs.push({
           _id: room1Id,
           hotelId: h._id,
           name: "Deluxe Single Room",
           type: "single",
           capacity: { maxAdults: 1, maxChildren: 1, maxTotalGuests: 2 },
           pricing: { pricePerNight: h.pricePerNight * 0.8, extraAdultPrice: 0, childPrice: h.pricePerNight * 0.2 },
           inventory: { totalRooms: 10, availableRooms: 10 },
           features: ["City View", "Free WiFi"],
           adjacency: { allowAdjacent: true, maxAdjacentRooms: 2 }
       });

       roomDocs.push({
           _id: room2Id,
           hotelId: h._id,
           name: "Luxury Double Suite",
           type: "double",
           capacity: { maxAdults: 2, maxChildren: 2, maxTotalGuests: 4 },
           pricing: { pricePerNight: h.pricePerNight, extraAdultPrice: h.pricePerNight * 0.3, childPrice: h.pricePerNight * 0.1 },
           inventory: { totalRooms: 5, availableRooms: 5 },
           features: ["Sea View", "Balcony", "Mini Bar"],
           adjacency: { allowAdjacent: false, maxAdjacentRooms: 0 }
       });

       hotelUpdates.push(Hotel.updateOne({ _id: h._id }, { $push: { rooms: { $each: [room1Id, room2Id] } } }));

       hotelItems[i].generatedReviews.forEach(r => {
           reviewDocs.push({
               targetType: 'hotel',
               targetId: h._id,
               userName: r.username,
               userAvatar: r.avatar,
               rating: r.rating,
               comment: r.comment,
               createdAt: new Date(r.date)
           });
       });
    });

    if (roomDocs.length > 0) {
        // Also import Room model in the seed script or resolve it
        const { Room } = await import('./models/Room.js');
        await Room.deleteMany({});
        await Room.insertMany(roomDocs);
        await Promise.all(hotelUpdates);
        console.log(`Added ${roomDocs.length} rooms to hotels.`);
    }

    if (reviewDocs.length > 0) {
        await Review.insertMany(reviewDocs);
    }

    console.log(`Data Seeded Successfully! Added ${reviewDocs.length} reviews.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
