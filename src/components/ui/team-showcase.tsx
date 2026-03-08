import { useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import { cn } from '../../lib/utils';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (members.length === 0) return null;

  // Dynamic column distribution based on number of members
  const getColumns = () => {
    if (members.length === 1) return [members];
    if (members.length === 2) return [members.slice(0, 1), members.slice(1)];
    if (members.length <= 3) return [members.slice(0, 1), members.slice(1, 2), members.slice(2)];
    if (members.length <= 4) return [members.slice(0, 2), members.slice(2, 3), members.slice(3)];
    if (members.length <= 5) return [members.slice(0, 2), members.slice(2, 4), members.slice(4)];
    // 6 members
    return [members.slice(0, 2), members.slice(2, 4), members.slice(4, 6)];
  };

  const columns = getColumns();
  const isSingleMember = members.length === 1;

  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center gap-8 md:gap-10 lg:gap-14 select-none w-full max-w-5xl mx-auto py-8 px-4 md:px-6 font-sans",
      isSingleMember && "justify-center"
    )}>
      {/* Photo grid */}
      <div className={cn(
        "flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0",
        isSingleMember && "justify-center"
      )}>
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              "flex flex-col gap-2 md:gap-3",
              colIndex === 1 && members.length > 2 && "mt-[48px] sm:mt-[56px] md:mt-[68px]",
              colIndex === 2 && "mt-[22px] sm:mt-[26px] md:mt-[32px]"
            )}
          >
            {col.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className={cn(
                  colIndex === 0 && "w-[110px] h-[120px] sm:w-[130px] sm:h-[140px] md:w-[155px] md:h-[165px]",
                  colIndex === 1 && "w-[122px] h-[132px] sm:w-[145px] sm:h-[155px] md:w-[172px] md:h-[182px]",
                  colIndex === 2 && "w-[115px] h-[125px] sm:w-[136px] sm:h-[146px] md:w-[162px] md:h-[172px]",
                  isSingleMember && "w-[180px] h-[200px] sm:w-[220px] sm:h-[240px] md:w-[280px] md:h-[300px]"
                )}
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Member name list */}
      <div className={cn(
        "flex flex-col sm:grid md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full",
        members.length <= 2 ? "sm:grid-cols-1" : "sm:grid-cols-2"
      )}>
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className?: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-400',
        className,
        isDimmed ? 'opacity-60' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter] duration-500"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.77)',
        }}
      />
    </div>
  );
}

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial = member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram ?? member.social?.behance;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300',
        isDimmed ? 'opacity-50' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-4 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300',
            isActive ? 'bg-white w-5' : 'bg-white/25',
          )}
        />
        <span
          className={cn(
            'text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-white' : 'text-white/80',
          )}
        >
          {member.name}
        </span>

        {hasSocial && (
          <div
            className={cn(
              'flex items-center gap-1.5 ml-0.5 transition-all duration-200',
              isActive
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2 pointer-events-none',
            )}
          >
            {member.social?.twitter && (
              <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110">
                <FaTwitter size={10} />
              </a>
            )}
            {member.social?.linkedin && (
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110">
                <FaLinkedinIn size={10} />
              </a>
            )}
            {member.social?.instagram && (
              <a href={member.social.instagram} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110">
                <FaInstagram size={10} />
              </a>
            )}
            {member.social?.behance && (
              <a href={member.social.behance} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110">
                <FaBehance size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      <p className="mt-1.5 pl-[27px] text-[7px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
        {member.role}
      </p>
    </div>
  );
}

