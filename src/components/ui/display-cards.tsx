"use client";

import { cn } from "@/lib/utils";
import { Globe, Smartphone, Share2, Target, Users, Server, Megaphone } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Globe className="size-4 text-orange-300" />,
  title = "Featured",
  iconClassName = "bg-orange-900/60",
  titleClassName = "text-orange-400",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-auto min-w-[180px] max-w-[240px] -skew-y-[8deg] select-none items-center gap-2 rounded-xl border border-white/10 bg-[#151515]/90 backdrop-blur-sm px-3 py-2.5 transition-all duration-300 hover:border-orange-500/30 hover:bg-[#1a1a1a] hover:-translate-y-1",
        className
      )}
    >
      <span className={cn("relative inline-flex items-center justify-center rounded-full p-1.5", iconClassName)}>
        {icon}
      </span>
      <p className={cn("text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis", titleClassName)}>{title}</p>
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
      className: "[grid-area:stack] z-[7]",
    },
    {
      icon: <Smartphone className="size-4 text-orange-300" />,
      title: "App Development",
      className: "[grid-area:stack] translate-x-6 translate-y-8 z-[6]",
    },
    {
      icon: <Share2 className="size-4 text-orange-300" />,
      title: "Social Media",
      className: "[grid-area:stack] translate-x-12 translate-y-16 z-[5]",
    },
    {
      icon: <Target className="size-4 text-orange-300" />,
      title: "AD Strategic",
      className: "[grid-area:stack] translate-x-[4.5rem] translate-y-24 z-[4]",
    },
    {
      icon: <Users className="size-4 text-orange-300" />,
      title: "Social Media Management",
      className: "[grid-area:stack] translate-x-24 translate-y-32 z-[3]",
    },
    {
      icon: <Server className="size-4 text-orange-300" />,
      title: "IT Services",
      className: "[grid-area:stack] translate-x-[7.5rem] translate-y-40 z-[2]",
    },
    {
      icon: <Megaphone className="size-4 text-orange-300" />,
      title: "Brand Strategy",
      className: "[grid-area:stack] translate-x-36 translate-y-48 z-[1]",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="relative grid [grid-template-areas:'stack'] place-items-start overflow-visible min-h-[320px] md:min-h-[400px]">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

