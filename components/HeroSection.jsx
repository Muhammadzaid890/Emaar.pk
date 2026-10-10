'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar';

export default function HeroSection({ onSearch }) {
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 5) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection]);

  return (
    <section className="relative z-30 w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 overflow-visible">
      
      {/* Background HD Video Player Wrapped Safely (Video clipped without hiding dropdowns) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        >
          <source src="/emaar-hero.mp4" type="video/mp4" />
          <source src="emaar.mp4" type="video/mp4" />
        </video>
        {/* Subtle dark tint over video for text readability */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5 mb-8 mt-4">
        
        {/* Heading */}
        <motion.h1
          key={scrollDirection}
          initial={{ opacity: 0, y: scrollDirection === 'down' ? -25 : 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug uppercase drop-shadow-md"
        >
          Experience Exclusive Waterfront Luxury at Emaar
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="text-white text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed drop-shadow"
        >
          Discover premium seafront apartments and penthouses crafted for elite living. Direct inventory with verified guidance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-1"
        >
          <a
            href="#sale"
            className="bg-white hover:bg-slate-100 text-black font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            Explore Available Units <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://wa.me/923331234201?text=Hi,%20I%20want%20to%20book%20a%20site%20visit%20for%20Emaar%20Karachi."
            target="_blank"
            rel="noreferrer"
            className="bg-black/60 hover:bg-black/80 text-white border border-white/30 font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 backdrop-blur-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" /> Book a Site Visit
          </a>
        </motion.div>
      </div>

      {/* Clean Search Bar Container (Explicitly Floating Above Everything) */}
      <div className="relative z-40 w-full px-2 overflow-visible">
        <SearchBar onSearch={onSearch} />
      </div>
    </section>
  );
}