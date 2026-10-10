'use client';

import React, { useState } from 'react';
import { Building2, Key, ChevronRight } from 'lucide-react';

export default function ExploreTabs({ onSelectCategory }) {
  // Card 1 (Sale) active sub-tab
  const [saleTab, setSaleTab] = useState('Type');
  // Card 2 (Rent) active sub-tab
  const [rentTab, setRentTab] = useState('Popular');

  const saleData = {
    Popular: [
      { title: 'Coral Towers', subtitle: 'SEA-FACING' },
      { title: 'Pearl Towers', subtitle: 'CORNER UNITS' },
      { title: 'Reef Towers', subtitle: 'READY UNITS' },
      { title: 'Panorama', subtitle: 'HIGH FLOOR' },
      { title: 'The Views', subtitle: 'WATERFRONT' },
      { title: 'Oceanfront Penthouse', subtitle: 'DUPLEX' },
    ],
    Type: [
      { title: '1 Bed Luxury', subtitle: 'APARTMENTS' },
      { title: '2 Bed Corner', subtitle: 'APARTMENTS' },
      { title: '3 Bed Sea View', subtitle: 'APARTMENTS' },
      { title: '4 Bed Executive', subtitle: 'APARTMENTS' },
      { title: 'Duplex Penthouse', subtitle: 'SKY VILLAS' },
      { title: 'Retail Shops', subtitle: 'COMMERCIAL' },
    ],
    'Area Size': [
      { title: '950 - 1,200', subtitle: 'SQ. FT' },
      { title: '1,400 - 1,800', subtitle: 'SQ. FT' },
      { title: '2,100 - 2,600', subtitle: 'SQ. FT' },
      { title: '3,000 - 3,800', subtitle: 'SQ. FT' },
      { title: '4,500 - 6,000', subtitle: 'PENTHOUSES' },
      { title: 'Custom Full Floor', subtitle: 'SQ. FT' },
    ],
  };

  const rentData = {
    Popular: [
      { title: 'Furnished', subtitle: 'SEA VIEW FLATS' },
      { title: 'Unfurnished', subtitle: 'READY TO MOVE' },
      { title: 'High Floor', subtitle: 'PANORAMIC VIEW' },
      { title: 'Coral Tower', subtitle: 'FOR RENT' },
      { title: 'Pearl Tower', subtitle: 'FOR RENT' },
      { title: 'Executive Suites', subtitle: 'SHORT / LONG TERM' },
    ],
    Type: [
      { title: '1 Bedroom', subtitle: 'RENTAL SUITES' },
      { title: '2 Bedrooms', subtitle: 'RENTAL FLATS' },
      { title: '3 Bedrooms', subtitle: 'FAMILY UNITS' },
      { title: '4 Bedrooms', subtitle: 'LUXURY LIVING' },
      { title: 'Penthouse', subtitle: 'EXCLUSIVE LEASE' },
      { title: 'Commercial Retail', subtitle: 'SHOPS FOR RENT' },
    ],
    'Area Size': [
      { title: 'Compact Suite', subtitle: 'UNDER 1,200 SQ. FT' },
      { title: 'Mid-Size Luxury', subtitle: '1,500 - 2,200 SQ. FT' },
      { title: 'Large Residence', subtitle: '2,500 - 3,500 SQ. FT' },
      { title: 'Skyline Penthouse', subtitle: '4,000+ SQ. FT' },
      { title: 'Retail Space', subtitle: '800 - 2,000 SQ. FT' },
      { title: 'Corporate Floor', subtitle: 'CUSTOM SQ. FT' },
    ],
  };

  const handleCardClick = (intent, subCategory, item) => {
    if (onSelectCategory) {
      onSelectCategory({ intent, subCategory, item });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* CARD 1: APARTMENTS FOR SALE */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between relative group">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-black tracking-tight uppercase">
                  Apartments for Sale
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Crescent Bay Inventory
                </p>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-6">
              {['Popular', 'Type', 'Area Size'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSaleTab(tab)}
                  className={`text-xs font-black uppercase tracking-wider transition-all relative pb-2 cursor-pointer ${
                    saleTab === tab
                      ? 'text-black font-black'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {saleTab === tab && (
                    <span className="absolute left-0 bottom-[-13px] w-full h-[2.5px] bg-[#38bdf8] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Grid of Rounded Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {saleData[saleTab].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick('SALE', saleTab, item)}
                  className="bg-white border border-slate-200/90 hover:border-[#38bdf8] rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center justify-center min-h-[90px]"
                >
                  <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 mt-6">
            <span className="w-4 h-1.5 rounded-full bg-[#38bdf8]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
          </div>
        </div>

        {/* CARD 2: LUXURY RENTALS */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between relative group">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-black tracking-tight uppercase">
                  Luxury for Rent
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Furnished & Sea-Facing Residences
                </p>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-6">
              {['Popular', 'Type', 'Area Size'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRentTab(tab)}
                  className={`text-xs font-black uppercase tracking-wider transition-all relative pb-2 cursor-pointer ${
                    rentTab === tab
                      ? 'text-black font-black'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {rentTab === tab && (
                    <span className="absolute left-0 bottom-[-13px] w-full h-[2.5px] bg-[#38bdf8] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Grid of Rounded Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {rentData[rentTab].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick('RENT', rentTab, item)}
                  className="bg-white border border-slate-200/90 hover:border-[#38bdf8] rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col items-center justify-center min-h-[90px]"
                >
                  <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 mt-6">
            <span className="w-4 h-1.5 rounded-full bg-[#38bdf8]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
          </div>
        </div>

      </div>
    </section>
  );
}