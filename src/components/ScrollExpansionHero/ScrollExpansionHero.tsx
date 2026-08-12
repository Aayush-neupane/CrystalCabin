import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Truck } from 'lucide-react';
import logo from '../../assets/logo.png';
import './ScrollExpansionHero.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollExpansionHeroProps {
  onBookAppointment: () => void;
  onExploreServices: () => void;
}

export function ScrollExpansionHero({ onBookAppointment, onExploreServices }: ScrollExpansionHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const mobileMessageRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealByProgress = (progress: number) => {
      gsap.set([detailsRef.current, trustRef.current, mobileMessageRef.current], {
        opacity: progress >= 0.5 ? 1 : 0,
        y: 0,
      });
      gsap.set(navRef.current, { opacity: progress >= 0.42 ? 1 : 0, y: 0 });
      gsap.set(cueRef.current, { opacity: progress < 0.1 ? 1 : 0 });
    };

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(frameRef.current, {
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
      });
      gsap.set(scrimRef.current, { opacity: 0.55 });
      revealByProgress(0);
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => revealByProgress(self.progress),
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(frameRef.current, {
        width: '38vw',
        height: '58vh',
        borderRadius: 10,
      });
      gsap.set(scrimRef.current, { opacity: 0.94 });
      gsap.set(navRef.current, { opacity: 0, y: -24 });
      gsap.set(detailsRef.current, { opacity: 0, y: 24 });
      gsap.set(trustRef.current, { opacity: 0, y: 24 });
      gsap.set(mobileMessageRef.current, { opacity: 0, y: 24 });
      gsap.set(cueRef.current, { opacity: 1 });

      gsap.from(cueRef.current, { opacity: 0, duration: 1, delay: 2.5 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: '.hero-stage',
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      tl.to(cueRef.current, { opacity: 0, duration: 0.06 }, 0)
        .to(
          frameRef.current,
          {
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0,
        )
        .to(scrimRef.current, { opacity: 0.55, duration: 0.5 }, 0)
        .to(
          mottoRef.current,
          { scale: 0.86, y: '-6vh', duration: 0.5, ease: 'power2.inOut' },
          0,
        )
        .to(
          navRef.current,
          { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' },
          0.42,
        )
        .to(
          detailsRef.current,
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          0.5,
        )
        .to(
          trustRef.current,
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          0.5,
        )
        .to(
          mobileMessageRef.current,
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          0.5,
        );

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero-root" id="hero" aria-label="Hero section">
      <div ref={navRef} className="hero-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-content">
          <div className="nav-brand">
            <img src={logo} alt="Crystal Cabin Detailing" className="nav-logo-img" />
            <div className="nav-logo-text">
              <span className="nav-logo-line">CRYSTAL CABIN</span>
              <span className="nav-logo-sub">DETAILING</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stage">
        <div
          ref={frameRef}
          className="hero-frame"
          style={{ width: '38vw', height: '58vh', borderRadius: 10 }}
          aria-hidden="true"
        >
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80"
              alt="Luxury vehicle in professional detailing studio"
              width={1920}
              height={1280}
            />
          </div>
          <div
            ref={scrimRef}
            className="hero-scrim"
            style={{ opacity: 0.94 }}
            aria-hidden="true"
          />
        </div>

        <div className="hero-content-wrapper">
          <div
            ref={mottoRef}
            className="hero-motto"
          >
            <span className="motto-word">
              <span data-word className="motto-inner">PRECISION.</span>
            </span>
            <span className="motto-divider" aria-hidden="true" />
            <span className="motto-word">
              <span data-word className="motto-inner">PROTECTION.</span>
            </span>
            <span className="motto-divider" aria-hidden="true" />
            <span className="motto-word">
              <span data-word className="motto-inner">PERFECTION.</span>
            </span>
          </div>

          <div className="hero-motto-sub">
            <span className="motto-sub-word">
              <span data-word className="motto-sub-inner">Cleaner Car.</span>
            </span>
            <span className="motto-sub-divider" aria-hidden="true" />
            <span className="motto-sub-word">
              <span data-word className="motto-sub-inner">Better Feel.</span>
            </span>
            <span className="motto-sub-divider" aria-hidden="true" />
            <span className="motto-sub-word">
              <span data-word className="motto-sub-inner">Everytime.</span>
            </span>
          </div>

          <div className="motto-deco" aria-hidden="true">
            <span className="motto-deco-line" />
            <span className="motto-deco-stars">★&nbsp;★&nbsp;★</span>
            <span className="motto-deco-line" />
          </div>

          <div ref={detailsRef} className="hero-details">
            <motion.h1 className="hero-title">
              Perfection in
              <br />
              <span className="title-accent">Every Detail</span>.
            </motion.h1>

            <motion.p className="hero-description">
              Professional detailing at your home, office, or driveway.
            </motion.p>

            <motion.div className="hero-actions">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(200, 169, 107, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary btn-lg"
                onClick={onBookAppointment}
              >
                Book a Mobile Detail
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#2a2a2a' }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-secondary btn-lg"
                onClick={onExploreServices}
              >
                Explore Services
              </motion.button>
            </motion.div>
          </div>

          <motion.div ref={trustRef} className="hero-trust">
            <div className="trust-items">
              <div className="trust-item">
                <span className="trust-number">1+</span>
                <span className="trust-label">Year of Experience</span>
              </div>
              <div className="trust-divider" aria-hidden="true" />
              <div className="trust-item">
                <span className="trust-number">50+</span>
                <span className="trust-label">Vehicles Detailed</span>
              </div>
              <div className="trust-divider" aria-hidden="true" />
              <div className="trust-item">
                <span className="trust-number">4.8</span>
                <span className="trust-label">Customer Rating</span>
              </div>
            </div>
          </motion.div>

          <div ref={mobileMessageRef} className="mobile-message">
            <div className="mobile-message-content">
              <div className="mobile-message-icon" aria-hidden="true">
                <Truck size={28} strokeWidth={1.5} />
              </div>
              <div className="mobile-message-text">
                <div className="mobile-message-tagline">WE COME TO YOU. YOU DON'T HAVE TO WAIT.</div>
                <h3 className="mobile-message-title">Premium Detailing. Wherever You Are.</h3>
                <p className="mobile-message-description">
                  We come to your home, office, or driveway. You don't have to wait around at a detailing shop.
                </p>
              </div>
            </div>
          </div>

          <div
            ref={cueRef}
            className="hero-scroll-cue"
          >
            <span className="scroll-text">SCROLL TO EXPLORE</span>
            <div className="scroll-line">
              <ArrowDown size={20} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}