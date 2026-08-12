import { motion } from 'framer-motion';
import { Calendar, MapPin, Truck, Sparkles, CheckCircle } from 'lucide-react';
import './MobileDetailingExperience.css';

const steps = [
  {
    number: '01',
    title: 'Book Your Service',
    description: 'Choose your detailing package, vehicle type, preferred date, and time.',
    icon: Calendar,
  },
  {
    number: '02',
    title: 'Tell Us Where To Go',
    description: 'Provide the location where you\'d like your vehicle detailed.',
    icon: MapPin,
  },
  {
    number: '03',
    title: 'We Come To You',
    description: 'Our mobile detailing team arrives at your selected location with all necessary equipment and professional-grade products.',
    icon: Truck,
  },
  {
    number: '04',
    title: 'Enjoy Your Detail',
    description: 'No waiting room. No driving to a shop. Just professional detailing at your convenience.',
    icon: Sparkles,
  },
];

const benefits = [
  'We come to you',
  'Home detailing',
  'Office detailing',
  'Driveway detailing',
  'Convenient scheduling',
  'No waiting at a shop',
  'Professional products',
  'Professional detailing at your location',
];

export function MobileDetailingExperience() {
  return (
    <section className="mobile-detailing" id="mobile-detailing" aria-labelledby="mobile-detailing-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <span className="section-label">MOBILITY</span>
          <h2 id="mobile-detailing-heading" className="section-title">Your location. Your schedule. Our expertise.</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="intro-text"
        >
          <p>
            Crystal Cabin Detailing brings professional vehicle care directly to you.
            Whether you're at home, at work, or in your driveway, our mobile detailing service
            allows you to get a professionally detailed vehicle without rearranging your day around a trip to the shop.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="steps-grid"
          role="list"
        >
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="step-card"
              role="listitem"
            >
              <div className="step-number">{step.number}</div>
              <div className="step-icon" aria-hidden="true">
                <step.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="benefits-section"
        >
          <h3 className="benefits-title">
            <CheckCircle size={20} strokeWidth={1.5} aria-hidden="true" />
            The Crystal Cabin Mobile Advantage
          </h3>
          <ul className="benefits-grid" role="list">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="benefit-item"
              >
                <CheckCircle size={18} strokeWidth={2} aria-hidden="true" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="cta-banner"
        >
          <div className="cta-content">
            <h3 className="cta-title">Ready for Mobile Detailing?</h3>
            <p className="cta-text">Book your mobile detail today and experience the convenience of professional detailing at your location.</p>          </div>
          <div className="cta-actions">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book a Mobile Detail
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline btn-lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}