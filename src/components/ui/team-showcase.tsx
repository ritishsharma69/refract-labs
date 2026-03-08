import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import { cn } from '../../lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({ members = [] }: TeamShowcaseProps) {
  if (members.length === 0) return null;

  // Grid columns based on member count
  const getGridCols = () => {
    if (members.length === 1) return 'grid-cols-1 max-w-md';
    if (members.length === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl';
    if (members.length === 3) return 'grid-cols-1 md:grid-cols-3 max-w-5xl';
    if (members.length === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl';
    if (members.length <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
  };

  return (
    <div className={cn(
      "grid gap-5 md:gap-6 w-full mx-auto px-4 md:px-8 py-8 font-sans",
      getGridCols()
    )}>
      {members.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  );
}

// Large Team Card Component - matching reference design
function TeamCard({ member }: { member: TeamMember }) {
  const hasSocial = member.social?.twitter || member.social?.linkedin || member.social?.instagram || member.social?.behance;

  return (
    <div className="group relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Name overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white font-['Space_Grotesk']">
            {member.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider mt-1">
            {member.role}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 md:p-6">
        {/* Description */}
        {member.description && (
          <p className="text-sm md:text-[15px] text-gray-400 leading-relaxed mb-4">
            {member.description}
          </p>
        )}

        {/* Social Icons */}
        {hasSocial && (
          <div className="flex items-center gap-3 pt-2 border-t border-white/5">
            {member.social?.twitter && (
              <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaTwitter size={16} />
              </a>
            )}
            {member.social?.linkedin && (
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaLinkedinIn size={16} />
              </a>
            )}
            {member.social?.instagram && (
              <a href={member.social.instagram} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaInstagram size={16} />
              </a>
            )}
            {member.social?.behance && (
              <a href={member.social.behance} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaBehance size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

