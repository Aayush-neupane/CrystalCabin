import { Request, Response } from 'express';
import { z } from 'zod';
import { sendAppointmentEmail } from '../services/emailService';
import { AppointmentData, ApiResponse } from '../types/appointment';

const appointmentSchema = z.object({
  packageId: z.string().min(1, 'Package is required'),
  packageName: z.string().min(1, 'Package name is required'),
  vehicleTypeId: z.string().min(1, 'Vehicle type is required'),
  vehicleTypeName: z.string().min(1, 'Vehicle type name is required'),
  price: z.number().positive('Price must be positive'),
  customer: z.object({
    fullName: z.string().min(1, 'Full name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
  }),
  vehicle: z.object({
    make: z.string().min(1, 'Vehicle make is required').max(50),
    model: z.string().min(1, 'Vehicle model is required').max(50),
    year: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
    vehicleType: z.string().min(1, 'Vehicle type is required'),
  }),
  appointment: z.object({
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    preferredTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  }),
  serviceLocation: z.object({
    address: z.string().min(1, 'Service location is required').max(200),
    unit: z.string().max(200).optional(),
  }),
  addOns: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  })).default([]),
  notes: z.string().max(1000).optional(),
});

export async function createAppointment(req: Request, res: Response): Promise<void> {
  try {
    const validatedData = appointmentSchema.parse(req.body);
    const appointmentData: AppointmentData = validatedData;

    const emailData = {
      ...appointmentData,
      submittedAt: new Date().toISOString(),
    };

    await sendAppointmentEmail(emailData);

    const response: ApiResponse = {
      success: true,
      message: 'Appointment request submitted successfully. Our team will contact you shortly to confirm.',
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });

      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        errors,
      };

      res.status(400).json(response);
      return;
    }

    console.error('Appointment creation error:', error);

    const response: ApiResponse = {
      success: false,
      message: 'Failed to submit appointment request. Please try again later.',
    };

    res.status(500).json(response);
  }
}