'use client';

import React, { useState, useRef } from 'react';
import CustomSelect from '@/components/CustomSelect';
import { 
  X, Building2, Layers, Activity, Upload, Video, 
  CheckCircle2, PlusCircle, Loader2, Film, FileText 
} from 'lucide-react';
import { EMAAR_TOWERS, UNIT_TYPES } from '@/lib/constants';

export default function AdminModal({ isOpen, onClose, onPropertyAdded }) {
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
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

  if (!isOpen) return null;

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
      alert('Photo upload failed: ' + err.message);
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
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        ...formData,
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

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert('Ad Published Successfully!');
        if (onPropertyAdded) onPropertyAdded();
        onClose();
        // Reset
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
      } else {
        alert('Database Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to post ad: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn font-sans">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#38bdf8] flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-black uppercase tracking-tight">
                Post New Emaar Ad
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Listing Management • Sadaf Estate
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
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
              placeholder="e.g. Luxury 2-Bed Oceanfront Apartment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black placeholder:font-bold outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* 3. Description Input */}
          <div>
            <label className="text-[11px] font-black uppercase text-black block mb-1">
              Property Description & Features
            </label>
            <textarea
              rows={3}
              placeholder="Detailed property specifications, sea view, car parking, amenities..."
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

          {/* 5. Pricing Details */}
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
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
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
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-black block mb-1">Monthly Installment</label>
                  <input
                    required
                    type="number"
                    placeholder="Monthly"
                    value={formData.monthly_installment_pkr}
                    onChange={(e) => setFormData({ ...formData, monthly_installment_pkr: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
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
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
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
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
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
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
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

          {/* Status */}
          <div>
            <label className="text-[11px] font-black uppercase text-black block mb-1.5">Availability Status</label>
            <CustomSelect
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={statusOptions}
              icon={Activity}
            />
          </div>

          {/* 7. Cloudinary Multiple Photos */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[11px] font-black uppercase text-black block">
                  Property Images (Cloudinary CDN)
                </label>
                <span className="text-[10px] text-slate-500 font-bold">
                  Browse multiple photos from device
                </span>
              </div>
              <span className="text-xs font-black text-[#0284c7] bg-sky-100 px-2.5 py-0.5 rounded-full">
                {formData.images.length} Selected
              </span>
            </div>

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

          {/* 8. Cloudinary Video Upload */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
            <div>
              <label className="text-[11px] font-black uppercase text-black block">
                Property Video (Walkthrough / Drone View)
              </label>
              <span className="text-[10px] text-slate-500 font-bold">
                Browse video file or paste direct link
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
                placeholder="Or paste external video link (MP4, YouTube)"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-black placeholder:text-black outline-none focus:border-[#38bdf8]"
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

          {/* 9. Promoted Checkbox */}
          <div className="p-3.5 bg-sky-50 border-2 border-sky-100 rounded-2xl flex items-center gap-3">
            <input
              type="checkbox"
              id="modal_featured_checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 accent-[#38bdf8] rounded cursor-pointer"
            />
            <label htmlFor="modal_featured_checkbox" className="text-xs font-black uppercase text-black cursor-pointer">
              Show on Home Page (Promoted / Featured Listing)
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || uploadingMedia}
              className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] disabled:bg-slate-400 text-white font-black py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#38bdf8]/30 active:scale-95 cursor-pointer"
            >
              {loading ? 'Publishing to Database...' : 'Publish Property Ad Now'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}