import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { SafeImage } from './SafeImage';
import { calculateHotelPrice } from '../lib/hotelPricing';

// Fix typical Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for active/inactive state
const createCustomIcon = (isActive: boolean, price: string) => {
  return L.divIcon({
    className: 'custom-hotel-marker',
    html: `
      <div style="
        background-color: ${isActive ? '#000' : '#fff'};
        color: ${isActive ? '#fff' : '#000'};
        border: 2px solid ${isActive ? '#000' : '#e5e7eb'};
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 12px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        transform: translate(-50%, -100%);
      ">
        ${price}
      </div>
    `,
    iconAnchor: [0, 0], // Anchor at center bottom (handled by transform in html)
  });
};

interface HotelsMapProps {
  hotels: any[];
  activeHotelId: string | null;
  onMarkerClick: (hotelId: string) => void;
  pricingConfig?: {
    nights: number;
    rooms: any[];
    guests: number;
  };
}

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    const container = map.getContainer();
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [map]);
  return null;
};

// Component to handle map bounds and flying to location
const MapController = ({
  hotels,
  activeHotelId
}: {
  hotels: any[];
  activeHotelId: string | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (hotels.length === 0) return;
    
    // Create a bounding box from all hotels
    const bounds = L.latLngBounds(hotels.map(h => [h.location.lat, h.location.lng]));
    
    // Fit the map to the bounds
    if (activeHotelId) {
      const activeItem = hotels.find(h => h._id === activeHotelId);
      if (activeItem) {
        map.flyTo([activeItem.location.lat, activeItem.location.lng], 14, {
          animate: true,
          duration: 1.5,
        });
        return;
      }
    }

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [hotels, map, activeHotelId]);

  return null;
};

export const HotelsMap: React.FC<HotelsMapProps> = ({ hotels, activeHotelId, onMarkerClick, pricingConfig }) => {
  const { formatPrice } = useCurrency();

  // Filter out hotels without valid coordinates
  const validHotels = hotels.filter(h => 
    h.location && 
    typeof h.location.lat === 'number' && 
    typeof h.location.lng === 'number' &&
    !isNaN(h.location.lat) && 
    !isNaN(h.location.lng)
  );

  if (validHotels.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 border-r border-border">
        <MapPin className="text-muted-foreground/30 w-12 h-12 mb-4" />
        <p className="text-muted-foreground italic text-sm font-bold tracking-widest uppercase">No mapping data available</p>
      </div>
    );
  }

  // Default center (Egypt)
  const defaultCenter: [number, number] = [26.8206, 30.8025]; 

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={6} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {validHotels.map((hotel) => {
          const isActive = activeHotelId === hotel._id;
          
          let displayPrice = 0;
          let label = '/ night';

          if (pricingConfig) {
             const { grandTotal: finalPrice } = calculateHotelPrice({
               basePrice: hotel.pricePerNight,
               nights: pricingConfig.nights,
               rooms: pricingConfig.rooms,
               category: hotel.category?.toLowerCase() || 'standard'
             });
             displayPrice = finalPrice;
             label = `/ ${pricingConfig.nights} night${pricingConfig.nights !== 1 ? 's' : ''}`;
          } else {
             displayPrice = hotel.pricePerNight;
          }

          return (
            <Marker
              key={hotel._id}
              position={[hotel.location.lat, hotel.location.lng]}
              icon={createCustomIcon(isActive, formatPrice(displayPrice))}
              eventHandlers={{
                click: () => onMarkerClick(hotel._id),
              }}
            >
              <Popup className="hotel-custom-popup" closeButton={false}>
                <div className="w-[200px] overflow-hidden rounded-xl bg-card border-none shadow-none m-0 p-0">
                  <div className="relative h-[120px] w-full">
                    <img 
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Star size={10} fill="currentColor" className="text-yellow-400" />
                        {hotel.rating?.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-black text-sm uppercase italic tracking-tight line-clamp-1">{hotel.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 mb-2">
                      {hotel.city}, {hotel.country}
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                      <span className="font-black text-sm text-primary">{formatPrice(displayPrice)}</span>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">{label}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapController hotels={validHotels} activeHotelId={activeHotelId} />
        <MapResizer />
      </MapContainer>
    </div>
  );
};
