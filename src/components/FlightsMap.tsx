import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix typical Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Cities
const createCityIcon = (name: string, isHighlighted: boolean) => {
  return L.divIcon({
    className: 'custom-city-marker',
    html: `
      <div style="
        background-color: ${isHighlighted ? '#000' : '#fff'};
        color: ${isHighlighted ? '#fff' : '#000'};
        border: 2px solid ${isHighlighted ? '#000' : '#ccc'};
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 800;
        font-size: 10px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        text-transform: uppercase;
      ">
        ${name}
      </div>
    `,
    iconAnchor: [0, 0], // Anchor at center bottom (handled by transform in html)
  });
};

interface FlightsMapProps {
  cities: { name: string; lat: number; lng: number }[];
  activeFlight: any | null; // A flight object holding departure/arrival coordinates
  onCityClick: (cityName: string) => void;
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

const MapController = ({
  cities,
  activeFlight
}: {
  cities: { name: string; lat: number; lng: number }[];
  activeFlight: any | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (activeFlight) {
      const dep = cities.find(c => c.name === activeFlight.departureCity);
      const arr = cities.find(c => c.name === activeFlight.arrivalCity);
      
      if (dep && arr) {
        const bounds = L.latLngBounds([dep.lat, dep.lng], [arr.lat, arr.lng]);
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 5, duration: 1.5 });
      } else if (dep) {
        map.flyTo([dep.lat, dep.lng], 5, { animate: true, duration: 1.5 });
      }
    } else if (cities.length > 0) {
      const bounds = L.latLngBounds(cities.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });
    }
  }, [activeFlight, cities, map]);

  return null;
};

export const FlightsMap: React.FC<FlightsMapProps> = ({ cities, activeFlight, onCityClick }) => {
  if (cities.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 border-r border-border">
        <MapPin className="text-muted-foreground/30 w-12 h-12 mb-4" />
        <p className="text-muted-foreground italic text-sm font-bold tracking-widest uppercase">No mapping data available</p>
      </div>
    );
  }

  const defaultCenter: [number, number] = [26.8206, 30.8025]; 
  
  const depCity = activeFlight ? cities.find(c => c.name === activeFlight.departureCity) : null;
  const arrCity = activeFlight ? cities.find(c => c.name === activeFlight.arrivalCity) : null;

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {cities.map((city) => {
          const isHighlighted = (depCity && depCity.name === city.name) || (arrCity && arrCity.name === city.name);
          return (
            <Marker
              key={city.name}
              position={[city.lat, city.lng]}
              icon={createCityIcon(city.name, !!isHighlighted)}
              eventHandlers={{
                click: () => onCityClick(city.name),
              }}
            >
              <Popup className="font-bold text-center">
                <div className="uppercase tracking-wider text-xs mb-1">{city.name}</div>
                <Button size="sm" variant="ghost" className="h-6 text-[10px] uppercase font-black tracking-widest text-primary w-full" onClick={() => onCityClick(city.name)}>View Flights</Button>
              </Popup>
            </Marker>
          );
        })}

        {depCity && arrCity && (
          <Polyline 
            positions={[
              [depCity.lat, depCity.lng],
              [arrCity.lat, arrCity.lng]
            ]}
            color="#000"
            weight={3}
            dashArray="10, 10"
            opacity={0.6}
          />
        )}
        
        <MapController cities={cities} activeFlight={activeFlight} />
        <MapResizer />
      </MapContainer>
    </div>
  );
};
