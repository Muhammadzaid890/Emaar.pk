'use client';

import Footer from '@/components/Footer';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CustomSelect from '@/components/CustomSelect';
import { EMAAR_TOWERS } from '@/lib/constants';
import { 
  Building2, Phone, Mail, MapPin, MessageSquare, 
  Clock, ShieldCheck, Send, CheckCircle2, User, HelpCircle 
} from 'lucide-react';

const OWNER_NAME = "Zeshan Khurshid";
const ESTATE_NAME = "Sadaf Estate";
const PHONE_NUMBER = "03331234201";
const WHATSAPP_RAW = "923331234201";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    purpose: 'BUY',
    tower: EMAAR_TOWERS[0] || 'Coral Tower 1',
    message: ''
  });

  const purposeOptions = [
    { value: 'BUY', label: 'Buying an Apartment' },
    { value: 'RENT', label: 'Renting a Residence' },
    { value: 'BOOKING', label: 'New Booking & Installment Plan' },
    { value: 'SELL', label: 'Listing / Selling My Property' },
  ];

  const towerOptions = [
    { value: 'Any Tower', label: 'Any / General Inquiry' },
    ...EMAAR_TOWERS.map(t => ({ value: t, label: t }))
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const encodedMsg = encodeURIComponent(
      `AOA Zeshan Bhai,\n\nMy Name: ${form.name}\nContact: ${form.phone}\nRequirement: ${form.purpose}\nTower Preference: ${form.tower}\nDetails: ${form.message || 'Looking for available options'}`
    );
    window.open(`https://wa.me/${WHATSAPP_RAW}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 inline-block">
            Principal Advisory
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight">
            Connect With Emaar Crescent Bay Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
            Direct inventory access, transparent documentation & private sea-facing viewings
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Official Advisory Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Consultant Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] block">
                    Lead Portfolio Consultant
                  </span>
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">
                    {OWNER_NAME}
                  </h2>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                    {ESTATE_NAME}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3.5 text-xs">
                  <MapPin className="w-4 h-4 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-black uppercase block">Site Location</span>
                    <span className="text-slate-500 font-medium">
                      Emaar Crescent Bay, Phase 8 DHA, Karachi, Sindh, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs">
                  <Phone className="w-4 h-4 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-black uppercase block">Direct Line</span>
                    <a href={`tel:${PHONE_NUMBER}`} className="text-slate-900 font-bold hover:text-[#38bdf8]">
                      +92 333 1234201
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs">
                  <Clock className="w-4 h-4 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-black uppercase block">Office Hours</span>
                    <span className="text-slate-500 font-medium">
                      Monday to Saturday: 10:00 AM – 7:30 PM (Site visits on appointment)
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP_RAW}?text=AOA%20Zeshan%20Bhai,%20I%20want%20to%20consult%20regarding%20Emaar%20Crescent%20Bay%20properties.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 text-[#38bdf8]" /> Call Direct
                </a>
              </div>
            </div>

            {/* Verification Guarantee */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-black uppercase">
                <ShieldCheck className="w-4 h-4 text-[#38bdf8]" /> Verified Seafront Portfolio
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                All inventory listings provided by {ESTATE_NAME} are cross-referenced directly with original allotment papers and official developer ledger records.
              </p>
            </div>

          </div>

          {/* Right Column: Custom Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] block mb-1">
                  Fast Direct Inquiry
                </span>
                <h3 className="text-xl font-black text-black uppercase tracking-tight">
                  Schedule A Viewing Or Request Pricing
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1.5 ml-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                      <input
                        required
                        type="text"
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1.5 ml-1">
                      Phone / WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                      <input
                        required
                        type="tel"
                        placeholder="0300 1234567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* CustomSelect Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1.5 ml-1">
                      Inquiry Requirement
                    </label>
                    <CustomSelect
                      value={form.purpose}
                      onChange={(val) => setForm({ ...form, purpose: val })}
                      options={purposeOptions}
                      icon={HelpCircle}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1.5 ml-1">
                      Preferred Tower
                    </label>
                    <CustomSelect
                      value={form.tower}
                      onChange={(val) => setForm({ ...form, tower: val })}
                      options={towerOptions}
                      icon={Building2}
                    />
                  </div>
                </div>

                {/* Additional Note */}
                <div>
                  <label className="text-[11px] font-black uppercase text-black block mb-1.5 ml-1">
                    Specific Requirements (Bedrooms, Floor, Sea View Preference)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter details e.g., Looking for 3 bed corner unit in Reef or Coral with clear ocean view on flexible terms."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8] transition-all"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black py-4 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#38bdf8]/25 transition-all active:scale-95 cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4" /> Send Direct Inquiry On WhatsApp
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
       © 2026 Emaar.PK Crescent Bay Property Advisory • {OWNER_NAME} ...
      </footer>
    </div>
  );
}