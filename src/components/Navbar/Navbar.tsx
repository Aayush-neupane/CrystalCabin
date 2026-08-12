import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';
import { navigation } from '../../data/company';
import './Navbar.css';

interface NavbarProps {
  onBookAppointment: () => void;
}

export function Navbar({ onBookAppointment }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container" role="navigation" aria-label="Main navigation">
        <div className="navbar-logo" aria-label="Crystal Cabin Detailing Home">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="logo-icon"
          >
            <img src={logo} alt="Crystal Cabin Detailing" className="logo-img" />
          </motion.div>
          <div className="logo-text">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="logo-line"
            >
              CRYSTAL CABIN
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="logo-line logo-sub"
            >
              DETAILING
            </motion.span>
          </div>
        </div>

        <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <AnimatePresence mode="wait">
            {isMobileMenuOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="nav-list"
              >
                {navigation.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <a
                      href={item.href}
                      className="nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {!isMobileMenuOpen && (
            <ul className="nav-list desktop">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {isMobileMenuOpen && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-md nav-mobile-cta"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookAppointment();
              }}
            >
              Book a Mobile Detail
            </motion.button>
          )}
        </div>

        <div className="navbar-actions">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary btn-sm"
            onClick={onBookAppointment}
          >
            Book a Mobile Detail
          </motion.button>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>
    </header>
  );
}