import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StoredAppointment, AppointmentStatus } from '../../types/appointment';
import { addOns as addOnCatalog } from '../../data/pricing';
import './AdminPage.css';

const TOKEN_KEY = 'cc_admin_token';

const STATUS_OPTIONS: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatTime12h(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours)) return time;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes ?? 0).padStart(2, '0')} ${suffix}`;
}

export function AdminPage() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAppointments([]);
  }, []);

  const loadAppointments = useCallback(async (authToken: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load appointments');
      }
      setAppointments(data.appointments);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      loadAppointments(token);
    }
  }, [token, loadAppointments]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) return;
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.message || 'Login failed');
        return;
      }
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setPassword('');
      setToken(data.token);
    } catch {
      setLoginError('Unable to reach the server. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleStatusChange = async (appointment: StoredAppointment, status: AppointmentStatus) => {
    if (!token || status === appointment.status) return;
    setUpdatingId(appointment.id);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update status');
      }
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointment.id ? { ...a, status } : a))
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(
    () => (statusFilter === 'all' ? appointments : appointments.filter((a) => a.status === statusFilter)),
    [appointments, statusFilter]
  );

  const counts = useMemo(() => {
    const base: Record<'all' | AppointmentStatus, number> = {
      all: appointments.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    appointments.forEach((a) => {
      base[a.status] += 1;
    });
    return base;
  }, [appointments]);

  const addOnStats = useMemo(() => {
    const stats = new Map<string, { name: string; price: number; count: number }>();
    addOnCatalog.forEach((addOn) => {
      stats.set(addOn.id, { name: addOn.name, price: addOn.price, count: 0 });
    });
    appointments.forEach((appointment) => {
      appointment.addOns.forEach((addOn) => {
        const existing = stats.get(addOn.id);
        if (existing) {
          existing.count += 1;
        } else {
          stats.set(addOn.id, { name: addOn.name, price: addOn.price, count: 1 });
        }
      });
    });
    return Array.from(stats.values());
  }, [appointments]);

  const addOnRevenue = useMemo(
    () => addOnStats.reduce((sum, stat) => sum + stat.count * stat.price, 0),
    [addOnStats]
  );

  if (!token) {
    return (
      <div className="admin-page">
        <form className="admin-login" onSubmit={handleLogin}>
          <p className="admin-login__eyebrow">Crystal Cabin Detailing</p>
          <h1 className="admin-login__title">Admin Access</h1>
          <div className="admin-login__divider" aria-hidden="true" />
          <label className="admin-login__label" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            className="admin-login__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
            autoFocus
          />
          {loginError && <p className="admin-login__error">{loginError}</p>}
          <button className="admin-login__submit" type="submit" disabled={loggingIn || !password.trim()}>
            {loggingIn ? 'Verifying…' : 'Sign In'}
          </button>
          <a className="admin-login__back" href="/">← Back to site</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-header__eyebrow">Crystal Cabin Detailing</p>
          <h1 className="admin-header__title">Appointments</h1>
        </div>
        <div className="admin-header__actions">
          <button
            className="admin-button admin-button--ghost"
            onClick={() => loadAppointments(token)}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button className="admin-button admin-button--ghost" onClick={logout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="admin-stats">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((key) => (
          <button
            key={key}
            className={`admin-stat${statusFilter === key ? ' admin-stat--active' : ''}`}
            onClick={() => setStatusFilter(key)}
          >
            <span className="admin-stat__value">{counts[key]}</span>
            <span className={`admin-stat__label admin-stat__label--${key}`}>{key}</span>
          </button>
        ))}
      </div>

      {loadError && (
        <p className="admin-error-banner">
          {loadError}
          <button className="admin-error-banner__dismiss" onClick={() => setLoadError(null)} aria-label="Dismiss">×</button>
        </p>
      )}

      {loading && appointments.length === 0 ? (
        <p className="admin-empty">Loading appointments…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-empty">
          {appointments.length === 0
            ? 'No appointments yet. New bookings will appear here automatically.'
            : `No ${statusFilter} appointments.`}
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Requested</th>
                <th>Schedule</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  expanded={expandedId === appointment.id}
                  updating={updatingId === appointment.id}
                  onToggle={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}
                  onStatusChange={(status) => handleStatusChange(appointment, status)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="admin-addons-section">
        <h2 className="admin-section-title">Add-On Sales</h2>
        <div className="admin-table-wrap">
          <table className="admin-table admin-table--addons">
            <thead>
              <tr>
                <th>Add-On</th>
                <th>Price</th>
                <th>Times Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {addOnStats.map((stat) => (
                <tr key={stat.name}>
                  <td>{stat.name}</td>
                  <td>{formatMoney(stat.price)}</td>
                  <td className={stat.count === 0 ? 'admin-table__muted' : ''}>{stat.count}</td>
                  <td className={stat.count === 0 ? 'admin-table__muted' : ''}>{formatMoney(stat.count * stat.price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="admin-table__total-row">
                <td colSpan={3}>Total Add-On Revenue</td>
                <td>{formatMoney(addOnRevenue)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

interface AppointmentRowProps {
  appointment: StoredAppointment;
  expanded: boolean;
  updating: boolean;
  onToggle: () => void;
  onStatusChange: (status: AppointmentStatus) => void;
}

function AppointmentRow({ appointment, expanded, updating, onToggle, onStatusChange }: AppointmentRowProps) {
  return (
    <>
      <tr className={`admin-table__row${expanded ? ' admin-table__row--expanded' : ''}`} onClick={onToggle}>
        <td className="admin-table__muted">{formatTimestamp(appointment.createdAt)}</td>
        <td>
          <div>{formatDate(appointment.appointment.preferredDate)}</div>
          <div className="admin-table__muted">{formatTime12h(appointment.appointment.preferredTime)}</div>
        </td>
        <td>
          <div>{appointment.customer.fullName}</div>
          <div className="admin-table__muted">{appointment.customer.phone}</div>
        </td>
        <td>
          <div>{appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}</div>
          <div className="admin-table__muted">{appointment.vehicle.vehicleType}</div>
        </td>
        <td>
          <div>{appointment.packageName}</div>
          <div className="admin-table__muted">{appointment.vehicleTypeName}</div>
        </td>
        <td>{formatMoney(appointment.price)}</td>
        <td onClick={(e) => e.stopPropagation()}>
          <select
            className={`admin-status admin-status--${appointment.status}`}
            value={appointment.status}
            disabled={updating}
            onChange={(e) => onStatusChange(e.target.value as AppointmentStatus)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="admin-details-row">
          <td colSpan={7}>
            <div className="admin-details">
              <div className="admin-details__grid">
                <section>
                  <h4>Contact</h4>
                  <p>{appointment.customer.fullName}</p>
                  <p><a href={`mailto:${appointment.customer.email}`}>{appointment.customer.email}</a></p>
                  <p><a href={`tel:${appointment.customer.phone}`}>{appointment.customer.phone}</a></p>
                </section>
                <section>
                  <h4>Service Location</h4>
                  <p>{appointment.serviceLocation.address}</p>
                  {appointment.serviceLocation.unit && <p>Unit {appointment.serviceLocation.unit}</p>}
                </section>
              </div>
              <PurchaseTable appointment={appointment} />
              {appointment.notes && (
                <section className="admin-details__notes">
                  <h4>Notes</h4>
                  <p>{appointment.notes}</p>
                </section>
              )}
              <p className="admin-details__meta">Booking ID: {appointment.id}</p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function PurchaseTable({ appointment }: { appointment: StoredAppointment }) {
  const addOnTotal = appointment.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const total = appointment.price + addOnTotal;

  return (
    <section className="admin-details__purchase">
      <h4>Purchase Breakdown</h4>
      <div className="admin-purchase-wrap">
        <table className="admin-purchase">
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{appointment.packageName}</td>
              <td className="admin-table__muted">Package — {appointment.vehicleTypeName}</td>
              <td>{formatMoney(appointment.price)}</td>
            </tr>
            {appointment.addOns.map((addOn) => (
              <tr key={addOn.id}>
                <td>{addOn.name}</td>
                <td className="admin-table__muted">Add-on</td>
                <td>{formatMoney(addOn.price)}</td>
              </tr>
            ))}
            {appointment.addOns.length === 0 && (
              <tr>
                <td colSpan={3} className="admin-table__muted">No add-ons purchased</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total</td>
              <td>{formatMoney(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
