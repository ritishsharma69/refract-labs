import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

// --- Card Component ---
interface CardProps {
  heading: string;
  description: string;
  imgSrc: string;
}

const Card = ({ heading, description, imgSrc }: CardProps) => {
  return (
    <motion.div
      transition={{ staggerChildren: 0.035 }}
      whileHover="hover"
      className="group relative h-64 w-full cursor-pointer overflow-hidden bg-slate-300"
    >
      <div
        className="absolute inset-0 saturate-100 transition-all duration-500 group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-20 flex h-full flex-col justify-between p-4 text-slate-300 transition-colors duration-500 group-hover:text-white">
        <ArrowRight className="ml-auto text-3xl transition-transform duration-500 group-hover:-rotate-45 w-8 h-8" />
        <div>
          <h4>
            {heading.split("").map((letter, index) => (
              <AnimatedLetter letter={letter} key={index} />
            ))}
          </h4>
          <p>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- AnimatedLetter Helper Component ---
interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  hover: {
    y: "-50%",
  },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  return (
    <div className="inline-block h-[36px] overflow-hidden font-semibold text-3xl">
      <motion.span
        className="flex min-w-[4px] flex-col"
        style={{ y: "0%" }}
        variants={letterVariants}
        transition={{ duration: 0.5 }}
      >
        <span>{letter}</span>
        <span>{letter}</span>
      </motion.span>
    </div>
  );
};

// --- Main ColorChangeCards Component ---
export interface ColorChangeCardItem {
  heading: string;
  description: string;
  imgSrc: string;
}

interface ColorChangeCardsProps {
  items?: ColorChangeCardItem[];
}

const ColorChangeCards = ({ items }: ColorChangeCardsProps) => {
  const defaultItems: ColorChangeCardItem[] = [
    {
      heading: "Plan",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem.",
      imgSrc: "https://images.pexels.com/photos/176342/pexels-photo-176342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      heading: "Play",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem.",
      imgSrc: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      heading: "Connect",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem.",
      imgSrc: "https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      heading: "Support",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, exercitationem.",
      imgSrc: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  const cards = items || defaultItems;

  return (
    <div className="w-full px-4 py-12 md:py-8">
      <div className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-4 md:gap-8">
        {cards.map((card, index) => (
          <div key={index} className="w-full max-w-[420px] md:w-[420px]">
            <Card
              heading={card.heading}
              description={card.description}
              imgSrc={card.imgSrc}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorChangeCards;

