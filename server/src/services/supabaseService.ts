import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppointmentData } from '../types/appointment';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface StoredAppointment extends AppointmentData {
  id: string;
  status: AppointmentStatus;
  createdAt: string;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
      );
    }
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

interface AppointmentRow {
  id: string;
  package_id: string;
  package_name: string;
  vehicle_type_id: string;
  vehicle_type_name: string;
  price: number;
  customer: AppointmentData['customer'];
  vehicle: AppointmentData['vehicle'];
  appointment: AppointmentData['appointment'];
  service_location: AppointmentData['serviceLocation'];
  add_ons: AppointmentData['addOns'];
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
}

function toStoredAppointment(row: AppointmentRow): StoredAppointment {
  return {
    id: row.id,
    packageId: row.package_id,
    packageName: row.package_name,
    vehicleTypeId: row.vehicle_type_id,
    vehicleTypeName: row.vehicle_type_name,
    price: Number(row.price),
    customer: row.customer,
    vehicle: row.vehicle,
    appointment: row.appointment,
    serviceLocation: row.service_location,
    addOns: row.add_ons,
    notes: row.notes ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function insertAppointment(data: AppointmentData): Promise<StoredAppointment> {
  const { data: row, error } = await getClient()
    .from('appointments')
    .insert({
      package_id: data.packageId,
      package_name: data.packageName,
      vehicle_type_id: data.vehicleTypeId,
      vehicle_type_name: data.vehicleTypeName,
      price: data.price,
      customer: data.customer,
      vehicle: data.vehicle,
      appointment: data.appointment,
      service_location: data.serviceLocation,
      add_ons: data.addOns,
      notes: data.notes ?? null,
    })
    .select('*')
    .single<AppointmentRow>();

  if (error) throw new Error(`Failed to save appointment: ${error.message}`);
  return toStoredAppointment(row);
}

export async function listAppointments(): Promise<StoredAppointment[]> {
  const { data, error } = await getClient()
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to load appointments: ${error.message}`);
  return (data as AppointmentRow[]).map(toStoredAppointment);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<StoredAppointment | null> {
  const { data: row, error } = await getClient()
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select('*')
    .maybeSingle<AppointmentRow>();

  if (error) throw new Error(`Failed to update appointment: ${error.message}`);
  return row ? toStoredAppointment(row) : null;
}
