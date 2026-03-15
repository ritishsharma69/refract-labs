"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface CardStackProps {
  items: CardItem[];
  className?: string;
  autoFlipInterval?: number;
}

export function CardStack({
  items,
  className,
  autoFlipInterval = 5000,
}: CardStackProps) {
  const [cards, setCards] = useState<CardItem[]>(items);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) newCards.push(first);
        return newCards;
      });
    }, autoFlipInterval);
    return () => clearInterval(interval);
  }, [autoFlipInterval]);

  const handleClick = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const first = newCards.shift();
      if (first) newCards.push(first);
      return newCards;
    });
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-lg mx-auto h-[320px] md:h-[380px] cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <AnimatePresence>
        {cards.map((card, index) => {
          const isTop = index === 0;
          return (
            <motion.div
              key={card.id}
              className="absolute w-full"
              style={{
                zIndex: cards.length - index,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{
                opacity: index > 3 ? 0 : 1 - index * 0.15,
                y: index * -12,
                scale: 1 - index * 0.04,
                rotateZ: index === 0 ? 0 : index % 2 === 0 ? -1.5 : 1.5,
              }}
              exit={{ opacity: 0, y: -60, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              <div
                className={cn(
                  "rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-shadow duration-300",
                  isTop
                    ? "bg-gradient-to-br from-[#141822] via-[#181e2e] to-[#141822] border-white/10 shadow-2xl"
                    : "bg-[#12151d] border-white/5 shadow-lg"
                )}
              >
                {card.icon && (
                  <div className="mb-4 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#c2622a]/15 flex items-center justify-center text-[#e07030]">
                    {card.icon}
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">
                  {card.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  {card.description}
                </p>
                {isTop && (
                  <div className="mt-6 flex items-center gap-2 text-[#e07030] text-sm font-medium">
                    <span>Learn more</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

