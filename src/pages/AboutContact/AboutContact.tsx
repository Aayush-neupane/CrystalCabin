import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Clock, Send, Camera, Share2, Music, ChevronRight, Truck } from 'lucide-react';
import { companyInfo } from '../../data/company';
import { AppointmentModal } from '../../components/AppointmentModal/AppointmentModal';
import './AboutContact.css';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function AboutContact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    packageId: string;
    packageName: string;
    vehicleTypeId: string;
    vehicleTypeName: string;
    price: number;
    addOns: { id: string; name: string; price: number }[];
  } | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[\d\s\-\(\)\+]{10,}$/.test(phone.replace(/\s/g, ''));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleBookAppointment = () => {
    setModalData({
      packageId: 'premium',
      packageName: 'PREMIUM',
      vehicleTypeId: 'sedan',
      vehicleTypeName: 'Sedan',
      price: 140,
      addOns: [],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const stats = [
    { number: '50+', label: 'Vehicles Detailed' },
    { number: '1+', label: 'Year of Experience' },
    { number: '4.8', label: 'Customer Rating' },
    { number: '100%', label: 'Attention to Detail' },
  ];

  const contactItems = [
    {
      icon: Phone,
      title: 'Call Us',
      value: companyInfo.phone,
      href: `tel:${companyInfo.phone.replace(/\D/g, '')}`,
    },
    {
      icon: Mail,
      title: 'Email',
      value: companyInfo.email,
      href: `mailto:${companyInfo.email}`,
    },
    {
      icon: Truck,
      title: 'Mobile Service Area',
      value: companyInfo.serviceArea,
      href: null,
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      value: 'Every Day | 8:00 AM – 8:00 PM',
      href: null,
    },
  ];

  const socialLinks = [
    { name: 'Instagram', href: companyInfo.social.instagram, icon: Camera },
    { name: 'Facebook', href: companyInfo.social.facebook, icon: Share2 },
    { name: 'TikTok', href: companyInfo.social.tiktok, icon: Music },
  ];

  return (
    <>
      <div className="about-contact-page">
        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="page-header"
        >
          <span className="page-eyebrow">ABOUT CRYSTAL CABIN</span>
          <h1 className="page-title">
            More Than a Detail.
            <br />
            <span className="title-accent">It's a Standard.</span>
          </h1>
          <div className="title-divider" aria-hidden="true">
            <span className="divider-line" />
            <span className="divider-dot" />
            <span className="divider-line" />
          </div>
          <p className="page-subtitle">
            We believe every vehicle deserves the same level of care, precision, and attention to detail that went into creating it.
          </p>
        </motion.header>

        {/* Main Two-Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="main-layout"
        >
          {/* Left Column - Our Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="left-column"
          >
            <div className="story-panel">
              <h2 className="section-heading">Built Around the Details</h2>
              <div className="story-content">
                <p>
                  Crystal Cabin Detailing was created with one simple idea — vehicle detailing should be about more than making a car look clean.
                </p>
                <p>
                  Our approach combines professional detailing techniques, premium products, and meticulous attention to detail to restore the appearance and preserve the condition of every vehicle we work on.
                </p>
                <p>
                  Crystal Cabin Detailing brings professional vehicle care directly to you. Whether you're at home, at work, or in your driveway, our mobile detailing service allows you to get a professionally detailed vehicle without rearranging your day around a trip to the shop.
                </p>
                <p>
                  From everyday vehicles to carefully maintained premium automobiles, we treat every vehicle with the same level of care.
                </p>
              </div>

              <h3 className="philosophy-heading">Our Philosophy</h3>
              <div className="philosophy-grid">
                {[
                  { title: 'Precision', desc: 'Every surface deserves attention.' },
                  { title: 'Protection', desc: 'A great detail should help preserve your vehicle, not simply improve its appearance for a day.' },
                  { title: 'Pride', desc: 'We treat every vehicle as if it were our own.' },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="philosophy-card"
                  >
                    <h4 className="philosophy-title">{item.title}</h4>
                    <p className="philosophy-desc">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* About Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="about-image-wrapper"
            >
              <div className="about-image">
                <img
                  src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80"
                  alt="Professionally detailed vehicle at a residential location"
                  loading="lazy"
                />
                <div className="image-overlay" aria-hidden="true" />
              </div>
              <div className="image-badge">PRECISION · CARE · PROTECTION</div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="right-column"
          >
            <div className="contact-panel">
              <h2 className="section-heading">Let's Talk About Your Vehicle</h2>
              <p className="contact-subtitle">
                Have a question, need advice, or ready to give your vehicle the treatment it deserves?
              </p>

              {/* Contact Info Cards */}
              <div className="contact-info-cards">
                {contactItems.map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.href || '#'}
                    className="contact-info-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                    target={item.href?.startsWith('http') ? '_blank' : undefined}
                    rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className="contact-icon">
                      <item.icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <div className="contact-info">
                      <span className="contact-label">{item.title}</span>
                      <span className="contact-value">{item.value}</span>
                    </div>
                    <ChevronRight size={18} strokeWidth={2} className="contact-arrow" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>

              {/* Quick Appointment CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="quick-cta"
              >
                <h3 className="cta-heading">Ready to Refresh Your Vehicle?</h3>
                <p className="cta-text">
                  Choose your detailing package and we'll come to your home, office, or driveway.
                </p>
                <motion.button
                  className="btn btn-primary btn-lg"
                  onClick={handleBookAppointment}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book a Mobile Detail
                  <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                </motion.button>
              </motion.div>

              {/* Contact Form */}
              <AnimatePresence mode="wait">
                {submitStatus === 'idle' && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="contact-form"
                    noValidate
                  >
                    <h3 className="form-heading">Send Us a Message</h3>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="acName" className="field-label">Full Name</label>
                        <input
                          type="text"
                          id="acName"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`field-input ${errors.name ? 'error' : ''}`}
                          placeholder="Your name"
                          required
                          autoComplete="name"
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                      </div>
                      <div className="form-field">
                        <label htmlFor="acEmail" className="field-label">Email Address</label>
                        <input
                          type="email"
                          id="acEmail"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`field-input ${errors.email ? 'error' : ''}`}
                          placeholder="your@email.com"
                          required
                          autoComplete="email"
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="acPhone" className="field-label">Phone Number</label>
                        <input
                          type="tel"
                          id="acPhone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`field-input ${errors.phone ? 'error' : ''}`}
                          placeholder="+1 XXX XXX XXXX"
                          required
                          autoComplete="tel"
                        />
                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="acMessage" className="field-label">Message</label>
                      <textarea
                        id="acMessage"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`field-textarea ${errors.message ? 'error' : ''}`}
                        placeholder="Tell us how we can help..."
                        rows={5}
                        required
                      />
                      {errors.message && <span className="field-error">{errors.message}</span>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="btn btn-primary btn-md btn-full"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          Send Message
                          <Send size={18} strokeWidth={2} aria-hidden="true" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}

                {submitStatus === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="form-success"
                  >
                    <div className="success-icon">
                      <div className="success-check" aria-hidden="true">✓</div>
                    </div>
                    <h4 className="success-title">Message Sent</h4>
                    <p className="success-message">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-outline btn-md"
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="social-section"
              >
                <h4 className="social-heading">Follow Crystal Cabin</h4>
                <div className="social-grid">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ y: -3, scale: 1.02 }}
                    >
                      <social.icon size={20} strokeWidth={1.5} aria-hidden="true" />
                      <span>{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Statistics Section */}        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="trust-section"
          aria-labelledby="trust-heading"
        >
          <div className="container">
            <div className="trust-grid" role="list">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="trust-item"
                  role="listitem"
                >
                  <div className="trust-number">{stat.number}</div>
                  <div className="trust-label">{stat.label}</div>
                  <div className="trust-divider" aria-hidden="true" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={modalData}
      />
    </>
  );
}