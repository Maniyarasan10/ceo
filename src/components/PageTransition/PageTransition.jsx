import { useEffect, useRef } from 'react';
import { registerTransition } from '../../animations/pageTransitions';
import './PageTransition.css';

export default function PageTransition() {
  const root = useRef(null);
  const label = useRef(null);
  useEffect(() => registerTransition({ root: root.current, cols: root.current.querySelectorAll('.pt__col'), label: label.current }), []);
  return (
    <div className="pt" ref={root} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => <span className="pt__col" key={i} />)}
      <div className="pt__label display"><span ref={label} /></div>
    </div>
  );
}
