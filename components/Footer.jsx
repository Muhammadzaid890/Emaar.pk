'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, MapPin, Phone, Mail, MessageSquare, 
  ArrowUpRight, ShieldCheck 
} from 'lucide-react';

const OWNER_NAME = "Zeshan Khurshid";
const ESTATE_NAME = "Sadaf Estate";
const PHONE_NUMBER = "03331234201";
const WHATSAPP_RAW = "923331234201";

// SVGs for exact official brand logos
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-900 font-sans mt-auto">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#38bdf8] via-[#0284c7] to-slate-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Official Advisory (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-baseline tracking-tight group">
              <span className="font-serif text-3xl font-extrabold text-black transform scale-y-125 inline-block mr-[2px]">
                E
              </span>
              <span className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900">
                maar
              </span>
              <span className="text-2xl font-black tracking-tight text-slate-900 ml-[2px]">
                .PK
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] ml-1 self-end mb-1" />
            </Link>

            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm">
              Premier real estate advisory dedicated exclusively to **Emaar Crescent Bay Karachi**. Providing direct verified inventory for Sale, Rent, and Developer Booking in DHA Phase 8.
            </p>

            <div className="flex items-center gap-2 p-3 bg-sky-50/70 border border-sky-100 rounded-2xl w-fit">
              <ShieldCheck className="w-4 h-4 text-[#38bdf8] flex-shrink-0" />
              <span className="text-[11px] font-black uppercase text-slate-900">
                Managed Exclusively By: <span className="text-[#0284c7]">{OWNER_NAME}</span> ({ESTATE_NAME})
              </span>
            </div>

            {/* Social Media Icons (With their Authentic Brand Colors) */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-3">
                Connect With Us On Social Media
              </span>
              
              <div className="flex items-center gap-3">
                {/* Facebook (#1877F2) */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:shadow-md hover:shadow-[#1877F2]/30 active:scale-95"
                >
                  <FacebookIcon />
                </a>

                {/* Instagram (Radiant Gradient) */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="w-10 h-10 rounded-xl bg-pink-50 text-[#E4405F] border border-pink-200 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all shadow-sm hover:shadow-md hover:shadow-pink-500/30 active:scale-95"
                >
                  <InstagramIcon />
                </a>

                {/* YouTube (#FF0000) */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  className="w-10 h-10 rounded-xl bg-red-50 text-[#FF0000] border border-red-200 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all shadow-sm hover:shadow-md hover:shadow-red-500/30 active:scale-95"
                >
                  <YoutubeIcon />
                </a>

                {/* Twitter / X (Deep Modern Black) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter / X"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-black border border-slate-300 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-md hover:shadow-black/20 active:scale-95"
                >
                  <TwitterIcon />
                </a>
              </div>
            </div>

          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Property Portal
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-600">
              <li>
                <Link href="/" className="hover:text-[#38bdf8] transition-colors flex items-center justify-between">
                  Home Portal <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#38bdf8] transition-colors flex items-center justify-between">
                  Booking Plans <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/sale" className="hover:text-[#38bdf8] transition-colors flex items-center justify-between">
                  Sale Inventory <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-[#38bdf8] transition-colors flex items-center justify-between">
                  Rent Residences <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#38bdf8] transition-colors flex items-center justify-between">
                  Consultancy <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Prominent Towers (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Active Towers
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500">
              <li className="hover:text-black transition-colors">Coral Towers</li>
              <li className="hover:text-black transition-colors">Reef Towers</li>
              <li className="hover:text-black transition-colors">Pearl Towers</li>
              <li className="hover:text-black transition-colors">Panorama Tower</li>
              <li className="hover:text-black transition-colors">The Views</li>
            </ul>
          </div>

          {/* Column 4: Contact & Site Location (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Advisory Desk
            </h4>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium leading-relaxed">
                  Crescent Bay, Phase 8 DHA, Karachi, Sindh, Pakistan.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#38bdf8] flex-shrink-0" />
                <a href={`tel:${PHONE_NUMBER}`} className="font-bold text-slate-900 hover:text-[#38bdf8]">
                  +92 333 1234201
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=AOA%20Zeshan%20Bhai,%20I%20am%20inquiring%20about%20Emaar%20Crescent%20Bay%20properties.`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-400">
         <p>© 2026 Emaar Crescent Bay Property Advisory. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by {ESTATE_NAME}</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-black transition-colors uppercase">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}