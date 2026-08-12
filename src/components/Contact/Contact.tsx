import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Truck, Clock, Send } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { companyInfo } from '../../data/company';
import './Contact.css';

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

const socialLinks = [
  { name: 'Instagram', href: companyInfo.social.instagram, icon: faInstagram, className: 'social-instagram' },
  { name: 'Facebook', href: companyInfo.social.facebook, icon: faFacebookF, className: 'social-facebook' },
  { name: 'TikTok', href: companyInfo.social.tiktok, icon: faTiktok, className: 'social-tiktok' },
];

export function Contact() {
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

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <span className="section-label">CONTACT</span>
          <h2 id="contact-heading" className="section-title">Let's Talk About Your Vehicle</h2>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="contact-info"
          >
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">
                  <Phone size={22} strokeWidth={1.5} />
                </div>
                <div className="contact-content">
                  <h3 className="contact-card-title">Phone</h3>
                  <p className="contact-card-text">
                    <a href={`tel:${companyInfo.phone.replace(/\D/g, '')}`}>{companyInfo.phone}</a>
                  </p>
                  <p className="contact-card-text">
                    <a href={`tel:${companyInfo.phoneAlt.replace(/\D/g, '')}`}>{companyInfo.phoneAlt}</a>
                  </p>
                  <span className="contact-hours">Open Every Day 8AM-8PM</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <div className="contact-content">
                  <h3 className="contact-card-title">Email</h3>
                  <p className="contact-card-text">
                    <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
                  </p>
                  <span className="contact-hours">24hr Response Time</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Truck size={22} strokeWidth={1.5} />
                </div>
                <div className="contact-content">
                  <h3 className="contact-card-title">Mobile Service Area</h3>
                  <p className="contact-card-text">{companyInfo.serviceArea}</p>
                  <span className="contact-hours">{companyInfo.serviceModel}</span>
                </div>
              </div>
            </div>

            <div className="service-model-note">
              <Truck size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{companyInfo.serviceModel} — no need to travel to a detailing shop.</span>
            </div>

            <div className="hours-section">
              <h3 className="hours-title">
                <Clock size={18} strokeWidth={1.5} aria-hidden="true" />
                Opening Hours
              </h3>
              <div className="hours-list">
                {companyInfo.hours.map((hour, index) => (
                  <div key={index} className="hours-item">
                    <span className="hours-day">{hour.day}</span>
                    <span className="hours-time">{hour.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="contact-form-wrapper"
          >
            <div className="contact-form-card">
              <h3 className="form-title">Send a Message</h3>
              <p className="form-subtitle">We'll get back to you within 24 hours.</p>

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
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="contactName" className="field-label">Name</label>
                        <input
                          type="text"
                          id="contactName"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`field-input ${errors.name ? 'error' : ''}`}
                          placeholder="Your full name"
                          required
                          autoComplete="name"
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                      </div>
                      <div className="form-field">
                        <label htmlFor="contactEmail" className="field-label">Email</label>
                        <input
                          type="email"
                          id="contactEmail"
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
                        <label htmlFor="contactPhone" className="field-label">Phone</label>
                        <input
                          type="tel"
                          id="contactPhone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`field-input ${errors.phone ? 'error' : ''}`}
                          placeholder="(555) 000-0000"
                          required
                          autoComplete="tel"
                        />
                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="contactMessage" className="field-label">Message</label>
                      <textarea
                        id="contactMessage"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`field-textarea ${errors.message ? 'error' : ''}`}
                        placeholder="Tell us about your vehicle and what you're looking for..."
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

                    {/* OR Separator */}
                    <div className="or-separator" aria-hidden="true">
                      <span className="or-line"></span>
                      <span className="or-text">OR</span>
                      <span className="or-line"></span>
                    </div>

                    {/* Social Buttons */}
                    <div className="contact-form-socials">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`social-btn ${social.className}`}
                          aria-label={social.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                          whileHover={{ scale: 1.05, y: -3 }}
                        >
                          <FontAwesomeIcon icon={social.icon} size="2xl" aria-hidden="true" />
                          <span className="social-platform">{social.name}</span>
                        </motion.a>
                      ))}
                    </div>
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
                      className="btn btn-outline"
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}