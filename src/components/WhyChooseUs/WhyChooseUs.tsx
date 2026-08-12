import { motion } from 'framer-motion';
import { Target, Sparkles, Award, Shield, Car, CheckCircle } from 'lucide-react';
import { whyChooseUs } from '../../data/company';
import './WhyChooseUs.css';

const iconMap = {
  target: Target,
  sparkles: Sparkles,
  award: Award,
  shield: Shield,
  car: Car,
  'check-circle': CheckCircle,
};

export function WhyChooseUs() {
  return (
    <section className="why-choose-us" id="why-choose-us" aria-labelledby="why-choose-us-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <span className="section-label">WHY CRYSTAL CABIN</span>
          <h2 id="why-choose-us-heading" className="section-title">
            Because exceptional detailing is about more than making your car look clean.
          </h2>
        </motion.div>

        <div className="features-grid" role="list">
          {whyChooseUs.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Target;
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="feature-card"
                role="listitem"
              >
                <div className="feature-icon">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}