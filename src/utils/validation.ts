import type { AppointmentFormData, ValidationErrors } from '../types/appointment';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateAppointmentForm(data: AppointmentFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.packageId) {
    errors.packageId = 'Please select a package';
  }

  if (!data.vehicleTypeId) {
    errors.vehicleTypeId = 'Please select a vehicle type';
  }

  if (!data.customer.fullName.trim()) {
    errors.customer = { ...errors.customer, fullName: 'Full name is required' };
  }

  if (!data.customer.email.trim()) {
    errors.customer = { ...errors.customer, email: 'Email is required' };
  } else if (!validateEmail(data.customer.email)) {
    errors.customer = { ...errors.customer, email: 'Please enter a valid email address' };
  }

  if (!data.customer.phone.trim()) {
    errors.customer = { ...errors.customer, phone: 'Phone number is required' };
  } else if (!validatePhone(data.customer.phone)) {
    errors.customer = { ...errors.customer, phone: 'Please enter a valid phone number' };
  }

  if (!data.vehicle.make.trim()) {
    errors.vehicle = { ...errors.vehicle, make: 'Vehicle make is required' };
  }

  if (!data.vehicle.model.trim()) {
    errors.vehicle = { ...errors.vehicle, model: 'Vehicle model is required' };
  }

  if (!data.vehicle.year.trim()) {
    errors.vehicle = { ...errors.vehicle, year: 'Vehicle year is required' };
  } else {
    const year = parseInt(data.vehicle.year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1980 || year > currentYear + 1) {
      errors.vehicle = { ...errors.vehicle, year: 'Please enter a valid year' };
    }
  }

  if (!data.vehicle.vehicleType.trim()) {
    errors.vehicle = { ...errors.vehicle, vehicleType: 'Vehicle type is required' };
  }

  if (!data.appointment.preferredDate) {
    errors.appointment = { ...errors.appointment, preferredDate: 'Preferred date is required' };
  }

  if (!data.appointment.preferredTime) {
    errors.appointment = { ...errors.appointment, preferredTime: 'Preferred time is required' };
  }

  if (!data.serviceLocation.address.trim()) {
    errors.serviceLocation = { ...errors.serviceLocation, address: 'Service location is required' };
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(
    (value) => value && (typeof value === 'string' || Object.keys(value).length > 0)
  );
}