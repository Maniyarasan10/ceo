import { useEffect, useRef } from 'react';
import { profile } from '../../data/profile';
import { navigateTo } from '../../animations/pageTransitions';
import Marquee from '../Marquee/Marquee';
import './Footer.css';

export default function Footer() {
  const clock = useRef(null);
  useEffect(() => {
    const fmt = () => { if (clock.current) clock.current.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
    fmt(); const id = setInterval(fmt, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <footer className="footer">
      <Marquee items={['Developer · CEO · Co-Founder', 'Problem Solving Mind', 'Products that solve real problems']} speed={0.8} outline />
      <div className="footer__row mono">
        <span>© {profile.year} {profile.name}</span>
        <span>Local time <b ref={clock}>--:--</b></span>
        <span>{profile.company} — {profile.companyShort}</span>
        <button className="u-link" onClick={() => navigateTo('top')} data-magnetic="0.3">Back to top</button>
      </div>
    </footer>
  );
}
