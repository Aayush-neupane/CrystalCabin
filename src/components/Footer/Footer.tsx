import { motion } from 'framer-motion';
import { Camera, Share2, Music, ArrowUp } from 'lucide-react';
import logo from '../../assets/logo.png';
import { companyInfo, navigation } from '../../data/company';
import './Footer.css';

interface FooterNavItem {
  label: string;
  href: string;
  icon?: typeof Camera | typeof Share2 | typeof Music;
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerNav: Record<string, FooterNavItem[]> = {
    Navigation: navigation.slice(0, 6).map(item => ({ label: item.label, href: item.href })),
    Services: [
      { label: 'Interior Detailing', href: '#pricing' },
      { label: 'Exterior Detailing', href: '#pricing' },
      { label: 'Ceramic Coating', href: '#pricing' },
      { label: 'Paint Protection', href: '#pricing' },
      { label: 'Signature Detail', href: '#pricing' },
    ],
    Contact: [
      { label: companyInfo.phone, href: `tel:${companyInfo.phone.replace(/\D/g, '')}` },
      { label: companyInfo.phoneAlt, href: `tel:${companyInfo.phoneAlt.replace(/\D/g, '')}` },
      { label: companyInfo.email, href: `mailto:${companyInfo.email}` },
      { label: companyInfo.serviceModel, href: '#mobile-detailing' },
    ],
    Social: [
      { label: 'Instagram', href: companyInfo.social.instagram, icon: Camera },
      { label: 'Facebook', href: companyInfo.social.facebook, icon: Share2 },
      { label: 'TikTok', href: companyInfo.social.tiktok, icon: Music },
    ],
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="footer-main"
        >
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Crystal Cabin Detailing" className="footer-logo-img" />

            </div>
            <p className="footer-tagline">{companyInfo.tagline}</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            {Object.entries(footerNav).map(([sectionTitle, items], sectionIndex) => (
              <motion.div
                key={sectionTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * sectionIndex }}
                className="footer-section"
              >
                <h4 className="footer-section-title">{sectionTitle}</h4>
                <ul className="footer-list">
                  {items.map((item, itemIndex) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * itemIndex }}
                    >
                      <a
                        href={item.href}
                        className="footer-link"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.icon ? (
                          <>
                            <item.icon size={16} strokeWidth={2} className="footer-link-icon" aria-hidden="true" />
                            {item.label}
                          </>
                        ) : (
                          item.label
                        )}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="footer-bottom"
        >
          <div className="footer-divider" aria-hidden="true" />

          <div className="footer-copyright">
            <p className="copyright-text">
              © {currentYear} Crystal Cabin Detailing. All Rights Reserved.
            </p>
            <p className="built-by-text">
              Website built by{' '}
              <a
                href="https://dynamic-aayush38.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="built-by-link"
              >
                DynamicAayush
              </a>
            </p>
          </div>

          <div className="footer-legal">
            <a href="#" className="legal-link">Privacy Policy</a>
            <span className="legal-divider" aria-hidden="true" />
            <a href="#" className="legal-link">Terms of Service</a>
          </div>

          <button className="btn btn-ghost btn-sm scroll-top" aria-label="Scroll to top">
            <ArrowUp size={20} strokeWidth={2} />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}