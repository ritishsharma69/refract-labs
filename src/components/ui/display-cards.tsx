"use client";

import { cn } from "@/lib/utils";
import { Globe, Smartphone, Share2, Target } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Globe className="size-4 text-orange-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-orange-500",
  titleClassName = "text-orange-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-white/10 bg-[#151515]/90 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-[#080808] after:to-transparent after:content-[''] hover:border-orange-500/30 hover:bg-[#1a1a1a] [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full bg-orange-900/60 p-1.5", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-medium", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg text-white/90">{description}</p>
      <p className="text-white/50">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      icon: <Globe className="size-4 text-orange-300" />,
      title: "Website Development",
      description: "Modern & responsive websites",
      date: "Custom solutions",
      iconClassName: "bg-orange-900/60",
      titleClassName: "text-orange-400",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/5 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-[#080808]/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Smartphone className="size-4 text-orange-300" />,
      title: "App Development",
      description: "iOS & Android applications",
      date: "Native & Cross-platform",
      iconClassName: "bg-orange-900/60",
      titleClassName: "text-orange-400",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/5 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-[#080808]/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Share2 className="size-4 text-orange-300" />,
      title: "Social Media",
      description: "Marketing & engagement",
      date: "Growth strategies",
      iconClassName: "bg-orange-900/60",
      titleClassName: "text-orange-400",
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/5 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-[#080808]/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Target className="size-4 text-orange-300" />,
      title: "AD Strategic",
      description: "Targeted ad campaigns",
      date: "ROI focused",
      iconClassName: "bg-orange-900/60",
      titleClassName: "text-orange-400",
      className:
        "[grid-area:stack] translate-x-36 translate-y-[7.5rem] hover:translate-y-[5rem]",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

