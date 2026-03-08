import { FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  email?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamCardsProps {
  members: TeamMemberData[];
}

export default function TeamCards({ members }: TeamCardsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-16">
      {/* Grid: 4 cards on desktop (2 members x 2 cards each), stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 justify-items-center">
        {members.map((member) => (
          <div key={member.id} className="contents">
            {/* Photo Card */}
            <div
              className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] aspect-[3/4] w-full max-w-[280px] sm:max-w-none"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              {/* Name overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="text-white text-lg md:text-xl font-semibold font-['Space_Grotesk']">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider mt-1">
                  {member.role}
                </p>
              </div>
            </div>

            {/* Description Card */}
            <div
              className="relative rounded-2xl overflow-hidden bg-[#111111] p-5 md:p-6 flex flex-col justify-between w-full max-w-[280px] sm:max-w-none min-h-[280px] sm:min-h-[320px] border border-white/5"
            >
              {/* Name at top */}
              <div>
                <h3 className="text-white text-xl md:text-2xl font-semibold font-['Space_Grotesk'] mb-4 md:mb-5">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {member.description}
                </p>
              </div>

              {/* Social icons at bottom */}
              <div className="flex items-center gap-3 mt-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <FaEnvelope size={14} />
                  </a>
                )}
                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <FaLinkedinIn size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

