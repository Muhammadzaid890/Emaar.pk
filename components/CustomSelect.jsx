'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select Option",
  icon: Icon = null,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder;

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-2xl bg-white border text-left flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer ${
          isOpen 
            ? 'border-[#38bdf8] ring-4 ring-sky-500/10 shadow-lg shadow-sky-500/5' 
            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-[#38bdf8] flex-shrink-0" />}
          <span className="text-xs font-black uppercase tracking-wide text-slate-900 truncate">
            {displayLabel}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-[#38bdf8]' : 'text-slate-400'}`} />
        </motion.div>
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] max-h-64 overflow-y-auto"
          >
            {options.map((opt, idx) => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const isSelected = value === optVal;

              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-sky-50 text-[#0284c7] font-black' 
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-black'
                  }`}
                >
                  <span className="truncate">{optLabel}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}