
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, Platform, AppMode, Integration, Apartment, Restaurant, DemandForecast, LayoutItem, TeamMember, SmartRailContext } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCw, CheckCircle2, AlertTriangle, DollarSign, Filter, Map, Grid, LayoutGrid, Clock, User, Users, UtensilsCrossed, Home, Package, Zap, TrendingUp, X, Loader2, ShoppingBag, Truck, Wrench, PartyPopper, Heart, Edit3, Plus, ChevronDown, Thermometer, Volume2, Move, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { analyzeMarketDemand } from '../services/geminiService';
import { getTheme } from '../utils/theme';
import { LayoutBuilder } from './LayoutBuilder';
import { mockTeamMembers } from '../data';

interface CalendarViewProps {
  bookings: Booking[];
  setBookings?: React.Dispatch<React.SetStateAction<Booking[]>>;
  appMode?: AppMode;
  integrations: Integration[];
  apartments: Apartment[];
  restaurants?: Restaurant[];
  currentTheme?: 'light' | 'dark';
  onSelectContext?: (context: SmartRailContext) => void;
}

const INITIAL_RESTAURANT_LAYOUT: LayoutItem[] = [
    { id: 't1', type: 'table-rect', x: 10, y: 10, width: 12, height: 12, rotation: 0, label: 'T1', capacity: 4, section: 'Main' },
    { id: 't2', type: 'table-rect', x: 30, y: 10, width: 12, height: 12, rotation: 0, label: 'T2', capacity: 4, section: 'Main' },
    { id: 't3', type: 'table-round', x: 50, y: 10, width: 10, height: 10, rotation: 0, label: 'T3', capacity: 2, section: 'Main' },
    { id: 't4', type: 'table-rect', x: 10, y: 40, width: 18, height: 12, rotation: 0, label: 'T4', capacity: 6, section: 'Main' },
    { id: 't5', type: 'table-rect', x: 70, y: 20, width: 12, height: 12, rotation: 0, label: 'T5', capacity: 4, section: 'Patio' },
    { id: 'b1', type: 'chair', x: 10, y: 70, width: 5, height: 5, rotation: 0, label: 'B1' },
    { id: 'wall1', type: 'wall', x: 65, y: 0, width: 2, height: 60, rotation: 0 },
    { id: 'door1', type: 'door', x: 0, y: 80, width: 8, height: 8, rotation: 0 }
];

const INITIAL_PROPERTY_LAYOUT: LayoutItem[] = [
    { id: 'apt1', type: 'zone', x: 10, y: 10, width: 35, height: 35, rotation: 0, label: 'Unit A', color: 'bg-blue-100/30' },
    { id: 'apt2', type: 'zone', x: 55, y: 10, width: 35, height: 35, rotation: 0, label: 'Unit B', color: 'bg-green-100/30' },
    { id: 'pool', type: 'zone', x: 10, y: 55, width: 80, height: 30, rotation: 0, label: 'Pool Area', color: 'bg-cyan-100/30' },
    { id: 'plant1', type: 'plant', x: 50, y: 50, width: 5, height: 5, rotation: 0 }
];

const INITIAL_RETAIL_LAYOUT: LayoutItem[] = [
    { id: 'shelf1', type: 'wall', x: 10, y: 10, width: 30, height: 5, rotation: 0, label: 'Aisle 1' },
    { id: 'shelf2', type: 'wall', x: 10, y: 30, width: 30, height: 5, rotation: 0, label: 'Aisle 2' },
    { id: 'counter', type: 'table-rect', x: 60, y: 60, width: 20, height: 10, rotation: 0, label: 'Checkout' },
    { id: 'zone1', type: 'zone', x: 50, y: 10, width: 40, height: 40, rotation: 0, label: 'New Arrivals', color: 'bg-purple-100/30' }
];

const INITIAL_AUTO_LAYOUT: LayoutItem[] = [
    { id: 'bay1', type: 'zone', x: 10, y: 10, width: 20, height: 30, rotation: 0, label: 'Bay 1', color: 'bg-gray-200/30' },
    { id: 'bay2', type: 'zone', x: 35, y: 10, width: 20, height: 30, rotation: 0, label: 'Bay 2', color: 'bg-gray-200/30' },
    { id: 'lift1', type: 'table-rect', x: 15, y: 15, width: 10, height: 20, rotation: 0, label: 'Lift 1' },
    { id: 'office', type: 'zone', x: 70, y: 10, width: 25, height: 25, rotation: 0, label: 'Office' }
];

