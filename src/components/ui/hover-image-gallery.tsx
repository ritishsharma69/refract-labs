"use client";
import { useState } from "react";

interface HoverImageGalleryProps {
  images?: string[];
}

// Default placeholder images - will be replaced with backend data
const defaultImages = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=550&h=550&fit=crop",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=550&h=550&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=550&h=550&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=550&h=550&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=550&h=550&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=550&h=550&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=550&h=550&fit=crop",
];

export function HoverImageGallery({ images = defaultImages }: HoverImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;

    setMousePosition({ x, y });

    const imageIndex = Math.floor((x / width) * images.length);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, imageIndex));
    setCurrentImageIndex(clampedIndex);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div className="relative group">
      <div
        className="relative w-full max-w-[450px] aspect-square overflow-hidden rounded-2xl shadow-2xl cursor-none border border-white/10"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 blur-2xl opacity-50 -z-10" />
        
        {/* Main displayed image */}
        <img
          src={images[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-150 ease-out"
        />

        {/* Image counter overlay */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Glassmorphic Tooltip with Chevrons */}
        {isHovering && (
          <div
            className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-2.5 shadow-lg border border-white/30 w-14 h-14 flex items-center justify-center">
              <div className="flex items-center gap-1">
                {/* Left Chevron */}
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {/* Right Chevron */}
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-150"
            style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

