'use client';

import React, { useState, useRef } from 'react';

interface ZipDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function ZipDropzone({ onFileSelect, selectedFile }: ZipDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side ZIP Magic Byte Check (50 4B 03 04)
  const validateZipFile = async (file: File): Promise<boolean> => {
    if (file.size > 50 * 1024 * 1024) {
      setError('File exceeds the 50MB size limit.');
      return false;
    }

    try {
      const buffer = await file.slice(0, 4).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

      if (!isZip) {
        setError('Invalid file format. Please upload a valid .zip archive.');
        return false;
      }

      setError(null);
      return true;
    } catch {
      setError('Failed to verify archive headers.');
      return false;
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const isValid = await validateZipFile(file);
      if (isValid) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isValid = await validateZipFile(file);
      if (isValid) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
        Game Bundle (.ZIP Archive) <span className="text-red-400">*</span>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-500/50 bg-emerald-950/20'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip"
          onChange={handleChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto text-xl">
              ✓
            </div>
            <p className="text-sm font-bold text-slate-100">{selectedFile.name}</p>
            <p className="text-xs text-slate-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Ingestion
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="text-xs font-semibold text-red-400 hover:underline pt-1"
            >
              Remove & Select Another
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto text-xl">
              📦
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-200">
                Drag and drop your game .ZIP bundle here
              </p>
              <p className="text-xs text-slate-400">
                Must contain an <code className="text-cyan-400 font-mono font-semibold">index.html</code> at the archive root (Max 50MB)
              </p>
            </div>
            <span className="inline-block rounded-lg bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-300">
              Browse Local Files
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-xs font-medium text-red-400 pt-1">{error}</p>}
    </div>
  );
}
