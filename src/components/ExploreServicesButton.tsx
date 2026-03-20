import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CAPABILITIES_HASH,
  CAPABILITIES_ROUTE,
  scrollToCapabilitiesSection,
} from '../lib/capabilities-navigation';

type ExploreServicesButtonProps = {
  className?: string;
  style?: CSSProperties;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  text?: string;
};

const baseStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: 'white',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const ExploreServicesButton = ({
  className = 'group text-white hover:text-white/80 transition-colors',
  style,
  iconClassName = 'w-4 h-4 transition-transform group-hover:translate-x-1.5',
  iconStyle,
  text = 'Explore our services',
}: ExploreServicesButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === '/about') {
      if (location.hash !== CAPABILITIES_HASH) {
        navigate(CAPABILITIES_ROUTE, { replace: true });
      }

      window.setTimeout(() => scrollToCapabilitiesSection(), 0);
      return;
    }

    navigate(CAPABILITIES_ROUTE);
  };

  return (
    <button type="button" className={className} style={{ ...baseStyle, ...style }} onClick={handleClick}>
      <span>{text}</span>
      <svg className={iconClassName} style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  );
};

export default ExploreServicesButton;