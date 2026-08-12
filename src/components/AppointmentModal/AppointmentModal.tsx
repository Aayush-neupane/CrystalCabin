import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Car, Mail, Phone, CheckCircle, Loader2, MapPin } from 'lucide-react';
import { validateAppointmentForm, hasErrors } from '../../utils/validation';
import type { AppointmentFormData, ValidationErrors } from '../../types/appointment';
import './AppointmentModal.css';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    packageId: string;
    packageName: string;
    vehicleTypeId: string;
    vehicleTypeName: string;
    price: number;
    addOns: { id: string; name: string; price: number }[];
  } | null;
}

const initialFormState: AppointmentFormData = {
  packageId: '',
  packageName: '',
  vehicleTypeId: '',
  vehicleTypeName: '',
  price: 0,
  customer: {
    fullName: '',
    email: '',
    phone: '',
  },
  vehicle: {
    make: '',
    model: '',
    year: '',
    vehicleType: '',
  },
  appointment: {
    preferredDate: '',
    preferredTime: '',
  },
serviceLocation: {
      address: '',
      unit: '',
    },
    addOns: [],
    notes: '',
};

export function AppointmentModal({ isOpen, onClose, initialData }: AppointmentModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialFormState,
        packageId: initialData.packageId,
        packageName: initialData.packageName,
        vehicleTypeId: initialData.vehicleTypeId,
        vehicleTypeName: initialData.vehicleTypeName,
        price: initialData.price,
        addOns: initialData.addOns || [],
        vehicle: {
          ...initialFormState.vehicle,
          vehicleType: initialData.vehicleTypeName,
        },
      });
      setErrors({});
      setSubmitStatus('idle');
      setErrorMessage('');
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 300);
    } else if (!isOpen) {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parts = name.split('.');
    setFormData((prev) => {
      const newState: Record<string, unknown> = { ...prev };
      if (parts.length === 2) {
        const [parent, child] = parts;
        const parentKey = parent;
        const parentValue = newState[parentKey];
        if (parentValue && typeof parentValue === 'object') {
          newState[parentKey] = {
            ...(parentValue as Record<string, unknown>),
            [child]: value,
          };
        }
      } else {
        newState[name] = value;
      }
      return newState as unknown as AppointmentFormData;
    });

    const errorKey = parts[0] as keyof ValidationErrors;
    const errorSubKey = parts[1];
    if (errorKey && errorSubKey && errors[errorKey] && typeof errors[errorKey] === 'object' && errorSubKey in errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: {
          ...(prev[errorKey] as Record<string, unknown>),
          [errorSubKey]: undefined,
        } as any,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAppointmentForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Failed to submit appointment. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="modal"
          onKeyDown={handleKeyDown}
        >
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={24} strokeWidth={2} />
          </button>

          <AnimatePresence mode="wait">
            {submitStatus === 'idle' && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="modal-form"
              >
                <div className="modal-header">
                  <h2 id="modal-title" className="modal-title">BOOK YOUR APPOINTMENT</h2>
                  <div className="modal-summary">
                    <div className="summary-item">
                      <span className="summary-label">Package</span>
                      <span className="summary-value">{formData.packageName}</span>
                    </div>
                    <div className="summary-divider" aria-hidden="true" />
                    <div className="summary-item">
                      <span className="summary-label">Vehicle</span>
                      <span className="summary-value">{formData.vehicleTypeName}</span>
                    </div>
                    <div className="summary-divider" aria-hidden="true" />
                    <div className="summary-item price">
                      <span className="summary-label">Price</span>
                      <span className="summary-value">${formData.price}</span>
                    </div>
                    {formData.addOns.length > 0 && (
                      <div className="summary-item summary-addons">
                        <span className="summary-label">Add-Ons</span>
                        <span className="summary-value">{formData.addOns.map(a => a.name).join(' • ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-heading">
                    <span className="section-number">01</span>
                    Customer Information
                  </h3>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="fullName" className="field-label">Full Name</label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="fullName"
                        name="customer.fullName"
                        value={formData.customer.fullName}
                        onChange={handleChange}
                        className={`field-input ${errors.customer?.fullName ? 'error' : ''}`}
                        placeholder="John Doe"
                        autoComplete="name"
                        required
                      />
                      {errors.customer?.fullName && (
                        <span className="field-error">{errors.customer.fullName}</span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="email" className="field-label">Email</label>
                      <div className="input-with-icon">
                        <Mail size={18} strokeWidth={2} className="input-icon" aria-hidden="true" />
                        <input
                          type="email"
                          id="email"
                          name="customer.email"
                          value={formData.customer.email}
                          onChange={handleChange}
                          className={`field-input ${errors.customer?.email ? 'error' : ''}`}
                          placeholder="john@example.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                      {errors.customer?.email && (
                        <span className="field-error">{errors.customer.email}</span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="phone" className="field-label">Phone Number</label>
                      <div className="input-with-icon">
                        <Phone size={18} strokeWidth={2} className="input-icon" aria-hidden="true" />
                        <input
                          type="tel"
                          id="phone"
                          name="customer.phone"
                          value={formData.customer.phone}
                          onChange={handleChange}
                          className={`field-input ${errors.customer?.phone ? 'error' : ''}`}
                          placeholder="(555) 000-0000"
                          autoComplete="tel"
                          required
                        />
                      </div>
                      {errors.customer?.phone && (
                        <span className="field-error">{errors.customer.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-heading">
                    <span className="section-number">02</span>
                    Vehicle Details
                  </h3>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="make" className="field-label">Make</label>
                      <input
                        type="text"
                        id="make"
                        name="vehicle.make"
                        value={formData.vehicle.make}
                        onChange={handleChange}
                        className={`field-input ${errors.vehicle?.make ? 'error' : ''}`}
                        placeholder="BMW"
                        required
                      />
                      {errors.vehicle?.make && (
                        <span className="field-error">{errors.vehicle.make}</span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="model" className="field-label">Model</label>
                      <input
                        type="text"
                        id="model"
                        name="vehicle.model"
                        value={formData.vehicle.model}
                        onChange={handleChange}
                        className={`field-input ${errors.vehicle?.model ? 'error' : ''}`}
                        placeholder="M4"
                        required
                      />
                      {errors.vehicle?.model && (
                        <span className="field-error">{errors.vehicle.model}</span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="year" className="field-label">Year</label>
                      <input
                        type="number"
                        id="year"
                        name="vehicle.year"
                        value={formData.vehicle.year}
                        onChange={handleChange}
                        className={`field-input ${errors.vehicle?.year ? 'error' : ''}`}
                        placeholder="2023"
                        min="1980"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                      {errors.vehicle?.year && (
                        <span className="field-error">{errors.vehicle.year}</span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="vehicleType" className="field-label">Vehicle Type</label>
                      <div className="input-with-icon">
                        <Car size={18} strokeWidth={2} className="input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="vehicleType"
                          name="vehicle.vehicleType"
                          value={formData.vehicle.vehicleType}
                          className="field-input"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-heading">
                    <span className="section-number">03</span>
                    Appointment Details
                  </h3>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="preferredDate" className="field-label">Preferred Date</label>
                      <div className="input-with-icon">
                        <Calendar size={18} strokeWidth={2} className="input-icon" aria-hidden="true" />
                        <input
                          type="date"
                          id="preferredDate"
                          name="appointment.preferredDate"
                          value={formData.appointment.preferredDate}
                          onChange={handleChange}
                          className={`field-input ${errors.appointment?.preferredDate ? 'error' : ''}`}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      {errors.appointment?.preferredDate && (
                        <span className="field-error">{errors.appointment.preferredDate}</span>
                      )}
                    </div>
                    <div className="form-field">
                      <label htmlFor="preferredTime" className="field-label">Preferred Time</label>
                      <div className="input-with-icon">
                        <Clock size={18} strokeWidth={2} className="input-icon" aria-hidden="true" />
                        <select
                          id="preferredTime"
                          name="appointment.preferredTime"
                          value={formData.appointment.preferredTime}
                          onChange={handleChange}
                          className={`field-input ${errors.appointment?.preferredTime ? 'error' : ''}`}
                          required
                        >
                          <option value="">Select a time</option>
                          <option value="08:00">8:00 AM</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                          <option value="18:00">6:00 PM</option>
                          <option value="19:00">7:00 PM</option>
                          <option value="20:00">8:00 PM</option>
                        </select>
                      </div>
                      {errors.appointment?.preferredTime && (
                        <span className="field-error">{errors.appointment.preferredTime}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-heading">
                    <span className="section-number">04</span>
                    Service Location
                  </h3>
                  <p className="section-hint">We come to you — let us know where to find your vehicle.</p>
                  <div className="form-grid">
                    <div className="form-field full-width">
                      <label htmlFor="serviceAddress" className="field-label">Your Address / Location</label>
                      <div className="input-with-icon">
                        <MapPin size={18} strokeWidth={2} className="input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="serviceAddress"
                          name="serviceLocation.address"
                          value={formData.serviceLocation.address}
                          onChange={handleChange}
                          className={`field-input ${errors.serviceLocation?.address ? 'error' : ''}`}
                          placeholder="Home, office, or driveway address"
                          autoComplete="street-address"
                          required
                        />
                      </div>
                      {errors.serviceLocation?.address && (
                        <span className="field-error">{errors.serviceLocation.address}</span>
                      )}
                    </div>
                    <div className="form-field full-width">
                      <label htmlFor="serviceUnit" className="field-label">Apartment / Unit / Additional Location Details <span className="field-optional">(optional)</span></label>
                      <input
                        type="text"
                        id="serviceUnit"
                        name="serviceLocation.unit"
                        value={formData.serviceLocation.unit}
                        onChange={handleChange}
                        className="field-input"
                        placeholder="Gate code, building, parking instructions..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-heading">
                    <span className="section-number">05</span>
                    Additional Notes
                  </h3>
                  <div className="form-field full-width">
                    <label htmlFor="notes" className="field-label">Special Requests or Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="field-textarea"
                      placeholder="Any specific concerns, areas of focus, or special requests..."
                      rows={4}
                    />
                  </div>
                </div>

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="form-error-message"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn btn-primary btn-md btn-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} strokeWidth={2} className="spinner" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    'Request Appointment'
                  )}
                </motion.button>

                <p className="form-disclaimer">
                  Submitting this form sends a request to our team. Your appointment is not confirmed until we contact you to finalize the details.
                </p>
              </motion.form>
            )}

            {submitStatus === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="success-state"
              >
                <div className="success-icon">
                  <CheckCircle size={64} strokeWidth={1.5} />
                </div>
                <h3 className="success-title">Appointment Request Received</h3>
                <p className="success-message">
                  Thank you. Your request has been successfully submitted. Our team will contact you shortly to confirm your appointment.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary btn-md"
                  onClick={onClose}
                >
                  Close
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}