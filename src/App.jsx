import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { initVelocityFx } from './animations/scrollAnimations';
import { startScroll } from './lenisStore';
import Loader from './components/Loader/Loader';
import Navigation from './components/Navigation/Navigation';
import Cursor from './components/Cursor/Cursor';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import Services from './components/Services/Services';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import HUD from './components/HUD/HUD';
import Marquee from './components/Marquee/Marquee';
import PageTransition from './components/PageTransition/PageTransition';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [ready, setReady] = useState(false);
  useLenis();

  useEffect(() => { document.body.classList.add('is-loading'); }, []);
  const onDone = useCallback(() => {
    document.body.classList.remove('is-loading');
    startScroll();
    setReady(true);
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const off = initVelocityFx();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('load', onResize);
    return () => { off(); window.removeEventListener('load', onResize); };
  }, [ready]);

  return (
    <>
      <a className="skip-link" href="#work">Skip to work</a>
      <Loader onDone={onDone} />
      <PageTransition />
      <Cursor />
      <div className="gridlines" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
      <div className="grain" aria-hidden="true" />
      <Navigation ready={ready} />
      <HUD />
      <main>
        <Hero ready={ready} />
        <Marquee
          items={[
            'Build digital products',
            'Explore intelligent systems',
            'Turn ideas into products',
            'Developer · CEO · Co-Founder',
            'Build problem solving mind',
          ]}
          speed={1}
        />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
