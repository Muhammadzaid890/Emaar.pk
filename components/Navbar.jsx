'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Booking', href: '/booking' },
    { label: 'Sale', href: '/sale' },
    { label: 'Rent', href: '/rent' },
    { label: 'Contact', href: '/contact' },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Luxury Brand Logo: Emaar.PK */}
          <Link href="/" className="group inline-flex flex-col select-none py-1">
            <div className="flex items-baseline tracking-tight">
              {/* Taller Architectural 'E' */}
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-black transform scale-y-125 inline-block mr-[2px] transition-transform duration-300 group-hover:scale-y-130">
                E
              </span>
              {/* Rest of the brand name with modern kerning */}
              <span className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
                maar
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 ml-[2px]">
                .PK
              </span>
              {/* Subtle cyan accent dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] ml-1 self-end mb-1"></span>
            </div>

            {/* Hover Underline (Matching Search Button #38bdf8) */}
            <span className="h-[2.5px] w-0 bg-[#38bdf8] rounded-full mt-1 transition-all duration-300 ease-out group-hover:w-full shadow-sm shadow-[#38bdf8]/40" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="group relative py-2 text-xs font-black uppercase tracking-wider text-slate-900 hover:text-black transition-colors"
              >
                {item.label}
                {/* Smooth Hover Underline (#38bdf8) */}
                <span className="absolute left-0 bottom-0 h-[2.5px] w-0 bg-[#38bdf8] rounded-full transition-all duration-300 ease-out group-hover:w-full shadow-sm shadow-[#38bdf8]/40" />
              </a>
            ))}
          </nav>

          {/* Desktop Admin Portal Link */}
          <div className="hidden sm:flex items-center">
            <Link
              href="/admin"
              className="bg-slate-950 hover:bg-slate-800 text-white font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <Lock className="w-3.5 h-3.5 text-[#38bdf8]" /> Login
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-900 hover:text-[#38bdf8] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Frosted Glass) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-white/50 px-5 py-4 space-y-3 shadow-lg">
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 hover:text-[#38bdf8] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-slate-950 text-white font-black py-2.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-3 shadow-md"
          >
            <Lock className="w-3.5 h-3.5 text-[#38bdf8]" /> Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}