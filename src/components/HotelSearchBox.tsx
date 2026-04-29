import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Search, Users, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DatePicker } from './DatePicker';
import { cn } from '@/lib/utils';

function FieldBlock({ icon: Icon, label, children, className, onClick }: any) {
  return (
    <div 
      className={cn(
        "relative flex items-center h-[72px] bg-muted/50 dark:bg-[#111111] rounded-[16px] hover:bg-muted dark:hover:bg-[#1a1a1a] border border-border/50 dark:border-transparent transition-all focus-within:ring-2 focus-within:ring-primary/80 group overflow-hidden cursor-pointer w-full text-left",
        className
      )}
      onClick={onClick}
    >
      <div className="pl-5 pr-3 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none flex items-center justify-center shrink-0">
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col justify-center flex-1 h-full py-2 pr-4 relative min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none mb-0.5 mt-0.5 pointer-events-none block">
          {label}
        </span>
        <div className="flex-1 w-full flex items-center text-foreground min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export function HotelSearchBox() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [location, setLocation] = useState(() => {
    const saved = sessionStorage.getItem('hotelSearch');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.location || '';
      } catch (e) {}
    }
    return '';
  });
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(() => {
    const saved = sessionStorage.getItem('hotelSearch');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.checkIn) return new Date(parsed.checkIn);
      } catch (e) {}
    }
    return undefined;
  });

  const [checkOut, setCheckOut] = useState<Date | undefined>(() => {
    const saved = sessionStorage.getItem('hotelSearch');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.checkOut) return new Date(parsed.checkOut);
      } catch (e) {}
    }
    return undefined;
  });

  const [rooms, setRooms] = useState<any[]>(() => {
    const saved = sessionStorage.getItem('hotelSearch');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.rooms) return parsed.rooms;
      } catch (e) {}
    }
    return [{ adults: 1, children: 0 }];
  });

  const [openGuests, setOpenGuests] = useState(false);

  const addRoom = () => {
    if (rooms.length < 5) {
      setRooms([...rooms, { adults: 1, children: 0 }]);
    }
  };

  const removeRoom = (idx: number) => {
    const arr = [...rooms];
    arr.splice(idx, 1);
    setRooms(arr);
  };

  const updateRoom = (idx: number, field: string, val: number) => {
    const arr = [...rooms];
    arr[idx][field] = val;
    setRooms(arr);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn.toISOString().split('T')[0]);
    if (checkOut) params.append('checkOut', checkOut.toISOString().split('T')[0]);
    params.append('rooms', JSON.stringify(rooms));

    sessionStorage.setItem('hotelSearch', JSON.stringify({
      location,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      rooms,
      totalGuests: rooms.reduce((acc, r) => acc + (r.adults || 0) + (r.children || 0), 0)
    }));
    
    navigate(`/hotels?${params.toString()}`);
  };

  const totalGuests = rooms.reduce((acc, r) => acc + r.adults + r.children, 0);

  return (
    <div className="bg-card p-2 sm:p-3 pb-3 sm:pb-3 rounded-[24px] sm:rounded-[28px] max-w-6xl mx-auto border border-border/50 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 w-full">
        <FieldBlock icon={MapPin} label="Location" className="lg:w-[32%] z-10">
          <input 
            type="text"
            placeholder="Where to?" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent border-none p-0 h-auto text-base sm:text-lg font-bold text-foreground outline-none focus:ring-0 placeholder:text-muted-foreground truncate placeholder:font-normal"
          />
        </FieldBlock>

        <div className="flex flex-row lg:w-[33%] gap-2 sm:gap-3">
          <FieldBlock icon={Calendar} label="Check-in" className="w-1/2">
            <DatePicker 
              date={checkIn}
              setDate={setCheckIn}
              minDate={new Date()}
              hideIcon
              placeholder="Add Date"
              inputClassName="w-full bg-transparent border-none p-0 h-auto text-base sm:text-lg font-bold text-foreground outline-none ring-0 focus:ring-0 text-left placeholder:text-muted-foreground truncate placeholder:font-normal hover:bg-transparent"
            />
          </FieldBlock>
          
          <FieldBlock icon={Calendar} label="Check-out" className="w-1/2">
            <DatePicker 
              date={checkOut}
              setDate={setCheckOut}
              minDate={checkIn || new Date()}
              hideIcon
              placeholder="Add Date"
              inputClassName="w-full bg-transparent border-none p-0 h-auto text-base sm:text-lg font-bold text-foreground outline-none ring-0 focus:ring-0 text-left placeholder:text-muted-foreground truncate placeholder:font-normal hover:bg-transparent"
            />
          </FieldBlock>
        </div>

        <Popover open={openGuests} onOpenChange={setOpenGuests}>
          <PopoverTrigger 
            render={
              <button className="w-full lg:w-[25%] appearance-none rounded-[16px] outline-none text-left" />
            }
          >
            <FieldBlock icon={Users} label="Guests & Rooms">
              <div className="text-foreground text-base sm:text-lg font-bold w-full truncate">
                {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}, {rooms.length} Room{rooms.length !== 1 ? 's' : ''}
              </div>
            </FieldBlock>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-4 rounded-[24px] shadow-2xl border-border" align="end" sideOffset={10}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {rooms.map((room, idx) => {
                const maxTotal = 4;
                const currentTotal = room.adults + room.children;
                const canAddTotal = currentTotal < maxTotal;

                return (
                  <div key={idx} className="pb-5 border-b border-border/50 last:border-0 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-black uppercase tracking-widest text-sm">Room {idx + 1}</h4>
                      {rooms.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => removeRoom(idx)}>
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                    
                    {currentTotal >= maxTotal && (
                      <p className="text-[10px] text-destructive font-bold uppercase tracking-widest mb-3">Max capacity reached</p>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[15px] font-bold">Adults</p>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-widest">Ages 13+</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-full border-border/50" 
                            disabled={room.adults <= 1}
                            onClick={() => updateRoom(idx, 'adults', room.adults - 1)}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="w-5 text-center font-bold text-lg">{room.adults}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-full border-border/50" 
                            disabled={!canAddTotal || room.adults >= 4} 
                            onClick={() => updateRoom(idx, 'adults', room.adults + 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[15px] font-bold">Children</p>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-widest">Ages 0-12</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-full border-border/50" 
                            disabled={room.children <= 0}
                            onClick={() => updateRoom(idx, 'children', room.children - 1)}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="w-5 text-center font-bold text-lg">{room.children}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-full border-border/50" 
                            disabled={!canAddTotal || room.children >= 3}
                            onClick={() => updateRoom(idx, 'children', room.children + 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {rooms.length < 5 && (
                <Button variant="outline" className="w-full font-bold uppercase tracking-widest text-xs h-12 rounded-[16px] border-dashed hover:bg-muted/50" onClick={addRoom}>
                  <Plus size={16} className="mr-2" /> Add Room
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          className="h-[72px] lg:w-[15%] w-full rounded-[16px] text-base lg:text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/30 transition-all active:scale-[0.98]" 
          onClick={handleSearch}
        >
          <Search className="mr-2" size={22} strokeWidth={2.5} /> {t('search')}
        </Button>
      </div>
    </div>
  );
}