const INITIAL_EVENT_LAYOUT: LayoutItem[] = [
    { id: 'stage', type: 'table-rect', x: 30, y: 5, width: 40, height: 15, rotation: 0, label: 'Main Stage' },
    { id: 'row1', type: 'zone', x: 10, y: 30, width: 80, height: 10, rotation: 0, label: 'Row A', color: 'bg-rose-100/30' },
    { id: 'row2', type: 'zone', x: 10, y: 45, width: 80, height: 10, rotation: 0, label: 'Row B', color: 'bg-rose-100/30' },
    { id: 'booth1', type: 'table-rect', x: 5, y: 70, width: 10, height: 10, rotation: 0, label: 'Booth 1' },
    { id: 'booth2', type: 'table-rect', x: 85, y: 70, width: 10, height: 10, rotation: 0, label: 'Booth 2' }
];

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, setBookings, appMode = 'property' as AppMode, integrations, apartments, restaurants = [], currentTheme = 'light', onSelectContext }) => {
  const theme = getTheme(appMode);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntityId, setSelectedEntityId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'visual' | 'edit_layout'>('calendar');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  
  // Custom Layout State
  const [activeLayout, setActiveLayout] = useState<LayoutItem[]>(() => {
      switch(appMode) {
          case 'restaurant': return INITIAL_RESTAURANT_LAYOUT;
          case 'ecommerce': return INITIAL_RETAIL_LAYOUT;
          case 'automotive': return INITIAL_AUTO_LAYOUT;
          case 'event': return INITIAL_EVENT_LAYOUT;
          default: return INITIAL_PROPERTY_LAYOUT;
      }
  });

  // God View States
  const [draggedStaffId, setDraggedStaffId] = useState<string | null>(null);
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);
  const [assignedStaff, setAssignedStaff] = useState<Record<string, string>>({}); // itemId -> staffId
  const [assignedBookings, setAssignedBookings] = useState<Record<string, string>>({}); // itemId -> bookingId
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'iot' | 'status'>('status');
  const [sidebarMode, setSidebarMode] = useState<'staff' | 'bookings'>('bookings');

  // Smart Pricing State
  const [showSmartPricing, setShowSmartPricing] = useState(false);
  const [demandForecast, setDemandForecast] = useState<DemandForecast[]>([]);
  const [isAnalyzingPricing, setIsAnalyzingPricing] = useState(false);

  // Visual Mode State
  const [visualTime, setVisualTime] = useState<number>(new Date().getHours()); // Hour 0-23

  const isEcommerce = appMode === 'ecommerce';
  const isRestaurant = appMode === 'restaurant';

  const unassignedBookings = useMemo(() => {
      // Find bookings for today that don't have a specific table/unit assigned in our visual map
      // (This is a simplified mock logic)
      const dateStr = currentDate.toISOString().split('T')[0];
      return bookings.filter(b => {
          const bDate = new Date(b.checkIn).toISOString().split('T')[0];
          const isAssigned = Object.values(assignedBookings).includes(b.id);
          return bDate === dateStr && !isAssigned && b.status !== BookingStatus.CheckedOut;
      });
  }, [bookings, currentDate, assignedBookings]);

  // --- Calendar Grid Logic ---
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const getBookingsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return bookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      checkIn.setHours(0,0,0,0);
      const checkOut = new Date(b.checkOut);
      checkOut.setHours(0,0,0,0);
      const current = new Date(date);
      current.setHours(0,0,0,0);
      return current >= checkIn && current <= checkOut;
    });
  };

  const handleAnalyzePricing = async () => {
      if (showSmartPricing) {
          setShowSmartPricing(false);
          return;
      }
      setIsAnalyzingPricing(true);
      
      try {
          const daysInMonth = getDaysInMonth(currentDate);
          const dates = [];
          for(let i=1; i<=daysInMonth; i++) {
              dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0]);
          }
          
          const location = apartments[0]?.address || "City Center";
          const basePrice = 150;

          const forecasts = await analyzeMarketDemand(location, dates, basePrice);
          setDemandForecast(forecasts);
          setShowSmartPricing(true);
      } catch (error) {
          console.error("Pricing analysis failed", error);
      } finally {
          setIsAnalyzingPricing(false);
      }
  };

  // --- Visual View Logic ---
  const handleDragStaffStart = (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData("type", "staff");
      e.dataTransfer.setData("id", id);
      setDraggedStaffId(id);
  };

  const handleDragBookingStart = (e: React.DragEvent, id: string) => {
      e.dataTransfer.setData("type", "booking");
      e.dataTransfer.setData("id", id);
      setDraggedBookingId(id);
  };

  const handleDrop = (e: React.DragEvent, itemId: string) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("type");
      const id = e.dataTransfer.getData("id");

      if (type === "staff") {
          setAssignedStaff(prev => ({ ...prev, [itemId]: id }));
      } else if (type === "booking") {
          setAssignedBookings(prev => ({ ...prev, [itemId]: id }));
          // In a real app, update booking.tableId or booking.apartmentId here
          if (setBookings) {
              setBookings(prev => prev.map(b => b.id === id ? { ...b, status: BookingStatus.Confirmed } : b));
          }
      }
      
      setDraggedStaffId(null);
      setDraggedBookingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleItemClick = (bookingId?: string) => {
      if (!bookingId || !onSelectContext) return;
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
          onSelectContext({ type: 'booking', data: booking });
      }
  };

  // Integration Health Check Logic
  const channelIntegrations = integrations.filter(i => i.category === 'Channel Manager' && i.status === 'Connected');
  const allSynced = channelIntegrations.every(i => {
      if (!i.lastSync) return false;
      const diff = new Date().getTime() - new Date(i.lastSync).getTime();
      return diff < 1000 * 60 * 60; // Synced within last hour
  });

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-32 bg-gray-50/30 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 backdrop-blur-sm"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDay(day);
      
      const visibleBookings = selectedEntityId === 'all' 
          ? dayBookings 
          : dayBookings.filter(b => (appMode === 'property' ? b.apartmentId : b.restaurantId) === selectedEntityId);

      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = isSameDay(dateObj, new Date());
      
      const dateKey = dateObj.toISOString().split('T')[0];
      const pricingData = demandForecast.find(f => f.date === dateKey);
      const demandColor = pricingData?.demandLevel === 'High' ? 'bg-red-50/80 dark:bg-red-900/30' : 
                          pricingData?.demandLevel === 'Medium' ? 'bg-orange-50/80 dark:bg-orange-900/30' : '';

      const bookingsByUnit: Record<string, number> = {};
      let hasConflict = false;
      
      if (appMode === 'property') {
          dayBookings.forEach(b => {
              const aptId = b.apartmentId || 'unknown';
              bookingsByUnit[aptId] = (bookingsByUnit[aptId] || 0) + 1;
              if (bookingsByUnit[aptId] > 1) hasConflict = true;
          });
      }

      days.push(
        <div key={`day-${day}`} className={`min-h-[120px] border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-2 relative group hover:${theme.border} dark:hover:border-opacity-50 transition-all ${hasConflict ? 'bg-red-50/50 dark:bg-red-900/20' : ''} ${showSmartPricing ? demandColor : ''} ${isToday ? `${theme.lightBg}/50 dark:bg-gray-800 ring-1 ${theme.ring.replace('focus:','')}` : ''}`}>
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-all ${isToday ? `${theme.bg} text-white scale-110 shadow-md` : 'text-gray-700 dark:text-gray-300'}`}>
              {day}
            </span>
            {!isRestaurant && !isEcommerce && (
                <span className={`text-[10px] font-mono flex items-center ${showSmartPricing && pricingData ? `${theme.text} font-bold` : 'text-gray-400'}`}>
                    ${showSmartPricing && pricingData ? pricingData.suggestedPrice : 180}
                </span>
            )}
          </div>
          
          {showSmartPricing && pricingData?.event && (
              <div className={`mb-1 flex items-center justify-center ${theme.badge} text-[9px] rounded px-1 py-0.5 font-bold`}>
                  <Zap className="w-3 h-3 mr-1" /> {pricingData.event}
              </div>
          )}

          {hasConflict && selectedEntityId === 'all' && (
              <div className="mb-1 flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-[10px] rounded px-1 py-0.5 font-bold animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Double Booking!
              </div>
          )}

          <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px] no-scrollbar">
            {visibleBookings.map(booking => {
              const entityName = appMode === 'property' 
                  ? apartments.find(a => a.id === booking.apartmentId)?.name
                  : restaurants.find(r => r.id === booking.restaurantId)?.name;
                  
              const isConflict = appMode === 'property' && bookingsByUnit[booking.apartmentId || ''] > 1;
              
              let statusColor = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200';
              if (booking.status === BookingStatus.Confirmed) statusColor = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200';
              if (booking.status === BookingStatus.Pending) statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200';
              if (isConflict) statusColor = 'bg-red-500 text-white border-red-600';

              return (
                <div 
                  key={booking.id} 
                  className={`text-[10px] px-2 py-1 rounded border ${statusColor} flex flex-col gap-0.5 cursor-pointer hover:scale-105 transition-transform shadow-sm relative overflow-hidden group/item`}
                  title={`${booking.guestName} - ${entityName}`}
                  onClick={() => onSelectContext?.({ type: 'booking', data: booking })}
                >
                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.platform === Platform.Airbnb ? 'bg-red-400' : booking.platform === Platform.WhatsApp ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                   
                   {isRestaurant ? (
                       <div className="pl-1.5">
                           <div className="flex justify-between items-center font-bold">
                                <span className="truncate">{booking.guestName.split(' ')[0]}</span>
                                <span className="flex items-center gap-0.5 text-[9px]"><Users className="w-2.5 h-2.5" />{booking.guests}</span>
                           </div>
                           <div className="text-[9px] opacity-80 flex items-center">
                                <Clock className="w-2.5 h-2.5 mr-1"/> {new Date(booking.checkIn).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                           </div>
                       </div>
                   ) : isEcommerce ? (
                       <div className="pl-1.5">
                           <div className="flex justify-between items-center">
                                <span className="font-bold truncate">#{booking.id.slice(-4)}</span>
                                {booking.status === 'Confirmed' && <Truck className="w-2.5 h-2.5 text-green-700" />}
                           </div>
                           <div className="text-[9px] opacity-80 truncate">
                                {booking.guestName}
                           </div>
                       </div>
                   ) : (
                       <div className="pl-1.5">
                           <div className="font-bold truncate">{booking.guestName}</div>
                           {selectedEntityId === 'all' && entityName && (
                               <div className="text-[9px] opacity-80 truncate flex items-center gap-1">
                                   <Home className="w-2.5 h-2.5"/> {entityName}
                               </div>
                           )}
                       </div>
                   )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // --- Layout Render Logic ---
  const renderDynamicLayout = () => (
      <div className="flex flex-1 h-[600px] gap-4">
          <div className="relative flex-1 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-inner animate-fade-in group">
              {/* Grid Background */}
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${currentTheme === 'light' ? '#cbd5e1' : '#475569'} 1px, transparent 1px)`, backgroundSize: '30px 30px', opacity: 0.3 }}></div>
              
              {activeLayout.map((item) => {
                  // Interactive Logic
                  const staffId = assignedStaff[item.id];
                  const bookingId = assignedBookings[item.id];
                  
                  const staffMember = staffId ? mockTeamMembers.find(m => m.id === staffId) : null;
                  const booking = bookingId ? bookings.find(b => b.id === bookingId) : null;
                  
                  // Simulation data
                  const temp = 70 + Math.floor(Math.random() * 5); // 70-75
                  const noise = 40 + Math.floor(Math.random() * 40); // 40-80db
                  const isHot = temp > 73;
                  const isLoud = noise > 70;

                  // Occupancy Logic
                  const isOccupied = !!booking || (item.type.includes('table') 
                      ? (Math.random() > 0.6 && visualTime > 12 && visualTime < 22) 
                      : false); 

                  let shapeClass = '';
                  let content = null;

                  if (item.type === 'table-rect') {
                      shapeClass = 'rounded-md border-2';
                      content = (
                          <div className="flex flex-col items-center justify-center h-full relative">
                              <span className="text-xs font-bold">{item.label}</span>
                              {activeOverlay === 'status' && (
                                  <>
                                    {isOccupied ? (
                                        booking ? (
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-bold truncate max-w-[90%]">{booking.guestName.split(' ')[0]}</span>
                                                <span className="text-[8px]">{booking.guests} ppl</span>
                                            </div>
                                        ) : <Users className="w-3 h-3 text-red-500" />
                                    ) : <span className="text-[9px] text-gray-400">{item.capacity || 4}</span>}
                                    
                                    {staffMember && (
                                        <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm" title={staffMember.name}>
                                            <img src={staffMember.avatar} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                  </>
                              )}
                          </div>
                      );
                  } else if (item.type === 'table-round') {
                      shapeClass = 'rounded-full border-2';
                      content = (
                          <div className="flex flex-col items-center justify-center h-full relative">
                              <span className="text-xs font-bold">{item.label}</span>
                              {activeOverlay === 'status' && staffMember && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-gray-200 overflow-hidden shadow-sm">
                                      <img src={staffMember.avatar} className="w-full h-full object-cover" />
                                  </div>
                              )}
                          </div>
                      );
                  } else if (item.type === 'zone') {
                      shapeClass = `border-2 border-dashed border-opacity-50 ${item.color}`;
                      content = (
                          <div className="flex flex-col items-center justify-center h-full">
                              <div className="p-1 text-[10px] font-bold text-blue-500/50 uppercase tracking-widest mb-1">{item.label}</div>
                              {booking && (
                                  <div className="bg-white/80 p-1 rounded text-[10px] font-bold shadow-sm">
                                      {booking.guestName}
                                  </div>
                              )}
                              {activeOverlay === 'iot' && (
                                  <div className="flex gap-2 mt-1">
                                      <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${isHot ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                          <Thermometer className="w-3 h-3" /> {temp}°
                                      </div>
                                      <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${isLoud ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                                          <Volume2 className="w-3 h-3" /> {noise}db
                                      </div>
                                  </div>
                              )}
                          </div>
                      );
                  } else if (item.type === 'wall') {
                      shapeClass = 'bg-gray-800 dark:bg-gray-300 shadow-sm';
                  } else if (item.type === 'chair') {
                      shapeClass = 'bg-gray-200 dark:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600';
                  }

                  const statusColor = isOccupied 
                      ? 'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-100' 
                      : 'bg-white border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200';

                  return (
                      <div 
                        key={item.id}
                        onDrop={(e) => handleDrop(e, item.id)}
                        onDragOver={handleDragOver}
                        onClick={() => handleItemClick(bookingId)}
                        className={`absolute flex items-center justify-center transition-all ${item.type !== 'zone' ? 'shadow-sm' : ''} ${item.type.includes('table') ? statusColor : ''} ${shapeClass} ${item.type.includes('table') || item.type === 'zone' ? 'hover:ring-2 ring-blue-400 cursor-pointer' : ''}`}
                        style={{ 
                            left: `${item.x}%`, 
                            top: `${item.y}%`,
                            width: `${item.width}%`,
                            height: `${item.height}%`,
                            transform: `rotate(${item.rotation}deg)`
                        }}
                        title={`${item.label} ${isOccupied ? '(Occupied)' : ''}`}
                      >
                          {content}
                      </div>
                  );
              })}
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button onClick={() => setViewMode('edit_layout')} className={`${theme.bg} ${theme.hover} text-white shadow-lg`}>
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Layout
                  </Button>
              </div>
          </div>

          {/* Interactive Sidebar */}
          <div className="w-64 flex flex-col gap-4">
              <Card>
                  <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-bold uppercase text-gray-500">View Layer</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-2">
                      <button 
                          onClick={() => setActiveOverlay('status')}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-sm border transition-all ${activeOverlay === 'status' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}
                      >
                          <span>Operations Status</span>
                          {activeOverlay === 'status' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                      </button>
                      <button 
                          onClick={() => setActiveOverlay('iot')}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-sm border transition-all ${activeOverlay === 'iot' ? 'bg-green-50 border-green-200 text-green-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}
                      >
                          <span>IoT Sensors</span>
                          {activeOverlay === 'iot' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                      </button>
                  </CardContent>
              </Card>

              <Card className="flex-1 flex flex-col">
                  <CardHeader className="p-4 pb-2">
                      <div className="flex gap-2">
                          <button 
                              onClick={() => setSidebarMode('bookings')}
                              className={`flex-1 text-xs font-bold uppercase py-1 border-b-2 transition-colors ${sidebarMode === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'}`}
                          >
                              Dispatch
                          </button>
                          <button 
                              onClick={() => setSidebarMode('staff')}
                              className={`flex-1 text-xs font-bold uppercase py-1 border-b-2 transition-colors ${sidebarMode === 'staff' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'}`}
                          >
                              Staff
                          </button>
                      </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2 flex-1 overflow-y-auto space-y-3">
                      {sidebarMode === 'staff' ? (
                          <>
                            {mockTeamMembers.map(member => (
                                <div 
                                    key={member.id}
                                    draggable
                                    onDragStart={(e) => handleDragStaffStart(e, member.id)}
                                    className={`flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-white hover:shadow-md cursor-grab active:cursor-grabbing transition-all ${draggedStaffId === member.id ? 'opacity-50' : ''}`}
                                >
                                    <img src={member.avatar} className="w-8 h-8 rounded-full bg-gray-100" />
                                    <div>
                                        <div className="font-bold text-xs text-gray-900">{member.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">{member.role}</div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-3 text-center text-xs text-gray-400 italic border-2 border-dashed border-gray-100 rounded-lg">
                                Drag staff to assign to tables/rooms
                            </div>
                          </>
                      ) : (
                          <>
                            {unassignedBookings.length === 0 ? (
                                <div className="text-center text-gray-400 text-xs py-8">
                                    No unassigned bookings for today.
                                </div>
                            ) : (
                                unassignedBookings.map(booking => (
                                    <div 
                                        key={booking.id}
                                        draggable
                                        onDragStart={(e) => handleDragBookingStart(e, booking.id)}
                                        className={`p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md cursor-grab active:cursor-grabbing transition-all ${draggedBookingId === booking.id ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-xs text-gray-900">{booking.guestName}</div>
                                            <Badge variant="outline" className="text-[9px] px-1 py-0">{booking.guests} ppl</Badge>
                                        </div>
                                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {new Date(booking.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div className="p-3 text-center text-xs text-gray-400 italic border-2 border-dashed border-gray-100 rounded-lg">
                                Drag booking to assign to table/unit
                            </div>
                          </>
                      )}
                  </CardContent>
              </Card>
          </div>
      </div>
  );

  if (viewMode === 'edit_layout') {
      return (
          <LayoutBuilder 
              initialItems={activeLayout}
              onSave={(newItems) => { setActiveLayout(newItems); setViewMode('visual'); }}
              onCancel={() => setViewMode('visual')}
              appMode={appMode}
              currentTheme={currentTheme}
          />
      );
  }

  // New Booking Modal Component (Internal)
  const NewBookingModal = ({ onClose, appMode, theme }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
        <Card className="w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle>New {appMode === 'ecommerce' ? 'Order' : 'Booking'}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-500 border border-dashed border-gray-200 dark:border-gray-700">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Booking creation form would go here.</p>
                    <p className="text-xs mt-1">Connect calendar API to enable.</p>
                </div>
                <div className="flex justify-end pt-2">
                    <Button onClick={onClose} className={`${theme.bg} ${theme.hover} text-white shadow-md`}>Create (Mock)</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto flex flex-col">
      
      {isNewBookingModalOpen && (
          <NewBookingModal 
            onClose={() => setIsNewBookingModalOpen(false)}
            appMode={appMode}
            theme={theme}
          />
      )}

      {/* Sync Health Dashboard */}
      {!isEcommerce && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-slide-up">
              <Card className={`md:col-span-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-${theme.name}-100 dark:border-gray-700`}>
                  <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${allSynced ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {allSynced ? <CheckCircle2 className="w-5 h-5" /> : <RefreshCw className="w-5 h-5 animate-spin" />}
                          </div>
                          <div>
                              <div className="font-bold text-gray-900 dark:text-white">Channel Sync Status</div>
                              <div className="text-xs text-gray-500">
                                  {allSynced ? 'All channels up to date' : 'Syncing in progress...'}
                              </div>
                          </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-xs bg-white dark:bg-gray-800">
                          <RefreshCw className="w-3 h-3 mr-2" /> Sync Now
                      </Button>
                  </CardContent>
              </Card>
              
              <Card className="border-indigo-100 dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10">
                  <CardContent className="p-4 flex items-center justify-between">
                      <div>
                          <div className="font-bold text-indigo-900 dark:text-indigo-100">Smart Pricing</div>
                          <div className="text-xs text-indigo-600 dark:text-indigo-300">AI Demand Forecast</div>
                      </div>
                      <div className="flex items-center">
                          <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={handleAnalyzePricing}
                              disabled={isAnalyzingPricing}
                              className={`h-8 w-8 p-0 rounded-full ${showSmartPricing ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-indigo-100'}`}
                          >
                              {isAnalyzingPricing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
      )}

      {/* Calendar Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
        
        {/* Left: Date Nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-1 rounded-lg shadow-sm">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" /></button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1 self-center"></div>
            <button onClick={goToToday} className="px-3 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-700 dark:text-gray-300">Today</button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1 self-center"></div>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"><ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" /></button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            
            {/* Filter */}
            {(appMode === 'property' || appMode === 'restaurant') && (
                <div className="relative group">
                    <Filter className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                    <select 
                        className="h-9 pl-9 pr-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors min-w-[140px] shadow-sm"
                        value={selectedEntityId}
                        onChange={(e) => setSelectedEntityId(e.target.value)}
                    >
                        <option value="all">All {appMode === 'property' ? 'Properties' : 'Locations'}</option>
                        {appMode === 'property' 
                            ? apartments.map(apt => <option key={apt.id} value={apt.id}>{apt.name}</option>)
                            : restaurants.map(rest => <option key={rest.id} value={rest.id}>{rest.name}</option>)
                        }
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
            )}

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>

            {/* View Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('calendar')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Calendar</span>
                </button>
                <button 
                    onClick={() => setViewMode('visual')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'visual' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    {appMode === 'property' ? <Map className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">God View</span>
                </button>
            </div>
            
            {/* New Booking Button */}
            <Button 
                onClick={() => setIsNewBookingModalOpen(true)} 
                className={`${theme.bg} ${theme.hover} text-white shadow-lg shadow-${theme.name}-500/20`}
            >
                <Plus className="w-4 h-4 mr-2" /> New {appMode === 'ecommerce' ? 'Order' : 'Booking'}
            </Button>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-7 gap-4 auto-rows-fr h-full overflow-y-auto">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-500 dark:text-gray-400 text-sm py-2 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                    {day}
                </div>
                ))}
                {renderCalendarGrid()}
            </div>
          ) : (
            <div className="h-full flex flex-col gap-6 overflow-hidden">
                {/* Time Slider for Visual View */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 shrink-0">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide w-24">Time Travel</div>
                    <div className="flex-1 relative">
                        <input 
                            type="range" 
                            min="0" 
                            max="23" 
                            value={visualTime} 
                            onChange={(e) => setVisualTime(parseInt(e.target.value))}
                            className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${theme.name}-600`}
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                            <span>12 AM</span>
                            <span>6 AM</span>
                            <span>12 PM</span>
                            <span>6 PM</span>
                            <span>11 PM</span>
                        </div>
                    </div>
                    <div className={`text-xl font-bold ${theme.text} w-16 text-center border-l border-gray-200 dark:border-gray-700 pl-4`}>
                        {visualTime === 0 ? '12 AM' : visualTime < 12 ? `${visualTime} AM` : visualTime === 12 ? '12 PM' : `${visualTime - 12} PM`}
                    </div>
                </div>

                {/* Dynamic Interactive Layout Render */}
                {renderDynamicLayout()}
                
            </div>
          )}
      </div>
    </div>
  );
};

export default CalendarView;
