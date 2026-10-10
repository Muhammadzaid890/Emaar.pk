'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CustomSelect from '@/components/CustomSelect';
import ListingSkeleton from '@/components/ListingSkeleton';
import { EMAAR_TOWERS } from '@/lib/constants';
import { 
  Building2, MessageSquare, Phone, Bed, Bath, 
  Maximize2, CalendarClock, MapPin, Search, 
  CreditCard, Wallet 
} from 'lucide-react';

const OWNER_NAME = "Zeshan Khurshid";
const PHONE_NUMBER = "03331234201";

export default function BookingPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTower, setSelectedTower] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadBookingData() {
      try {
        setLoading(true);
        const res = await fetch('/api/properties?intent=BOOKING');
        const data = await res.json();
        if (data.success) {
          setProperties(data.properties || []);
        }
      } catch (err) {
        console.error('Booking data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookingData();
  }, []);

  const formatPrice = (pkr) => {
    if (!pkr) return 'Demand on Call';
    if (pkr >= 10000000) return `PKR ${(pkr / 10000000).toFixed(2)} Crore`;
    if (pkr >= 100000) return `PKR ${(pkr / 100000).toFixed(2)} Lac`;
    return `PKR ${Number(pkr).toLocaleString()}`;
  };

  const towerOptions = [
    { value: 'ALL', label: 'All Emaar Towers' },
    ...EMAAR_TOWERS.map((t) => ({ value: t, label: t }))
  ];

  const filtered = properties.filter((p) => {
    const matchTower = selectedTower === 'ALL' || p.tower_name === selectedTower;
    const matchQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tower_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTower && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 inline-block">
            Developer Direct Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
            Emaar Crescent Bay — Booking & Installment Plans
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Flexible down payment and customized monthly installment schedules
          </p>
        </div>
      </section>

      {/* Filters Bar with Custom Professional Dropdown */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Custom Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search booking project or tower..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-black placeholder:text-slate-400 outline-none focus:border-[#38bdf8] focus:ring-4 focus:ring-sky-500/10 transition-all"
            />
          </div>

          {/* Luxury Custom Select */}
          <CustomSelect
            value={selectedTower}
            onChange={setSelectedTower}
            options={towerOptions}
            icon={Building2}
          />
        </div>
      </section>

      {/* Listing Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full space-y-4">
        <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider px-1">
          <span>Booking Slots Available ({filtered.length})</span>
          <span>Flexible Schedules</span>
        </div>

        {/* Shimmer Effect vs Loaded Content */}
        {loading ? (
          <ListingSkeleton count={3} />
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider">
              No booking plans found for the selected criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filtered.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 hover:border-[#38bdf8] rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-100">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-[#38bdf8] text-[9px] font-black uppercase text-white px-1.5 py-0.5 rounded">
                      Booking Open
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#38bdf8] bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {item.tower_name}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.unit_type}
                      </span>
                      {item.installment_duration && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <CalendarClock className="w-3 h-3" /> {item.installment_duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                      <MapPin className="w-3 h-3 text-slate-400" /> Crescent Bay, DHA Phase 8, Karachi
                    </div>

                    {/* Breakdown: Down Payment & Monthly Installment */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold pt-1">
                      {item.down_payment_pkr > 0 && (
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          <Wallet className="w-3 h-3" /> Down: PKR {Number(item.down_payment_pkr).toLocaleString()}
                        </span>
                      )}
                      {item.monthly_installment_pkr > 0 && (
                        <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          <CreditCard className="w-3 h-3" /> Monthly: PKR {Number(item.monthly_installment_pkr).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" /> {item.bedrooms || 2} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-slate-400" /> {item.bathrooms || 2} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {item.area_sqft} Sq. Ft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Price</div>
                    <div className="text-base sm:text-lg font-black text-slate-950">
                      {formatPrice(item.price_pkr)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Official Advisor: {OWNER_NAME}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`https://wa.me/923331234201?text=AOA%20Zeshan%20Bhai,%20I%20want%20to%20inquire%20about%20Installment%20Booking%20unit:%20${encodeURIComponent(item.title)}%20(${encodeURIComponent(item.tower_name)}).`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Book Now
                    </a>
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}