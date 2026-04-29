const usedImages = new Set<string>();

export const getFlightImage = (city: string, dbImage?: string, flightId?: string) => {
  if (dbImage) return dbImage;

  const images: Record<string, string[]> = {
    'Cairo': [
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80',
      'https://images.unsplash.com/photo-1553603227-2358aabe8eb8?w=800&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
      'https://images.unsplash.com/photo-1600023605330-80de14ea2f6e?w=800&q=80'
    ],
    'Luxor': [
      'https://images.unsplash.com/photo-1698228399564-969c6fc965f5?w=800&q=80',
      'https://images.unsplash.com/photo-1600520611035-85dd4e48b598?w=800&q=80',
      'https://images.unsplash.com/photo-1596733471018-8d4e9a31a5dc?w=800&q=80',
      'https://images.unsplash.com/photo-1572251347078-45e39660ad5c?w=800&q=80'
    ],
    'Aswan': [
      'https://images.unsplash.com/photo-1549479361-b54b0e8b1b22?w=800&q=80',
      'https://images.unsplash.com/photo-1574163935100-c9772bf220ca?w=800&q=80',
      'https://images.unsplash.com/photo-1614725902096-7edbca2e0541?w=800&q=80'
    ],
    'Sharm El Sheikh': [
      'https://images.unsplash.com/photo-1512413912196-189f7831f2de?w=800&q=80',
      'https://images.unsplash.com/photo-1571165213459-71c1bd56fa06?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
    ],
    'Hurghada': [
      'https://images.unsplash.com/photo-1588691520147-386b033e6f96?w=800&q=80',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80',
      'https://images.unsplash.com/photo-1544158652-fef1bc3c92ce?w=800&q=80',
      'https://images.unsplash.com/photo-1590408544464-9665bc7bdfec?w=800&q=80'
    ],
    'Paris': [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=800&q=80'
    ],
    'Dubai': [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'https://images.unsplash.com/photo-1582672060624-ac926d117047?w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
      'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=800&q=80'
    ],
    'Istanbul': [
      'https://images.unsplash.com/photo-1522083115456-fce117400ac5?w=800&q=80',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
      'https://images.unsplash.com/photo-1526958434771-460d37e6da80?w=800&q=80'
    ],
    'London': [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80',
      'https://images.unsplash.com/photo-1505761671135-6385cb07567a?w=800&q=80'
    ],
    'Rome': [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      'https://images.unsplash.com/photo-1531572753322-ad011cfce063?w=800&q=80',
      'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800&q=80'
    ],
    'New York': [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
      'https://images.unsplash.com/photo-1500916434205-0c77489c6211?w=800&q=80'
    ],
    'Tokyo': [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80'
    ]
  };
  
  // Clear the Set if it gets too large to avoid memory leaks
  if (usedImages.size > 200) usedImages.clear();

  if (images[city] && images[city].length > 0) {
    const cityImages = images[city];
    const available = cityImages.filter(img => !usedImages.has(img));

    let selected: string;
    if (available.length > 0) {
       // Prefer unused images
       // use flightId to make it stable across re-renders if possible
       let index = 0;
       if (flightId) {
         let hash = 0;
         for (let i = 0; i < flightId.length; i++) hash = ((hash << 5) - hash) + flightId.charCodeAt(i);
         index = Math.abs(hash) % available.length;
       } else {
         index = Math.floor(Math.random() * available.length);
       }
       selected = available[index];
    } else {
       // all used, just pick one based on flightId or random
       if (flightId) {
         let hash = 0;
         for (let i = 0; i < flightId.length; i++) hash = ((hash << 5) - hash) + flightId.charCodeAt(i);
         selected = cityImages[Math.abs(hash) % cityImages.length];
       } else {
         selected = cityImages[Math.floor(Math.random() * cityImages.length)];
       }
    }
    
    usedImages.add(selected);
    return selected;
  }
  
  // Skip dbImage to prevent hotel images from leaking into flight images
  const fallbacks = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109ce05?w=800&q=80',
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80',
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&q=80'
  ];
  
  const availableFallbacks = fallbacks.filter(img => !usedImages.has(img));
  let fallbackSelected: string;
  if(availableFallbacks.length > 0) {
    fallbackSelected = flightId ? availableFallbacks[Math.abs(flightId.charCodeAt(0)) % availableFallbacks.length] : availableFallbacks[Math.floor(Math.random() * availableFallbacks.length)];
  } else {
    fallbackSelected = flightId ? fallbacks[Math.abs(flightId.charCodeAt(0)) % fallbacks.length] : fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
  
  usedImages.add(fallbackSelected);
  return fallbackSelected;
};

export const getCarImage = (brand: string, model: string, dbImage?: string) => {
  const fallbacks = [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // generic sports car
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', // generic sedan
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // generic performance car
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', // generic car
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'  // generic suv/crossover
  ];
  return fallbacks[Math.abs(brand.charCodeAt(0) + model.charCodeAt(0)) % fallbacks.length];
};
