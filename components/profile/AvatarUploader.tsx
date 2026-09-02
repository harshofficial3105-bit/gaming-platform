'use client';

import React, { useState, useEffect, useRef } from 'react';

const PRESET_AVATARS = ['👤', '🤖', '👾', '🦊', '🐱', '⚡', '🚀', '🛡️', '💎', '🎯'];

export function AvatarUploader() {
  const [avatar, setAvatar] = useState<string>('👤');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('arcadehub_player_avatar');
      if (saved) {
        setAvatar(saved);
        setIsCustomImage(saved.startsWith('data:image/') || saved.startsWith('http'));
      }
    } catch (e) {}
  }, []);

  const saveAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    const isImg = newAvatar.startsWith('data:image/') || newAvatar.startsWith('http');
    setIsCustomImage(isImg);

    try {
      localStorage.setItem('arcadehub_player_avatar', newAvatar);
      window.dispatchEvent(new Event('arcadehub_avatar_updated'));
    } catch (e) {}
  };

  // Handle custom file upload with canvas auto-compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (.png, .jpg, .webp, .svg).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
          saveAvatar(compressedDataUrl);
          setIsModalOpen(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group">
      
      {/* 1. Main Interactive Avatar Badge */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-95 transition-all cursor-pointer overflow-hidden group"
        title="Click to Upload or Change Avatar"
      >
        <div className="h-full w-full bg-[#050811] rounded-[14px] flex items-center justify-center overflow-hidden">
          {isCustomImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt="Player Avatar"
              className="h-full w-full object-cover rounded-[14px]"
            />
          ) : (
            <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
              {avatar}
            </span>
          )}
        </div>

        {/* Hover Camera Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-2xl text-[10px] font-mono text-cyan-300 font-bold">
          <span>📷</span>
          <span>EDIT</span>
        </div>
      </button>

      {/* 2. Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* 3. Avatar Selection & Upload Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl space-y-5 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <h3 className="text-base font-bold text-white font-mono">
                  CHOOSE PLAYER AVATAR
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Upload Custom Photo Option */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                1. Upload Custom Image
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-2xl border border-dashed border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="text-2xl">📤</span>
                <span>Click to Browse & Upload Photo (.png, .jpg, .webp)</span>
                <span className="text-[10px] text-slate-400">Max size 10MB • Auto compressed</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                2. Or Select Preset Avatar
              </span>
              <div className="grid grid-cols-5 gap-2.5">
                {PRESET_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      saveAvatar(emoji);
                      setIsModalOpen(false);
                    }}
                    className={`h-12 w-12 rounded-xl border text-2xl flex items-center justify-center transition-all cursor-pointer ${
                      avatar === emoji && !isCustomImage
                        ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-500/40'
                        : 'border-slate-800 bg-[#050811] hover:border-slate-700 hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  saveAvatar('👤');
                  setIsModalOpen(false);
                }}
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Reset to Default
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}