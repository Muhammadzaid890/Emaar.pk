'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';
import ListingSkeleton from '@/components/ListingSkeleton';
import { 
  Building2, PlusCircle, LayoutDashboard, Trash2, Edit3, 
  RefreshCw, LogOut, Lock, Mail, KeyRound, CheckCircle2, 
  Search, Star, ExternalLink, Eye, EyeOff, ArrowLeft, 
  AlertCircle, Upload, X, Layers, Activity, Video, Film, Loader2
} from 'lucide-react';
import { EMAAR_TOWERS, UNIT_TYPES } from '@/lib/constants';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('all');
  const [properties, setProperties] = useState([]);
  const [deletedProperties, setDeletedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const [editingId, setEditingId] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tower_name: EMAAR_TOWERS[0] || 'Coral Tower 1',
    unit_type: UNIT_TYPES[0] || 'Apartments',
    purpose: 'SALE',
    price_pkr: '',
    down_payment_pkr: '',
    monthly_installment_pkr: '',
    installment_duration: '3 Years (36 Months)',
    area_sqft: '',
    floor_number: 1,
    bedrooms: 2,
    bathrooms: 2,
    image_url: '',
    images: [],
    video_url: '',
    status: 'Available',
    is_featured: true,
  });

  const towerOptions = EMAAR_TOWERS.map(t => ({ value: t, label: t }));
  const unitOptions = UNIT_TYPES.map(u => ({ value: u, label: u }));
  const statusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Under Offer', label: 'Under Offer' },
    { value: 'Sold', label: 'Sold' },
  ];
useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('emaar_admin_session');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resActive = await fetch('/api/properties');
      const dataActive = await resActive.json();
      if (dataActive.success) setProperties(dataActive.properties || []);

      const resDeleted = await fetch('/api/properties?deleted=true');
      const dataDeleted = await resDeleted.json();
      if (dataDeleted.success) setDeletedProperties(dataDeleted.properties || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if (email.trim().toLowerCase() === 'admin@emaar.pk' && password === 'admin@zeeshan') {
      setIsAuthenticated(true);
      localStorage.setItem('emaar_admin_session', 'true');
    } else {
      setAuthError('Ghalat credentials! Email aur Password dobara check karein.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('emaar_admin_session');
    setEmail('');
    setPassword('');
  };

  // ================= CLOUDINARY UPLOAD HANDLERS =================
  const handleMultipleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingMedia(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) {
          alert(`${file.name} 15MB se badi hai, skip ho gayi.`);
          continue;
        }

        const bodyData = new FormData();
        bodyData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: bodyData,
        });
        const result = await res.json();

        if (result.success) {
          uploadedUrls.push(result.url);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        image_url: prev.image_url || uploadedUrls[0] || '',
      }));
    } catch (err) {
      alert('Photo upload error: ' + err.message);
    } finally {
      setUploadingMedia(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image_url: updated.length > 0 ? updated[0] : '',
      };
    });
  };

  const handleVideoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('Video 50MB se kam honi chahiye.');
      return;
    }

    setUploadingMedia(true);
    try {
      const bodyData = new FormData();
      bodyData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: bodyData,
      });
      const result = await res.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, video_url: result.url }));
      } else {
        throw new Error(result.error || 'Video upload failed');
      }
    } catch (err) {
      alert('Video upload error: ' + err.message);
    } finally {
      setUploadingMedia(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleToggleHome = async (id) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_featured' })
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (e) {
      alert('Error updating homepage status');
    }
  };

  const handleSoftDelete = async (id) => {
    if (!confirm('Yeh ad Deleted Ads folder me chala jayega. Confirm?')) return;
    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_delete' })
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (e) {
      alert('Error deleting ad');
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_delete' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Ad restored successfully!');
        fetchData();
      }
    } catch (e) {
      alert('Error restoring ad');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!confirm('WARNING: Yeh ad permanently delete ho jayega. Proceed?')) return;
    try {
      const res = await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert('Ad permanently deleted');
        fetchData();
      }
    } catch (e) {
      alert('Error in permanent delete');
    }
  };

  const handleEditClick = (prop) => {
    setEditingId(prop.id);
    setFormData({
      title: prop.title,
      description: prop.description || '',
      tower_name: prop.tower_name,
      unit_type: prop.unit_type,
      purpose: prop.purpose,
      price_pkr: prop.price_pkr,
      down_payment_pkr: prop.down_payment_pkr || '',
      monthly_installment_pkr: prop.monthly_installment_pkr || '',
      installment_duration: prop.installment_duration || '3 Years (36 Months)',
      area_sqft: prop.area_sqft,
      floor_number: prop.floor_number || 1,
      bedrooms: prop.bedrooms || 2,
      bathrooms: prop.bathrooms || 2,
      image_url: prop.image_url || '',
      images: Array.isArray(prop.images) ? prop.images : (prop.image_url ? [prop.image_url] : []),
      video_url: prop.video_url || '',
      status: prop.status || 'Available',
      is_featured: prop.is_featured,
    });
    setActiveTab('post');
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isEditing = Boolean(editingId);
      const url = '/api/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        id: editingId,
        price_pkr: Number(formData.price_pkr),
        down_payment_pkr: Number(formData.down_payment_pkr || 0),
        monthly_installment_pkr: Number(formData.monthly_installment_pkr || 0),
        installment_duration: formData.purpose === 'BOOKING' ? formData.installment_duration : '',
        area_sqft: Number(formData.area_sqft),
        floor_number: Number(formData.floor_number),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        image_url: formData.images.length > 0 ? formData.images[0] : formData.image_url,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert(isEditing ? 'Ad Updated Successfully!' : 'Ad Published Successfully!');
        setEditingId(null);
        setFormData({
          title: '',
          description: '',
          tower_name: EMAAR_TOWERS[0],
          unit_type: UNIT_TYPES[0],
          purpose: 'SALE',
          price_pkr: '',
          down_payment_pkr: '',
          monthly_installment_pkr: '',
          installment_duration: '3 Years (36 Months)',
          area_sqft: '',
          floor_number: 1,
          bedrooms: 2,
          bathrooms: 2,
          image_url: '',
          images: [],
          video_url: '',
          status: 'Available',
          is_featured: true,
        });
        fetchData();
        setActiveTab('all');
      } else {
        alert('Database Error: ' + data.error);
      }
    } catch (e) {
      alert('Failed to save ad: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.tower_name?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans">
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />

        <div className="relative z-10 bg-white/95 backdrop-blur-2xl rounded-[32px] max-w-md w-full p-8 sm:p-10 shadow-2xl border border-white/60 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-sky-50 text-[#38bdf8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-black uppercase tracking-tight">
            Emaar.PK Admin Portal
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 mb-6">
            Sadaf Estate Official Management
          </p>

          {authError && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 text-left flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-black block mb-1.5 ml-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5 pointer-events-none" />
                <input 
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8] transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-black block mb-1.5 ml-1">
                Security Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-3.5 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8] transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-600 hover:text-black p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#38bdf8]/30 active:scale-95 cursor-pointer mt-4"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-black uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#38bdf8]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2">
              Emaar.PK <span className="text-[#38bdf8]">Admin Center</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Signed in as admin@emaar.pk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-black text-black bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full uppercase transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full uppercase transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-fit space-y-2">
          <div className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('all'); setEditingId(null); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-[#38bdf8] text-white shadow-md' : 'text-black hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> All Active Ads
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{properties.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('post'); setEditingId(null); }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'post' ? 'bg-[#38bdf8] text-white shadow-md' : 'text-black hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" /> {editingId ? 'Edit Ad' : 'Post New Ad'}
            </button>

            <button
              onClick={() => { setActiveTab('deleted'); setEditingId(null); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'deleted' ? 'bg-red-500 text-white shadow-md' : 'text-black hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Deleted Ads
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{deletedProperties.length}</span>
            </button>
          </div>

          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-center">
            <span className="text-[10px] font-black text-[#0284c7] uppercase block">Placement Control</span>
            <span className="text-[11px] font-bold text-slate-700">Ad direct Sale, Rent ya Booking section me jayega.</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[500px]">
          
          {/* TAB 1: ALL ACTIVE ADS */}
          {activeTab === 'all' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">Active Property Ads</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Total {properties.length} Verified Properties Live
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-black absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by title / tower..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              {loading ? (
                <ListingSkeleton count={4} />
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs font-black text-black uppercase tracking-wider">No active ads found.</p>
                  <button
                    onClick={() => setActiveTab('post')}
                    className="bg-[#38bdf8] text-white font-black px-4 py-2 rounded-full text-xs uppercase cursor-pointer"
                  >
                    Post First Ad
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredProperties.map((prop) => (
                    <div key={prop.id} className="py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/60 p-2 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prop.image_url || (Array.isArray(prop.images) && prop.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80'} 
                          alt="" 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase text-[#38bdf8] bg-sky-50 px-2 py-0.5 rounded">
                              {prop.tower_name}
                            </span>
                            <span className="text-[10px] font-black uppercase text-black bg-slate-100 px-2 py-0.5 rounded">
                              {prop.purpose}
                            </span>
                            {prop.video_url && (
                              <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Film className="w-3 h-3" /> Video
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-black uppercase">{prop.title}</h4>
                          <span className="text-xs font-black text-black">
                            PKR {Number(prop.price_pkr).toLocaleString()} • {prop.area_sqft} sqft • {prop.bedrooms} Bed
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end lg:self-center">
                        <button
                          onClick={() => handleToggleHome(prop.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                            prop.is_featured 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${prop.is_featured ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                          {prop.is_featured ? 'On Home' : 'Hidden'}
                        </button>

                        <button
                          onClick={() => handleEditClick(prop)}
                          className="p-2 text-black hover:text-[#38bdf8] bg-slate-100 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleSoftDelete(prop.id)}
                          className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POST / EDIT AD */}
          {activeTab === 'post' && (
            <div>
              <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">
                    {editingId ? 'Edit Property Ad' : 'Post New Emaar Ad'}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    {editingId ? `Editing Ad ID #${editingId}` : 'Select placement, media & details'}
                  </p>
                </div>
                {editingId && (
                  <button
                    onClick={() => { setEditingId(null); setActiveTab('all'); }}
                    className="text-xs font-black text-red-600 hover:underline uppercase cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-5 max-w-2xl">
                
                {/* 1. Placement */}
                <div>
                  <label className="text-[11px] font-black uppercase text-black block mb-2">
                    Ad Placement Section
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'SALE', label: 'For Sale' },
                      { id: 'RENT', label: 'For Rent' },
                      { id: 'BOOKING', label: 'Booking Plan' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setFormData({ ...formData, purpose: item.id })}
                        className={`py-3 px-2 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          formData.purpose === item.id
                            ? 'border-[#38bdf8] bg-sky-50 text-black shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${formData.purpose === item.id ? 'text-[#38bdf8]' : 'opacity-0'}`} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Title */}
                <div>
                  <label className="text-[11px] font-black uppercase text-black block mb-1">
                    Ad Listing Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter ad listing title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                  />
                </div>

                {/* 3. Description Input */}
                <div>
                  <label className="text-[11px] font-black uppercase text-black block mb-1">
                    Property Description & Key Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter complete description (ocean view, modern fittings, car parking, amenities, payment terms etc.)..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8] leading-relaxed"
                  />
                </div>

                {/* 4. Tower & Unit Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1.5">Tower Name</label>
                    <CustomSelect
                      value={formData.tower_name}
                      onChange={(val) => setFormData({ ...formData, tower_name: val })}
                      options={towerOptions}
                      icon={Building2}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1.5">Unit Category</label>
                    <CustomSelect
                      value={formData.unit_type}
                      onChange={(val) => setFormData({ ...formData, unit_type: val })}
                      options={unitOptions}
                      icon={Layers}
                    />
                  </div>
                </div>

                {/* 5. Booking Financial Details */}
                {formData.purpose === 'BOOKING' ? (
                  <div className="p-4 bg-sky-50/70 border-2 border-sky-200 rounded-2xl space-y-3">
                    <span className="text-[11px] font-black uppercase text-[#0284c7] block">
                      Booking & Installment Plan Details
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-black block mb-1">Total Demand (PKR)</label>
                        <input
                          required
                          type="number"
                          placeholder="Total price"
                          value={formData.price_pkr}
                          onChange={(e) => setFormData({ ...formData, price_pkr: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-black block mb-1">Down Payment (PKR)</label>
                        <input
                          required
                          type="number"
                          placeholder="Down payment"
                          value={formData.down_payment_pkr}
                          onChange={(e) => setFormData({ ...formData, down_payment_pkr: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-black block mb-1">Monthly Installment</label>
                        <input
                          required
                          type="number"
                          placeholder="Monthly installment"
                          value={formData.monthly_installment_pkr}
                          onChange={(e) => setFormData({ ...formData, monthly_installment_pkr: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-black block mb-1">Tenure / Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Years (36 Months)"
                        value={formData.installment_duration}
                        onChange={(e) => setFormData({ ...formData, installment_duration: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1">
                      {formData.purpose === 'RENT' ? 'Rent Demand (PKR / Month)' : 'Sale Demand Price (PKR)'}
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter price in PKR"
                      value={formData.price_pkr}
                      onChange={(e) => setFormData({ ...formData, price_pkr: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                )}

                {/* 6. Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1">Area (Sq. Ft)</label>
                    <input
                      required
                      type="number"
                      placeholder="Area in sqft"
                      value={formData.area_sqft}
                      onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block mb-1">Floor No.</label>
                    <input
                      type="number"
                      value={formData.floor_number}
                      onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="text-[11px] font-black uppercase text-black block mb-1.5">Availability Status</label>
                  <CustomSelect
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    options={statusOptions}
                    icon={Activity}
                  />
                </div>

                {/* ================= 7. CLOUDINARY MULTIPLE IMAGES UPLOAD ================= */}
                <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-black uppercase text-black block">
                        Property Images (Cloudinary CDN)
                      </label>
                      <span className="text-[10px] text-slate-500 font-bold">
                        Browse multiple photos — automatic fast CDN hosting
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#0284c7] bg-sky-100 px-2.5 py-0.5 rounded-full">
                      {formData.images.length} Selected
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      multiple
                      disabled={uploadingMedia}
                      onChange={handleMultipleImages}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingMedia}
                      onClick={() => imageInputRef.current?.click()}
                      className="bg-black hover:bg-slate-800 disabled:bg-slate-400 text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                    >
                      {uploadingMedia ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> Uploading to Cloudinary...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#38bdf8]" /> + Select Multiple Photos
                        </>
                      )}
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative h-20 rounded-xl overflow-hidden border-2 border-sky-300 group">
                          <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ================= 8. CLOUDINARY VIDEO UPLOAD ================= */}
                <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-black block">
                      Property Video (Walkthrough / Sea View Tour)
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold">
                      Upload video clip direct to Cloudinary or paste web link
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="file"
                      ref={videoInputRef}
                      accept="video/*"
                      disabled={uploadingMedia}
                      onChange={handleVideoFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingMedia}
                      onClick={() => videoInputRef.current?.click()}
                      className="bg-black hover:bg-slate-800 disabled:bg-slate-400 text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm flex-shrink-0"
                    >
                      {uploadingMedia ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" /> Uploading Video...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 text-[#38bdf8]" /> Browse Video File
                        </>
                      )}
                    </button>

                    <input
                      type="url"
                      placeholder="Or paste external video link (MP4, YouTube, Vimeo)"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
                    />
                  </div>

                  {formData.video_url && (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-sky-300 max-h-48 bg-black mt-2">
                      <video src={formData.video_url} controls className="w-full max-h-48 object-contain" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, video_url: '' })}
                        className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 9. Show on Home Page Switch */}
                <div className="p-3.5 bg-sky-50 border-2 border-sky-100 rounded-2xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured_checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-[#38bdf8] rounded cursor-pointer"
                  />
                  <label htmlFor="featured_checkbox" className="text-xs font-black uppercase text-black cursor-pointer">
                    Show on Home Page (Promoted / Featured Listing)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || uploadingMedia}
                  className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:bg-slate-400 text-white font-black py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#38bdf8]/30 active:scale-95 cursor-pointer mt-2"
                >
                  {loading ? 'Processing Database...' : (editingId ? 'Save & Update Ad' : 'Publish Ad Now')}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: DELETED ADS */}
          {activeTab === 'deleted' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Deleted Property Ads</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Restore deleted ads back to live inventory or purge permanently.
                </p>
              </div>

              {deletedProperties.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-black text-black uppercase tracking-wider">
                    Bin is clean! No deleted ads.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {deletedProperties.map((prop) => (
                    <div key={prop.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded">
                            Deleted
                          </span>
                          <span className="text-[10px] font-black uppercase text-black">
                            {prop.tower_name} • {prop.purpose}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-black line-through uppercase">{prop.title}</h4>
                        <span className="text-xs font-black text-black">
                          PKR {Number(prop.price_pkr).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestore(prop.id)}
                          className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(prop.id)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-black px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Purge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}