'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EMAAR_TOWERS } from '@/lib/constants';
import {
  Building2, Shield, Users, PlusCircle, LayoutDashboard,
  Eye, MessageSquare, Phone, Trash2, LogOut, CheckCircle,
  Upload, Lock, Mail, UserPlus, ArrowLeft, RefreshCw,
  Settings, Camera, Menu, X, User
} from 'lucide-react';

export default function DashboardPage() {
  // Auth State
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sidebar & Navigation Tabs ('OVERVIEW', 'ADS', 'POST_AD', 'LEADS', 'AGENTS', 'SETTINGS')
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data States
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [purposeFilter, setPurposeFilter] = useState('ALL');

  // Post Ad Form State
  const [adForm, setAdForm] = useState({
    title: '',
    purpose: 'SALE',
    tower_name: EMAAR_TOWERS[0] || 'The Views Tower 1',
    unit_type: 'Apartments',
    price_pkr: '',
    down_payment: '',
    monthly_installment: '',
    tenure: '',
    area_sqft: '',
    bedrooms: '3',
    bathrooms: '3',
    floor_number: '10',
    description: '',
    images: [],
    is_featured: true,
  });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [submittingAd, setSubmittingAd] = useState(false);

  // New Agent Form State (For Admin)
  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [creatingAgent, setCreatingAgent] = useState(false);

  // Profile Settings Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    newPassword: '',
    profile_image: '',
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Load Saved Session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('emaar_portal_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setProfileForm({
            name: parsed.name || '',
            phone: parsed.phone || '',
            newPassword: '',
            profile_image: parsed.profile_image || '',
          });
        } catch (e) {
          localStorage.removeItem('emaar_portal_user');
        }
      }
    }
  }, []);

  // Load Dashboard Data
  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        newPassword: '',
        profile_image: user.profile_image || '',
      });
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const propRes = await fetch('/api/properties');
      const propData = await propRes.json();
      if (propData.success) {
        const allProps = propData.properties || [];
        if (user.role === 'AGENT') {
          setProperties(allProps.filter((p) => Number(p.agent_id) === Number(user.id)));
        } else {
          setProperties(allProps);
        }
      }

      const leadsUrl = user.role === 'AGENT' ? `/api/leads?agentId=${user.id}` : '/api/leads';
      const leadsRes = await fetch(leadsUrl);
      const leadsData = await leadsRes.json();
      if (leadsData.success) {
        setLeads(leadsData.leads || []);
      }

      if (user.role === 'ADMIN') {
        const agentRes = await fetch('/api/agents');
        const agentData = await agentRes.json();
        if (agentData.success) {
          setAgents(agentData.agents || []);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('emaar_portal_user', JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.name}!`);
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setAuthError('Network error while logging in.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('emaar_portal_user');
    setActiveTab('OVERVIEW');
  };

  // Property Image Upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingImg(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }
      setAdForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      showToast(`${uploadedUrls.length} photo(s) uploaded!`);
    } catch (err) {
      showToast('Image upload failed.');
    } finally {
      setUploadingImg(false);
    }
  };

  // Profile Picture Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setProfileForm((prev) => ({ ...prev, profile_image: data.url }));
        showToast('Profile photo ready! Click Save Changes.');
      }
    } catch (err) {
      showToast('Failed to upload profile photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save Profile Settings
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/agents/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: profileForm.name,
          phone: profileForm.phone,
          password: profileForm.newPassword,
          profile_image: profileForm.profile_image,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('emaar_portal_user', JSON.stringify(data.user));
        setProfileForm((prev) => ({ ...prev, newPassword: '' }));
        showToast('Profile updated successfully!');
      } else {
        showToast(data.error || 'Failed to update profile');
      }
    } catch (err) {
      showToast('Network error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Publish New Ad
  const handlePostAd = async (e) => {
    e.preventDefault();
    setSubmittingAd(true);
    try {
      const payload = {
        ...adForm,
        price_pkr: Number(adForm.price_pkr) || 0,
        down_payment: Number(adForm.down_payment) || 0,
        monthly_installment: Number(adForm.monthly_installment) || 0,
        area_sqft: Number(adForm.area_sqft) || 0,
        bedrooms: Number(adForm.bedrooms) || 2,
        bathrooms: Number(adForm.bathrooms) || 2,
        floor_number: Number(adForm.floor_number) || 1,
        image_url: adForm.images[0] || '',
        agent_id: user.id,
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Property published successfully!');
        setAdForm({
          title: '',
          purpose: 'SALE',
          tower_name: EMAAR_TOWERS[0] || 'The Views Tower 1',
          unit_type: 'Apartments',
          price_pkr: '',
          down_payment: '',
          monthly_installment: '',
          tenure: '',
          area_sqft: '',
          bedrooms: '3',
          bathrooms: '3',
          floor_number: '10',
          description: '',
          images: [],
          is_featured: true,
        });
        await fetchDashboardData();
        setActiveTab('ADS');
      } else {
        showToast(data.error || 'Failed to publish property');
      }
    } catch (err) {
      showToast('Network error saving listing.');
    } finally {
      setSubmittingAd(false);
    }
  };

  // Delete Property
  const handleDeleteAd = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Listing deleted.');
        fetchDashboardData();
      }
    } catch (err) {
      showToast('Error deleting listing.');
    }
  };

  // Create New Agent (Admin Only)
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setCreatingAgent(true);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Agent ${agentForm.name} created!`);
        setAgentForm({ name: '', email: '', password: '', phone: '' });
        fetchDashboardData();
      } else {
        showToast(data.error || 'Failed to create agent');
      }
    } catch (err) {
      showToast('Network error creating agent.');
    } finally {
      setCreatingAgent(false);
    }
  };

  // Delete Agent (Admin Only)
  const handleDeleteAgent = async (id) => {
    if (!confirm('Remove this agent account?')) return;
    try {
      const res = await fetch(`/api/agents?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Agent removed.');
        fetchDashboardData();
      }
    } catch (err) {
      showToast('Error deleting agent.');
    }
  };

  // ================= LIGHT WATER BLUE LOGIN SCREEN =================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#e8f1f8] flex items-center justify-center p-4 font-sans text-black">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-sky-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#e8f1f8] border border-sky-200 text-[#0284c7] flex items-center justify-center mx-auto shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              Emaar.pk Portal Login
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              Sign in as Administrator or Registered Agent
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-xl text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="example@emaar.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-sky-200 text-sm text-black font-semibold focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-black mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-sky-200 text-sm text-black font-semibold focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#38bdf8] hover:bg-[#0284c7] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Login to Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-bold text-slate-600 hover:text-black inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= METRICS & SIDEBAR ITEMS =================
  const isAdmin = user.role === 'ADMIN';
  const saleCount = properties.filter((p) => p.purpose === 'SALE').length;
  const rentCount = properties.filter((p) => p.purpose === 'RENT').length;
  const bookingCount = properties.filter((p) => p.purpose === 'BOOKING').length;
  const totalViews = properties.reduce((acc, p) => acc + (Number(p.views_count) || 0), 0);
  const totalWhatsapp = properties.reduce((acc, p) => acc + (Number(p.whatsapp_clicks) || 0), 0);
  const totalCalls = properties.reduce((acc, p) => acc + (Number(p.call_clicks) || 0), 0);

  const filteredProperties =
    purposeFilter === 'ALL'
      ? properties
      : properties.filter((p) => p.purpose === purposeFilter);

  const sidebarItems = [
    { id: 'OVERVIEW', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'ADS', label: isAdmin ? 'All Ads' : 'My Ads', icon: Building2, badge: properties.length },
    { id: 'POST_AD', label: 'Post New Ad', icon: PlusCircle },
    { id: 'LEADS', label: isAdmin ? 'All Leads' : 'My Leads', icon: MessageSquare, badge: leads.length },
    ...(isAdmin ? [{ id: 'AGENTS', label: 'Agents Management', icon: Users, badge: agents.length }] : []),
    { id: 'SETTINGS', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f4f9fd] text-black font-sans flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-white text-black px-5 py-3 rounded-2xl shadow-xl text-xs font-black flex items-center gap-2 border-2 border-[#38bdf8]">
          <CheckCircle className="w-4 h-4 text-[#0284c7]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-sky-200 px-4 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#e8f1f8] text-[#0284c7] flex items-center justify-center font-black border border-sky-200">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-black text-base text-black">
            EMAAR<span className="text-[#0284c7]">.PK</span>
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-[#e8f1f8] text-black cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ================= LEFT SIDEBAR (LIGHT WATER BLUE & WHITE) ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-sky-200 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between pb-4 border-b border-sky-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f1f8] border border-sky-200 text-[#0284c7] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg text-black tracking-tight block leading-none">
                  EMAAR<span className="text-[#0284c7]">.PK</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {isAdmin ? 'Admin Portal' : 'Agent Portal'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Agent / Admin Profile Card inside Sidebar */}
          <div className="bg-[#e8f1f8] border border-sky-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white text-[#0284c7] font-black text-base flex items-center justify-center border border-sky-200 flex-shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-black text-black truncate">{user.name}</p>
              <p className="text-[11px] font-bold text-slate-600 truncate">{user.phone}</p>
              <span className="inline-block mt-1 text-[9px] font-black uppercase bg-white text-[#0284c7] px-2 py-0.5 rounded-full border border-sky-200">
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#38bdf8] text-white shadow-sm'
                      : 'text-black hover:bg-[#e8f1f8]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0284c7]'}`} />
                    {item.label}
                  </span>
                  {typeof item.badge === 'number' && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive ? 'bg-white text-[#0284c7]' : 'bg-[#e8f1f8] text-black'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions (Live Site & Logout) */}
        <div className="p-5 border-t border-sky-100 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#e8f1f8] hover:bg-sky-100 text-black font-black text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0284c7]" /> Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        
        {/* Top Page Heading */}
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Welcome, {user.name} — Manage your listings, performance & account settings.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('POST_AD')}
            className="bg-[#38bdf8] hover:bg-[#0284c7] text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" /> Post New Ad
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Sale / Rent / Booking Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-sky-200/80 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Properties For Sale</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-black text-black">{saleCount}</span>
                  <span className="text-xs font-black text-[#0284c7] bg-[#e8f1f8] px-3 py-1 rounded-full">Sale</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-200/80 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Properties For Rent</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-black text-black">{rentCount}</span>
                  <span className="text-xs font-black text-[#0284c7] bg-[#e8f1f8] px-3 py-1 rounded-full">Rent</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-200/80 shadow-xs">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Booking Projects</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-black text-black">{bookingCount}</span>
                  <span className="text-xs font-black text-[#0284c7] bg-[#e8f1f8] px-3 py-1 rounded-full">Booking</span>
                </div>
              </div>
            </div>

            {/* Views, WhatsApp Clicks & Call Clicks (Light Water Blue Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#e8f1f8] border border-sky-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black uppercase">Total Ad Views</span>
                  <div className="w-9 h-9 rounded-xl bg-white text-[#0284c7] flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-black mt-2">{totalViews.toLocaleString()}</p>
                <p className="text-[11px] font-semibold text-slate-600 mt-1">Total visitor impressions</p>
              </div>

              <div className="bg-[#e8f1f8] border border-sky-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black uppercase">WhatsApp Clicks</span>
                  <div className="w-9 h-9 rounded-xl bg-white text-[#0284c7] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-black mt-2">{totalWhatsapp.toLocaleString()}</p>
                <p className="text-[11px] font-semibold text-slate-600 mt-1">Direct buyer chat leads</p>
              </div>

              <div className="bg-[#e8f1f8] border border-sky-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black uppercase">Phone Call Clicks</span>
                  <div className="w-9 h-9 rounded-xl bg-white text-[#0284c7] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-black mt-2">{totalCalls.toLocaleString()}</p>
                <p className="text-[11px] font-semibold text-slate-600 mt-1">Direct phone call inquiries</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ALL ADS / MY ADS ================= */}
        {activeTab === 'ADS' && (
          <div className="bg-white rounded-3xl border border-sky-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-black text-black uppercase">
                {isAdmin ? 'All Published Properties' : 'My Published Properties'}
              </h2>

              <div className="flex items-center gap-1.5 bg-[#e8f1f8] p-1 rounded-xl">
                {['ALL', 'SALE', 'RENT', 'BOOKING'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPurposeFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      purposeFilter === tab
                        ? 'bg-[#38bdf8] text-white shadow-xs'
                        : 'text-black hover:bg-white/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-bold">
                No listings found in this category.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#e8f1f8] text-black uppercase font-black border-b border-sky-200">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Purpose</th>
                      <th className="py-3 px-4">Tower</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4">WA / Calls</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {filteredProperties.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f4f9fd]">
                        <td className="py-3.5 px-4 font-black text-black">{item.title}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-[#e8f1f8] text-[#0284c7] px-2.5 py-1 rounded-md font-black text-[10px]">
                            {item.purpose}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">{item.tower_name}</td>
                        <td className="py-3.5 px-4 font-black text-black">{item.views_count || 0}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {item.whatsapp_clicks || 0} WA / {item.call_clicks || 0} Call
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteAd(item.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete Ad"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: POST NEW AD ================= */}
        {activeTab === 'POST_AD' && (
          <div className="bg-white rounded-3xl border border-sky-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-black uppercase mb-6">
              Post New Property Listing
            </h2>

            <form onSubmit={handlePostAd} className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {['SALE', 'RENT', 'BOOKING'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setAdForm({ ...adForm, purpose: p })}
                    className={`py-3 rounded-xl text-xs font-black uppercase border transition-all cursor-pointer ${
                      adForm.purpose === p
                        ? 'bg-[#38bdf8] text-white border-[#38bdf8] shadow-xs'
                        : 'bg-[#e8f1f8] text-black border-sky-200'
                    }`}
                  >
                    {p === 'BOOKING' ? 'Booking Plan' : `For ${p}`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Ad Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3-Bed Seafront Luxury Apartment"
                    value={adForm.title}
                    onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Tower Name</label>
                  <select
                    value={adForm.tower_name}
                    onChange={(e) => setAdForm({ ...adForm, tower_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold bg-white"
                  >
                    {EMAAR_TOWERS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    {adForm.purpose === 'RENT' ? 'Monthly Rent (PKR)' : 'Total Demand (PKR)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 95000000"
                    value={adForm.price_pkr}
                    onChange={(e) => setAdForm({ ...adForm, price_pkr: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Area (Sq. Ft)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2450"
                    value={adForm.area_sqft}
                    onChange={(e) => setAdForm({ ...adForm, area_sqft: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Floor Number</label>
                  <input
                    type="number"
                    placeholder="e.g. 14"
                    value={adForm.floor_number}
                    onChange={(e) => setAdForm({ ...adForm, floor_number: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>
              </div>

              {adForm.purpose === 'BOOKING' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#e8f1f8] rounded-2xl border border-sky-200">
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Down Payment (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 20000000"
                      value={adForm.down_payment}
                      onChange={(e) => setAdForm({ ...adForm, down_payment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Monthly Installment</label>
                    <input
                      type="number"
                      placeholder="e.g. 1600000"
                      value={adForm.monthly_installment}
                      onChange={(e) => setAdForm({ ...adForm, monthly_installment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Duration / Tenure</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 Years (36 Months)"
                      value={adForm.tenure}
                      onChange={(e) => setAdForm({ ...adForm, tenure: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={adForm.bedrooms}
                    onChange={(e) => setAdForm({ ...adForm, bedrooms: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={adForm.bathrooms}
                    onChange={(e) => setAdForm({ ...adForm, bathrooms: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">Property Photos</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-sky-300 hover:border-[#38bdf8] rounded-2xl p-5 cursor-pointer bg-[#f4f9fd]">
                  <Upload className="w-5 h-5 text-[#0284c7]" />
                  <span className="text-xs font-black text-black">
                    {uploadingImg ? 'Uploading to Cloudinary...' : 'Click to Upload Multiple Images'}
                  </span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {adForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {adForm.images.map((url, idx) => (
                      <img key={idx} src={url} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-sky-200" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Description</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Enter full property details, sea view, amenities..."
                  value={adForm.description}
                  onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAd || uploadingImg}
                className="w-full bg-[#38bdf8] hover:bg-[#0284c7] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                {submittingAd ? 'Publishing Listing...' : 'Publish Ad Now'}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 4: LEADS & INQUIRIES ================= */}
        {activeTab === 'LEADS' && (
          <div className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-black uppercase">
              {isAdmin ? 'All Portal Leads & Clicks' : 'My Property Leads'}
            </h2>

            {leads.length === 0 ? (
              <p className="text-center py-10 text-xs font-bold text-slate-500">
                No leads or inquiries recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#e8f1f8] text-black uppercase font-black border-b border-sky-200">
                    <tr>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Client Info</th>
                      {isAdmin && <th className="py-3 px-4">Assigned Agent</th>}
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#f4f9fd]">
                        <td className="py-3 px-4">
                          <span className="bg-[#e8f1f8] text-[#0284c7] font-black px-2.5 py-1 rounded-md text-[10px]">
                            {lead.lead_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-black">
                          {lead.property_title || 'General Inquiry'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {lead.client_name} ({lead.client_phone})
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4 font-bold text-black">
                            {lead.agent_name || 'Admin'}
                          </td>
                        )}
                        <td className="py-3 px-4 text-slate-500 font-semibold">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: AGENTS MANAGEMENT (ADMIN ONLY) ================= */}
        {activeTab === 'AGENTS' && isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-sky-200/80 p-6 shadow-xs space-y-4 h-fit">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0284c7]" />
                <h2 className="text-base font-black text-black uppercase">Register New Agent</h2>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Agent Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imran Qureshi"
                    value={agentForm.name}
                    onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="03001234567"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Login Email</label>
                  <input
                    type="email"
                    required
                    placeholder="imran@emaar.pk"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Assign Password</label>
                  <input
                    type="text"
                    required
                    placeholder="Create agent password"
                    value={agentForm.password}
                    onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingAgent}
                  className="w-full bg-[#38bdf8] hover:bg-[#0284c7] text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  {creatingAgent ? 'Creating Account...' : 'Create Agent Account'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-sky-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-black uppercase">
                Registered Agents & Performance
              </h2>

              {agents.length === 0 ? (
                <p className="text-center py-10 text-xs font-bold text-slate-500">
                  No agents registered yet. Add your first agent on the left.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#e8f1f8] text-black uppercase font-black border-b border-sky-200">
                      <tr>
                        <th className="py-3 px-4">Agent Name</th>
                        <th className="py-3 px-4">Login Email</th>
                        <th className="py-3 px-4">Ads</th>
                        <th className="py-3 px-4">Views</th>
                        <th className="py-3 px-4">Clicks</th>
                        <th className="py-3 px-4 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {agents.map((ag) => (
                        <tr key={ag.id} className="hover:bg-[#f4f9fd]">
                          <td className="py-3.5 px-4">
                            <span className="font-black text-black block">{ag.name}</span>
                            <span className="text-[11px] text-slate-600 font-semibold">{ag.phone}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{ag.email}</td>
                          <td className="py-3.5 px-4 font-black text-[#0284c7]">{ag.total_ads}</td>
                          <td className="py-3.5 px-4 font-black text-black">{ag.total_views}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-700">{ag.total_clicks}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteAgent(ag.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Agent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: PROFILE SETTINGS (NAME, NUMBER, PHOTO, PASSWORD) ================= */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-3xl border border-sky-200/80 p-6 sm:p-8 shadow-xs max-w-2xl">
            <h2 className="text-lg font-black text-black uppercase mb-1">
              Account & Profile Settings
            </h2>
            <p className="text-xs text-slate-600 font-semibold mb-6">
              Update your profile photo, display name, contact number, or login password.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Picture Upload Box */}
              <div className="flex items-center gap-5 p-4 bg-[#e8f1f8] rounded-2xl border border-sky-200">
                {profileForm.profile_image ? (
                  <img
                    src={profileForm.profile_image}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white text-[#0284c7] flex items-center justify-center border-2 border-sky-200 flex-shrink-0">
                    <User className="w-9 h-9" />
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-xs font-black text-black uppercase block">Profile Picture</span>
                  <label className="inline-flex items-center gap-2 bg-white hover:bg-sky-50 text-black font-black px-4 py-2 rounded-xl text-xs border border-sky-200 cursor-pointer shadow-2xs">
                    <Camera className="w-4 h-4 text-[#0284c7]" />
                    <span>{uploadingAvatar ? 'Uploading Photo...' : 'Change Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Phone / WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">
                  New Password <span className="text-slate-500 font-semibold normal-case">(Leave blank to keep current password)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sky-200 text-sm text-black font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile || uploadingAvatar}
                className="w-full bg-[#38bdf8] hover:bg-[#0284c7] text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Settings'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}