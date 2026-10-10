'use client';

import React from 'react';

export default function ListingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3.5 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-pulse"
        >
          {/* Left Thumbnail & Info Bars */}
          <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-200/70 flex-shrink-0" />

            <div className="space-y-2.5 w-full sm:w-72">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-sky-100 rounded-md" />
                <div className="h-5 w-20 bg-slate-100 rounded-md" />
              </div>
              <div className="h-5 w-full sm:w-64 bg-slate-200/80 rounded-md" />
              <div className="h-3 w-40 bg-slate-100 rounded-md" />
              <div className="flex items-center gap-3 pt-1">
                <div className="h-3.5 w-14 bg-slate-200/60 rounded" />
                <div className="h-3.5 w-14 bg-slate-200/60 rounded" />
                <div className="h-3.5 w-16 bg-slate-200/60 rounded" />
              </div>
            </div>
          </div>

          {/* Right Price & Buttons */}
          <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="space-y-1.5 text-left md:text-right">
              <div className="h-3 w-16 bg-slate-100 rounded ml-auto" />
              <div className="h-6 w-28 bg-slate-200 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-sky-100 rounded-xl" />
              <div className="h-10 w-16 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}