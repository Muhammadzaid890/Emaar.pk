'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ListingSkeleton from '@/components/ListingSkeleton';
import { EMAAR_TOWERS } from '@/lib/constants';
import { 
  Building2, MessageSquare, Phone, Bed, Bath, 
  Maximize2, MapPin, ChevronDown, ChevronUp, X, 
  ChevronLeft, ChevronRight, CheckCircle2, UserCheck
} from 'lucide-react';

const OWNER_NAME = "Zeeshan Khursheed";
const ESTATE_NAME = "Sadaf Estate";
const PHONE_NUMBER = "03331234201";

export default function SalePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTowers, setOpenTowers] = useState({});

  // Detail Modal State
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    async function loadSaleData() {
      try {
        setLoading(true);
        const res = await fetch('/api/properties?intent=SALE');
        const data = await res.json();
        if (data.success) {
          setProperties(data.properties || []);
          // By default, open towers with active ads
          const initialOpen = {};
          EMAAR_TOWERS.forEach(t => {
            const hasAds = (data.properties || []).some(p => p.tower_name === t);
            if (hasAds) initialOpen[t] = true;
          });
          setOpenTowers(initialOpen);
        }
      } catch (err) {
        console.error('Sale fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaleData();
  }, []);

  const toggleTower = (towerName) => {
    setOpenTowers(prev => ({
      ...prev,
      [towerName]: !prev[towerName]
    }));
  };

  const formatPrice = (pkr) => {
    if (!pkr) return 'Demand on Call';
    if (pkr >= 10000000) return `PKR ${(pkr / 10000000).toFixed(2)} Crore`;
    if (pkr >= 100000) return `PKR ${(pkr / 100000).toFixed(2)} Lac`;
    return `PKR ${Number(pkr).toLocaleString()}`;
  };

  const getAdImages = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) return item.images;
    if (item.image_url) return [item.image_url];
    return ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];
  };

  const openModal = (item) => {
    setSelectedAd(item);
    setCurrentImgIndex(0);
  };

  const closeModal = () => {
    setSelectedAd(null);
    setCurrentImgIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 inline-block">
            Verified Inventory Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
            Emaar Crescent Bay Karachi — Towers Sale Directory
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Tower-wise verified units managed directly by {OWNER_NAME} ({ESTATE_NAME})
          </p>
        </div>
      </section>

      {/* Main Accordion Listing Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-4">
        {loading ? (
          <ListingSkeleton count={4} />
        ) : (
          EMAAR_TOWERS.map((towerName) => {
            const towerAds = properties.filter(p => p.tower_name === towerName);
            const isOpen = Boolean(openTowers[towerName]);

            return (
              <div key={towerName} className="space-y-2">
                {/* Tower Strip (Exactly like user sample) */}
                <button
                  type="button"
                  onClick={() => toggleTower(towerName)}
                  className="w-full bg-[#e8f1f8] hover:bg-[#dce9f5] border border-sky-100/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-sm transition-all cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Ads Count Badge */}
                    <span className="bg-[#0f172a] text-[#fcd34d] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center">
                      {towerAds.length} Ads
                    </span>
                    {/* Tower Name */}
                    <span className="text-sm sm:text-base font-black text-[#0f172a] uppercase tracking-wide">
                      {towerName}
                    </span>
                  </div>

                  <div className="text-slate-600 p-1">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-800 transition-transform" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-800 transition-transform" />
                    )}
                  </div>
                </button>

                {/* Expanded Ads List */}
                {isOpen && (
                  <div className="pl-2 sm:pl-4 space-y-2.5 pt-1">
                    {towerAds.length === 0 ? (
                      <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-xs font-bold text-slate-400 uppercase text-center">
                        Is tower me filhal koi live ad available nahi hai.
                      </div>
                    ) : (
                      towerAds.map((ad) => (
                        <div
                          key={ad.id}
                          onClick={() => openModal(ad)}
                          className="bg-white border border-slate-200 hover:border-[#38bdf8] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md cursor-pointer group"
                        >
                          {/* Ad Left Content */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-[#38bdf8] bg-sky-50 px-2 py-0.5 rounded">
                                {ad.unit_type}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                Floor {ad.floor_number || 1}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase group-hover:text-[#0284c7] transition-colors">
                              {ad.title}
                            </h3>

                            {/* Admin & Consultant Badge */}
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                              <UserCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                              <span>Admin: {OWNER_NAME} ({ESTATE_NAME})</span>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5 text-slate-400" /> {ad.bedrooms || 2} Bed
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5 text-slate-400" /> {ad.bathrooms || 2} Bath
                              </span>
                              <span className="flex items-center gap-1">
                                <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {ad.area_sqft} Sq. Ft
                              </span>
                            </div>
                          </div>

                          {/* Ad Right Side (Price, WhatsApp, Call) */}
                          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Demand</span>
                              <span className="text-base sm:text-lg font-black text-slate-950">
                                {formatPrice(ad.price_pkr)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`https://wa.me/923331234201?text=AOA%20Zeeshan%20Bhai,%20I%20am%20inquiring%20about%20${encodeURIComponent(ad.title)}%20(${encodeURIComponent(ad.tower_name)}).`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                              </a>
                              <a
                                href={`tel:${PHONE_NUMBER}`}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
                              >
                                <Phone className="w-3.5 h-3.5" /> Call
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {/* ================= DETAIL MODAL POPUP ================= */}
      {selectedAd && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-auto">
            
            {/* Close (X) Icon */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-black/75 hover:bg-black text-white p-2.5 rounded-full transition-transform active:scale-90 cursor-pointer shadow-lg"
              title="Close Ad"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Slider */}
            <div className="relative w-full h-64 sm:h-96 bg-black select-none">
              {getAdImages(selectedAd).length > 0 && (
                <img
                  src={getAdImages(selectedAd)[currentImgIndex]}
                  alt={selectedAd.title}
                  className="w-full h-full object-cover"
                />
              )}

              {getAdImages(selectedAd).length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex(prev => (prev - 1 + getAdImages(selectedAd).length) % getAdImages(selectedAd).length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImgIndex(prev => (prev + 1) % getAdImages(selectedAd).length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentImgIndex + 1} / {getAdImages(selectedAd).length} Photos
                  </span>
                </>
              )}
            </div>

            {/* Modal Body: Title, Description, Location, Price, Actions */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#38bdf8] bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {selectedAd.tower_name}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                  {selectedAd.unit_type}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded">
                  Floor {selectedAd.floor_number || 1}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {selectedAd.title}
              </h2>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <MapPin className="w-4 h-4 text-[#38bdf8]" /> Crescent Bay, DHA Phase 8, Karachi, Pakistan
              </div>

              {/* Admin Attribution */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center gap-2 text-xs font-black text-slate-800">
                <UserCheck className="w-4 h-4 text-[#38bdf8]" />
                <span>Verified Direct Listing by {OWNER_NAME} ({ESTATE_NAME})</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Bedrooms</span>
                  <span className="text-sm font-black text-slate-900">{selectedAd.bedrooms || 2} Bed</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Bathrooms</span>
                  <span className="text-sm font-black text-slate-900">{selectedAd.bathrooms || 2} Bath</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Area Size</span>
                  <span className="text-sm font-black text-slate-900">{selectedAd.area_sqft} Sq. Ft</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 pt-1">
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider block">Description</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedAd.description || `Prime property located at ${selectedAd.tower_name}, Crescent Bay, DHA Phase 8 Karachi. Offering panoramic views, modern finishes, 3-tier security, and private parking.`}
                </p>
              </div>

              {/* Price & Action Strip */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Demand Price</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-950">
                    {formatPrice(selectedAd.price_pkr)}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="flex-1 sm:flex-none h-11 px-5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a
                    href={`https://wa.me/923331234201?text=AOA%20Zeeshan%20Bhai,%20I%20am%20inquiring%20about%20${encodeURIComponent(selectedAd.title)}%20(${encodeURIComponent(selectedAd.tower_name)}).`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none h-11 px-5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}