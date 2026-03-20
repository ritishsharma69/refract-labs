"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchTeamMembers, type TeamMember } from "@/lib/content-store";

interface DisplayMember {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

const mapTeamToDisplay = (members: TeamMember[]): DisplayMember[] =>
  members.map((m) => ({
    name: m.name,
    title: m.role,
    description: m.description,
    imageUrl: m.image,
    twitterUrl: m.social?.twitter || undefined,
    linkedinUrl: m.social?.linkedin || undefined,
    instagramUrl: m.social?.instagram || undefined,
  }));

const fallbackMembers: DisplayMember[] = [
  {
    name: "Adam Guarino",
    title: "Co-Founder and COO",
    description: "Adam orchestrates creative strategy and production for high-growth organizations.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    linkedinUrl: "#",
    twitterUrl: "#",
  },
  {
    name: "Jake Young",
    title: "Co-Founder and CEO",
    description: "Jake operates across major creative markets including San Diego and London.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face",
    linkedinUrl: "#",
    twitterUrl: "#",
  },
];

export interface TestimonialCarouselProps {
  className?: string;
}

export function TestimonialCarousel({ className }: TestimonialCarouselProps) {
  const [members, setMembers] = useState<DisplayMember[]>(fallbackMembers);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTeamMembers()
      .then((data) => {
        if (data.length > 0) setMembers(mapTeamToDisplay(data));
      })
      .catch(() => {});
  }, []);

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % members.length);
  const handlePrevious = () =>
    setCurrentIndex(
      (index) => (index - 1 + members.length) % members.length
    );

  const currentTestimonial = members[currentIndex];

  if (!currentTestimonial) return null;

  const socialIcons = [
    { icon: Twitter, url: currentTestimonial.twitterUrl, label: "Twitter" },
    { icon: Linkedin, url: currentTestimonial.linkedinUrl, label: "LinkedIn" },
    { icon: Instagram, url: currentTestimonial.instagramUrl, label: "Instagram" },
  ].filter((s) => s.url);

  return (
    <div className={cn("w-full max-w-[1100px] mx-auto px-0 md:px-4", className)}>
      {/* Desktop layout */}
      <div
        className='hidden md:flex relative items-center justify-center mx-auto w-full'
        style={{ minHeight: '500px', maxWidth: '920px' }}
      >
        {/* Avatar - left side */}
        <div
          className='rounded-3xl overflow-hidden flex-shrink-0'
          style={{ width: '380px', height: '460px' }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className='w-full h-full'
            >
              <img
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.name}
                className='w-full h-full object-cover'
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card - overlaps the image */}
        <div
          className='rounded-3xl shadow-2xl z-10 flex-1 border border-white/10 flex flex-col justify-center'
          style={{
            background: 'linear-gradient(145deg, #141414 0%, #1a1a1a 50%, #111 100%)',
            padding: '48px 52px',
            width: '520px',
            minHeight: '380px',
            marginLeft: '-44px',
            marginTop: '24px',
            marginBottom: '24px',
          }}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className='mb-6'>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  {currentTestimonial.name}
                </h2>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#888' }}>
                  {currentTestimonial.title}
                </p>
              </div>
              <p style={{ color: '#ccc', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
                {currentTestimonial.description}
              </p>
              <div className='flex space-x-4'>
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url || "#"}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer'
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}
                    aria-label={label}
                  >
                    <IconComponent className='w-5 h-5 text-white' />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className='md:hidden max-w-sm mx-auto text-center'>
        <div className='w-full rounded-3xl overflow-hidden mb-6' style={{ height: '320px' }}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className='w-full h-full'
            >
              <img
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.name}
                className='w-full h-full object-cover'
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className='rounded-3xl border border-white/10 mx-2' style={{ background: '#141414', padding: '28px 24px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                {currentTestimonial.name}
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '14px' }}>
                {currentTestimonial.title}
              </p>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                {currentTestimonial.description}
              </p>
              <div className='flex justify-center space-x-3'>
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url || "#"}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer'
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}
                    aria-label={label}
                  >
                    <IconComponent className='w-4 h-4 text-white' />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className='flex justify-center items-center gap-6 mt-8 mx-auto w-full'>
        <button
          onClick={handlePrevious}
          aria-label='Previous testimonial'
          className='w-11 h-11 rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer'
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronLeft className='w-5 h-5 text-gray-50' />
        </button>
        <div className='flex gap-2'>
          {members.map((_, testimonialIndex) => (
            <button
              key={testimonialIndex}
              onClick={() => setCurrentIndex(testimonialIndex)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors cursor-pointer",
                testimonialIndex === currentIndex
                  ? "bg-white"
                  : "bg-gray-600"
              )}
              aria-label={`Go to testimonial ${testimonialIndex + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          aria-label='Next testimonial'
          className='w-11 h-11 rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer'
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronRight className='w-5 h-5 text-gray-50' />
        </button>
      </div>
    </div>
  );
}

