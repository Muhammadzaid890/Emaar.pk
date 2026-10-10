'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Search, Home, Maximize2, Coins, 
  ChevronDown, Check, X, RotateCcw 
} from 'lucide-react';
import { EMAAR_TOWERS, UNIT_TYPES, AREA_RANGES, PRICE_RANGES } from '@/lib/constants';

export default function SearchBar({ onSearch }) {
  const [selectedTower, setSelectedTower] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  
  // Track open dropdown
  const [activeMenu, setActiveMenu] = useState(null); // 'tower' | 'unit' | 'area' | 'price'
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleToggle = (menuName) => {
    setActiveMenu(prev => prev === menuName ? null : menuName);
  };

  const handleReset = () => {
    setSelectedTower('');
    setSearchQuery('');
    setSelectedUnit('');
    setSelectedArea('');
    setSelectedPrice('');
    setActiveMenu(null);
    if (onSearch) {
      onSearch({ tower: '', query: '', unit: '', area: '', price: '' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveMenu(null);
    if (onSearch) {
      onSearch({
        tower: selectedTower,
        query: searchQuery,
        unit: selectedUnit,
        area: selectedArea,
        price: selectedPrice
      });
    }
  };

  const hasActiveFilters = Boolean(
    selectedTower || searchQuery || selectedUnit || selectedArea || selectedPrice
  );

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto relative z-50 select-none">
      <form 
        onSubmit={handleSearchSubmit}
        className="bg-white/95 backdrop-blur-xl p-3.5 sm:p-5 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/80 space-y-3 relative z-40"
      >
        {/* Top Row: Tower, Search Location / Keyword, Unit Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3">
          
          {/* 1. Custom Tower Dropdown */}
          <div className={`md:col-span-4 relative ${activeMenu === 'tower' ? 'z-[9999]' : 'z-20'}`}>
            <button
              type="button"
              onClick={() => handleToggle('tower')}
              className={`w-full h-12 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
                activeMenu === 'tower'
                  ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                  : selectedTower
                  ? 'border-sky-300 bg-white font-black'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedTower ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
                  {selectedTower || 'Emaar Karachi'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeMenu === 'tower' ? 'rotate-180 text-sky-600' : ''}`} />
            </button>

            <AnimatePresence>
              {activeMenu === 'tower' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-14 w-full sm:w-72 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2 z-[99999] max-h-64 overflow-y-auto"
                >
                  <div
                    onClick={() => { setSelectedTower(''); setActiveMenu(null); }}
                    className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <span>All Towers</span>
                    {!selectedTower && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  {EMAAR_TOWERS.map((tower, idx) => (
                    <div
                      key={idx}
                      onClick={() => { setSelectedTower(tower); setActiveMenu(null); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-between transition-colors ${
                        selectedTower === tower ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{tower}</span>
                      {selectedTower === tower && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Direct Search Input */}
          <div className="md:col-span-4 relative z-10">
            <div className="w-full h-12 px-4 rounded-full border border-slate-200 bg-white hover:border-slate-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200 transition-all flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="SEARCH BY LOCATION / TOWER"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-black uppercase text-slate-800 placeholder:text-slate-400 outline-none tracking-wider"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Custom Unit Type Dropdown */}
          <div className={`md:col-span-4 relative ${activeMenu === 'unit' ? 'z-[9999]' : 'z-20'}`}>
            <button
              type="button"
              onClick={() => handleToggle('unit')}
              className={`w-full h-12 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
                activeMenu === 'unit'
                  ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                  : selectedUnit
                  ? 'border-sky-300 bg-white font-black'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Home className={`w-4 h-4 flex-shrink-0 ${selectedUnit ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
                  {selectedUnit || 'Apartments'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeMenu === 'unit' ? 'rotate-180 text-sky-600' : ''}`} />
            </button>

            <AnimatePresence>
              {activeMenu === 'unit' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 w-full sm:w-72 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2 z-[99999] max-h-64 overflow-y-auto"
                >
                  <div
                    onClick={() => { setSelectedUnit(''); setActiveMenu(null); }}
                    className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <span>All Property Types</span>
                    {!selectedUnit && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  {UNIT_TYPES.map((unit, idx) => (
                    <div
                      key={idx}
                      onClick={() => { setSelectedUnit(unit); setActiveMenu(null); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-between transition-colors ${
                        selectedUnit === unit ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{unit}</span>
                      {selectedUnit === unit && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Row: Area Range, Price Range, Search & Reset Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3">
          
          {/* 4. Custom Area Dropdown */}
          <div className={`md:col-span-5 relative ${activeMenu === 'area' ? 'z-[9999]' : 'z-10'}`}>
            <button
              type="button"
              onClick={() => handleToggle('area')}
              className={`w-full h-12 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
                activeMenu === 'area'
                  ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                  : selectedArea
                  ? 'border-sky-300 bg-white font-black'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Maximize2 className={`w-4 h-4 flex-shrink-0 ${selectedArea ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
                  {selectedArea || 'Area (Sq. Ft)'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeMenu === 'area' ? 'rotate-180 text-sky-600' : ''}`} />
            </button>

            <AnimatePresence>
              {activeMenu === 'area' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-14 w-full sm:w-72 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2 z-[99999] max-h-64 overflow-y-auto"
                >
                  <div
                    onClick={() => { setSelectedArea(''); setActiveMenu(null); }}
                    className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <span>Any Area Size</span>
                    {!selectedArea && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  {AREA_RANGES.map((area, idx) => (
                    <div
                      key={idx}
                      onClick={() => { setSelectedArea(area); setActiveMenu(null); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-between transition-colors ${
                        selectedArea === area ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{area}</span>
                      {selectedArea === area && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Custom Price Dropdown */}
          <div className={`md:col-span-5 relative ${activeMenu === 'price' ? 'z-[9999]' : 'z-10'}`}>
            <button
              type="button"
              onClick={() => handleToggle('price')}
              className={`w-full h-12 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
                activeMenu === 'price'
                  ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                  : selectedPrice
                  ? 'border-sky-300 bg-white font-black'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Coins className={`w-4 h-4 flex-shrink-0 ${selectedPrice ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
                  {selectedPrice || 'Price (PKR)'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeMenu === 'price' ? 'rotate-180 text-sky-600' : ''}`} />
            </button>

            <AnimatePresence>
              {activeMenu === 'price' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-14 w-full sm:w-72 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200 p-2 z-[99999] max-h-64 overflow-y-auto"
                >
                  <div
                    onClick={() => { setSelectedPrice(''); setActiveMenu(null); }}
                    className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <span>Any Price Range</span>
                    {!selectedPrice && <Check className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  {PRICE_RANGES.map((price, idx) => (
                    <div
                      key={idx}
                      onClick={() => { setSelectedPrice(price); setActiveMenu(null); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-between transition-colors ${
                        selectedPrice === price ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{price}</span>
                      {selectedPrice === price && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 6. Buttons: SEARCH & Reset */}
          <div className="md:col-span-2 flex items-center gap-2 relative z-0">
            <button
              type="submit"
              className="flex-1 h-12 bg-[#38bdf8] hover:bg-[#0ea5e9] active:scale-95 text-black font-black rounded-full text-xs uppercase tracking-widest transition-all shadow-md shadow-[#38bdf8]/30 flex items-center justify-center cursor-pointer"
            >
              SEARCH
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset filters"
                className="w-12 h-12 flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}