import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { pricingPackages, vehicleTypes, addOns, calculatePrice, formatPrice } from '../../data/pricing';
import './Pricing.css';

interface PricingProps {
  onBookAppointment: (packageId: string, vehicleTypeId: string, price: number, addOnIds: string[]) => void;
}

const vehicleIcons = {
  sedan: (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 10h1.5c.3 0 .5-.2.5-.5V6c0-.3-.2-.5-.5-.5H3c-.3 0-.5.2-.5.5v3.5c0 .3.2.5.5.5zM17 10h-1.5c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5H17c.3 0 .5.2.5.5v3.5c0 .3-.2.5-.5.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 10c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 10c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  suv: (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 11V6c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 11h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  truck: (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 11h5.5c.3 0 .5-.2.5-.5V6c0-.3-.2-.5-.5-.5H1c-.3 0-.5.2-.5.5v4.5c0 .3.2.5.5.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 11V4h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

const packageIcons = {
  basic: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 14l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  premium: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 2L4 10v14h20V10L14 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 7v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  signature: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 8v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

export function Pricing({ onBookAppointment }: PricingProps) {
  const [selectedVehicleType, setSelectedVehicleType] = useState('sedan');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => prev.includes(addOnId)
      ? prev.filter(id => id !== addOnId)
      : [...prev, addOnId]
    );
  };

  const getAddOnPrice = (addOnId: string) => {
    const addOn = addOns.find(a => a.id === addOnId);
    return addOn?.price || 0;
  };

  const getTotalPrice = (packageId: string) => {
    const basePrice = calculatePrice(packageId, selectedVehicleType);
    const addOnTotal = selectedAddOns.reduce((sum, id) => sum + getAddOnPrice(id), 0);
    return basePrice + addOnTotal;
  };

  const handleBookAppointment = (packageId: string) => {
    const price = getTotalPrice(packageId);
    onBookAppointment(packageId, selectedVehicleType, price, selectedAddOns);
  };

  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <span className="section-label">PRICING TABLE</span>
        </motion.div>

        {/* Vehicle Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="vehicle-selector"
          role="group"
          aria-label="Select vehicle type"
        >
          {vehicleTypes.map((vehicle, index) => (
            <motion.button
              key={vehicle.id}
              className={`vehicle-option ${selectedVehicleType === vehicle.id ? 'active' : ''}`}
              onClick={() => setSelectedVehicleType(vehicle.id)}
              aria-pressed={selectedVehicleType === vehicle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedVehicleType === vehicle.id && (
                <motion.span
                  className="vehicle-indicator"
                  layoutId="vehicle-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="vehicle-icon" aria-hidden="true">
                {vehicleIcons[vehicle.icon as keyof typeof vehicleIcons]}
              </span>
              <span className="vehicle-label">{vehicle.shortName}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`pricing-cards ${isMobile ? 'mobile' : 'desktop'}`}
          role="list"
        >
          {pricingPackages.map((pkg, pkgIndex) => (
            <motion.article
              key={pkg.id}
              className={`pricing-card ${pkg.isPopular ? 'popular' : ''}`}
              role="listitem"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * pkgIndex }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' }}
            >
              {pkg.isPopular && (
                <span className="popular-badge">MOST POPULAR</span>
              )}

              <div className="card-header">
                <div className="package-icon" aria-hidden="true">
                  {packageIcons[pkg.id as keyof typeof packageIcons]}
                </div>
                <h3 className="package-name">{pkg.name}</h3>
                <div className="rating" aria-label="5 star rating">
                  <span className="stars" aria-hidden="true">★★★★★</span>
                </div>
              </div>

              <div className="price-container">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={getTotalPrice(pkg.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="price"
                  >
                    {formatPrice(getTotalPrice(pkg.id))}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Add-Ons Section */}
              {addOns.length > 0 && (
                <div className="addons-section">
                  <h4 className="features-title">Optional Add-Ons</h4>
                  <ul className="addons-list" role="list">
                    {addOns.map((addOn, addOnIndex) => (
                      <motion.li
                        key={addOn.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * addOnIndex }}
                        className="addon-item"
                      >
                        <label className="addon-label">
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addOn.id)}
                            onChange={() => toggleAddOn(addOn.id)}
                            className="addon-checkbox"
                          />
                          <span className="addon-info">
                            <span className="addon-name">{addOn.name}</span>
                            <span className="addon-price">Starting from {formatPrice(addOn.price)}</span>
                          </span>
                        </label>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="features-section">
                <h4 className="features-title">Feature Breakdown</h4>
                <ul className="features-list" role="list">
                  {pkg.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * featureIndex }}
                      className="feature-item"
                    >
                      <span className="feature-name">{feature}</span>
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 * featureIndex }}
                        className="feature-check"
                        aria-hidden="true"
                      >
                        <Check size={16} strokeWidth={2.5} />
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.button
                className={`btn btn-md ${pkg.isPopular ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleBookAppointment(pkg.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book a Mobile Detail
              </motion.button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}