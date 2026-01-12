import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string;
  altText: string;
  onClose: () => void;
}

export function Lightbox({ isOpen, imageSrc, altText, onClose }: LightboxProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <button
              onClick={handleZoomOut}
              className="text-white/70 hover:text-white transition-colors"
              disabled={scale <= 1}
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <span className="text-white/50 font-mono text-sm flex items-center min-w-[3rem] justify-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="text-white/70 hover:text-white transition-colors"
              disabled={scale >= 3}
            >
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>

          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-full max-h-full overflow-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={imageSrc}
              alt={altText}
              style={{ scale }}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing transition-transform duration-200"
              drag
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            />
          </motion.div>
          
          {/* Caption */}
          <div className="absolute top-6 left-6 text-white/80 font-serif text-xl tracking-wide pointer-events-none">
            {altText}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
