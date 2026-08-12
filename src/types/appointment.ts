export interface AppointmentFormData {
  packageId: string;
  packageName: string;
  vehicleTypeId: string;
  vehicleTypeName: string;
  price: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: string;
    vehicleType: string;
  };
  appointment: {
    preferredDate: string;
    preferredTime: string;
  };
  serviceLocation: {
    address: string;
    unit?: string;
  };
  addOns: {
    id: string;
    name: string;
    price: number;
  }[];
  notes: string;
}

export interface AppointmentSubmissionData extends AppointmentFormData {
  submittedAt: string;
}

export interface ValidationErrors {
  packageId?: string;
  vehicleTypeId?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  vehicle?: {
    make?: string;
    model?: string;
    year?: string;
    vehicleType?: string;
  };
  appointment?: {
    preferredDate?: string;
    preferredTime?: string;
  };
  serviceLocation?: {
    address?: string;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: ValidationErrors;
}