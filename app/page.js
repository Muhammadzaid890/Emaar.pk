'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ExploreTabs from '@/components/ExploreTabs';
import AdminModal from '@/components/AdminModal';
import { Home, Key, Building2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties || []);
      }
    } catch (e) {
      console.error('Failed to load listings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (criteria) => {
    const targetId = 'explore-properties';
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabSelect = () => {
    const el = document.getElementById('explore-properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const categoryCards = [
    {
      key: 'SALE',
      href: '/sale',
      title: 'PROPERTIES FOR SALE',
      subtitle: 'Luxury seafront apartments, penthouses & villas',
      icon: Home,
      count: properties.filter(p => p.purpose === 'SALE').length
    },
    {
      key: 'RENT',
      href: '/rent',
      title: 'PROPERTIES FOR RENT',
      subtitle: 'Verified beachfront residential & corporate rentals',
      icon: Key,
      count: properties.filter(p => p.purpose === 'RENT').length
    },
    {
      key: 'BOOKING',
      href: '/booking',
      title: 'NEW PROJECTS & BOOKING',
      subtitle: 'Pre-launch towers & flexible installment plans',
      icon: Building2,
      count: properties.filter(p => p.purpose === 'BOOKING').length
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar onLoginClick={() => setAdminOpen(true)} />
      
      {/* Hero Section Container */}
      <div className="relative z-30 overflow-visible">
        <HeroSection onSearch={handleSearch} />
      </div>

      {/* Tabs Container */}
      <div className="relative z-10">
        <ExploreTabs onSelectCategory={handleTabSelect} />
      </div>

      {/* Explore Properties Section (Full Width Aligned) */}
      <section id="explore-properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        <div className="mb-5 sm:mb-7">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-950">
            Explore Properties
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Select a category below to browse all verified listings on Emaar.pk
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {categoryCards.map((cat) => {
            const IconComponent = cat.icon;

            return (
              <Link
                key={cat.key}
                href={cat.href}
                className="group block w-full bg-[#e8f1f8] hover:bg-[#dce9f5] border border-sky-200/80 hover:border-[#38bdf8] rounded-2xl p-3.5 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-5">
                  
                  {/* Left: Dark Slate Icon Box + Title & Subtitle */}
                  <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#0f172a] group-hover:bg-[#0284c7] flex items-center justify-center flex-shrink-0 shadow-sm transition-colors duration-200">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#38bdf8] group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-lg md:text-xl font-black text-[#0f172a] group-hover:text-[#0284c7] tracking-tight uppercase truncate transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-slate-600 font-medium mt-0.5 line-clamp-1">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Theme-matched Ads Count Pill + Arrow */}
                  <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
                    <span className="bg-[#0f172a] text-[#38bdf8] font-black text-[11px] sm:text-xs px-3 py-1 sm:px-4 sm:py-1.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                      {loading ? '...' : `${cat.count} Ads`}
                    </span>

                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 group-hover:bg-[#38bdf8] text-slate-700 group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Admin Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onPropertyAdded={fetchProperties}
      />
    </div>
  );
}