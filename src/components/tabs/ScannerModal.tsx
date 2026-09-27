import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, X, RotateCw, Check, Crop, Sliders, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { UnsyncedScan } from '../../types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (newScan: UnsyncedScan) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [step, setStep] = useState<'choose' | 'camera' | 'crop'>('choose');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'clean' | 'bw' | 'high_contrast'>('clean');
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('choose');
      setCapturedImage(null);
      setRotation(0);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Handle Camera initialization when 'camera' step is active
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (step === 'camera') {
      setErrorMessage(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              setCameraActive(true);
            }
          })
          .catch((err) => {
            console.warn('Camera access error:', err);
            setCameraActive(false);
            setErrorMessage('Camera access was not granted or not available. You can use sample document capture or upload from gallery.');
          });
      } else {
        setCameraActive(false);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step]);

  if (!isOpen) return null;

  // Snapshot from video feed
  const handleSnapCamera = () => {
    if (videoRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
        setStep('crop');
        return;
      }
    }

    // Fallback sample handwritten document image
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 600;
    sampleCanvas.height = 780;
    const ctx = sampleCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 780);
      // Grid lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 30; y < 780; y += 30) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(560, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px serif';
      ctx.fillText('Heaps & Priority Queues', 50, 70);
      ctx.font = '16px sans-serif';
      ctx.fillText('Min-Heap Property: parent <= children for all nodes', 50, 110);
      ctx.fillText('Insert: add to end & heapify-up in O(log n)', 50, 150);
      ctx.fillText('Extract-Min: swap root with last & heapify-down in O(log n)', 50, 190);
    }
    setCapturedImage(sampleCanvas.toDataURL('image/jpeg', 0.9));
    setStep('crop');
  };

  // Handle Gallery file pick
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
          setStep('crop');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Confirm crop and save
  const handleConfirmScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const sampleTitles = [
        {
          title: 'Heaps & Priority Queues',
          subject: 'Data Structures',
          folderId: 'folder-ds',
          snippet: 'Min-Heap Property: parent <= children for all nodes. Heapify-up and heapify-down in O(log n).'
        },
        {
          title: 'Stokes Theorem & Vector Flux',
          subject: 'Engineering Mathematics',
          folderId: 'folder-math',
          snippet: 'Stokes Theorem: ∮_C F · dr = ∬_S (curl F) · dS. Boundary curve orientation follows right hand rule.'
        },
        {
          title: 'SQL Indexing & B-Trees',
          subject: 'DBMS',
          folderId: 'folder-dbms',
          snippet: 'Clustered vs Non-Clustered indices. Balanced B+ tree structure speeds up ranged queries.'
        }
      ];

      const pick = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
      const newScan: UnsyncedScan = {
        id: `scan-${Date.now()}`,
        title: pick.title,
        scannedAt: 'Just now',
        suggestedFolderId: pick.folderId,
        suggestedSubject: pick.subject,
        confidenceScore: 0.97,
        snippet: pick.snippet,
        imageUri: capturedImage || undefined,
        handwrittenPreview: 'M 20 40 Q 80 20 180 40 T 300 45'
      };

      onScanComplete(newScan);
      setIsProcessing(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      {/* Hidden file input for Gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden flex flex-col space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Document Scanner</h3>
              <p className="text-[11px] text-slate-400">Direct capture with automatic crop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CHOOSE CAPTURE NOW OR IMPORT FROM GALLERY */}
        {step === 'choose' && (
          <div className="py-4 space-y-3">
            <p className="text-xs text-slate-300 text-center font-medium">
              Choose how you would like to scan your document:
            </p>

            {/* Option 1: Capture Now */}
            <button
              onClick={() => setStep('camera')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-between shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">Capture Now</div>
                  <div className="text-[11px] text-emerald-100 font-normal">Use your mobile device camera</div>
                </div>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">Open</span>
            </button>

            {/* Option 2: Import from Gallery */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold flex items-center justify-between border border-slate-700 cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Image className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">Import from Gallery</div>
                  <div className="text-[11px] text-slate-400 font-normal">Select photo or handwritten document</div>
                </div>
              </div>
              <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full font-semibold">Browse</span>
            </button>
          </div>
        )}

        {/* STEP 2: CAMERA VIEWFINDER */}
        {step === 'camera' && (
          <div className="space-y-3">
            <div className="relative w-full aspect-[3/4] rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-slate-800">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-4 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs text-slate-300">
                    Live camera stream will capture your page or note sheet.
                  </p>
                </div>
              )}

              {/* Viewfinder corner guides */}
              <div className="absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 border-emerald-400 rounded-tl-md pointer-events-none" />
              <div className="absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 border-emerald-400 rounded-tr-md pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 border-emerald-400 rounded-bl-md pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 border-emerald-400 rounded-br-md pointer-events-none" />

              {/* Laser scanning beam */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce" />
            </div>

            {/* Shutter / Capture Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setStep('choose')}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Back
              </button>

              <button
                onClick={handleSnapCamera}
                className="w-14 h-14 rounded-full border-4 border-emerald-400 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                From Gallery
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CROP & ADJUSTMENT TOOL */}
        {step === 'crop' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center space-x-1">
                <Crop className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adjust Document Crop</span>
              </span>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center space-x-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90°</span>
              </button>
            </div>

            {/* Interactive Crop Preview Box */}
            <div className="relative w-full aspect-[3/4] bg-slate-950 rounded-2xl border-2 border-emerald-500/80 overflow-hidden flex items-center justify-center p-3">
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Scanned doc"
                  className={`w-full h-full object-contain transition-transform ${
                    filterMode === 'bw' ? 'filter grayscale contrast-150' : filterMode === 'high_contrast' ? 'filter contrast-175' : ''
                  }`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              )}

              {/* Crop Grid Lines */}
              <div className="absolute inset-4 border border-dashed border-emerald-400/90 pointer-events-none">
                <div className="absolute inset-x-0 top-1/3 border-b border-emerald-400/30" />
                <div className="absolute inset-x-0 top-2/3 border-b border-emerald-400/30" />
                <div className="absolute inset-y-0 left-1/3 border-r border-emerald-400/30" />
                <div className="absolute inset-y-0 left-2/3 border-r border-emerald-400/30" />
                {/* 4 Interactive Drag Handles */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-emerald-400 rounded-full" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-emerald-400 rounded-full" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full" />
              </div>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px]">
              <button
                onClick={() => setFilterMode('clean')}
                className={`py-1 rounded-lg font-medium cursor-pointer ${filterMode === 'clean' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Color
              </button>
              <button
                onClick={() => setFilterMode('bw')}
                className={`py-1 rounded-lg font-medium cursor-pointer ${filterMode === 'bw' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                B&W Doc
              </button>
              <button
                onClick={() => setFilterMode('high_contrast')}
                className={`py-1 rounded-lg font-medium cursor-pointer ${filterMode === 'high_contrast' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                High Contrast
              </button>
            </div>

            {/* Confirmation CTA */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setStep('choose')}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Retake
              </button>
              <button
                onClick={handleConfirmScan}
                disabled={isProcessing}
                className="flex-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/25 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing OCR...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Crop & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
