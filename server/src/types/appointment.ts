export interface AppointmentData {
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
  notes?: string;
}

export interface AppointmentEmailData extends AppointmentData {
  submittedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}