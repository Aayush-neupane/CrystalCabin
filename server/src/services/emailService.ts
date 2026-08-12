import nodemailer from 'nodemailer';
import { AppointmentEmailData } from '../types/appointment';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Read logo file once at startup
const logoCandidates = [
  path.join(process.cwd(), 'src', 'assets', 'logo.png'),
  path.join(__dirname, '..', '..', '..', '..', 'src', 'assets', 'logo.png'),
  path.join(process.cwd(), 'crystal-cabin-detailing', 'src', 'assets', 'logo.png'),
];
let logoBase64 = '';
for (const logoPath of logoCandidates) {
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    logoBase64 = logoBuffer.toString('base64');
    break;
  } catch (e) {
    // try next candidate
  }
}
if (!logoBase64) {
  console.warn('Could not load logo.png for emails');
}

const FONT = "Georgia, 'Times New Roman', Times, serif";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function sectionHeader(label: string, title: string): string {
  return `
    <tr>
      <td style="padding-bottom: 12px; border-bottom: 1px solid #e8e2d6;">
        <p style="margin: 0 0 4px; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #a8873d;">${label}</p>
        <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1c1c1c;">${title}</p>
      </td>
    </tr>`;
}

function metaRow(label: string, value: string, sub?: string): string {
  return `
    <td style="width: 50%; padding-right: 20px; vertical-align: top;">
      <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #999;">${label}</p>
      <p style="margin: 0; font-size: 15px; color: #333;">${value}</p>
      ${sub ? `<p style="margin: 4px 0 0; font-size: 13px; color: #888;">${sub}</p>` : ''}
    </td>`;
}

export async function sendAppointmentEmail(data: AppointmentEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL environment variable is not set');
  }

  const logoCid = 'logo@crystalcabin';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Appointment Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: ${FONT}; background-color: #f6f4ef;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e8e2d6;">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 40px; background-color: #101010; border-bottom: 1px solid #2a2a2a;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="display: flex; align-items: center; gap: 12px;">
              <img src="cid:${logoCid}" alt="Crystal Cabin Detailing" style="width: 40px; height: 40px; display: block;" />
              <div>
                <p style="margin: 0; font-size: 15px; font-weight: 700; letter-spacing: 2px; color: #f5f5f5;">CRYSTAL CABIN</p>
                <p style="margin: -2px 0 0; font-size: 10px; font-weight: 400; letter-spacing: 4px; color: #c8a96b;">DETAILING</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Alert Badge -->
    <tr>
      <td style="padding: 28px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #faf6ee; border: 1px solid #e0cfa8; border-radius: 4px; padding: 14px 24px;">
              <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #a8873d;">NEW APPOINTMENT REQUEST</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 8px 40px 40px;">
        <!-- Customer Section -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          ${sectionHeader('CUSTOMER', data.customer.fullName)}
          <tr>
            <td style="padding: 16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${metaRow('Email', `<a href="mailto:${data.customer.email}" style="color: #a8873d; text-decoration: none;">${data.customer.email}</a>`)}
                  ${metaRow('Phone', `<a href="tel:${data.customer.phone}" style="color: #333; text-decoration: none;">${data.customer.phone}</a>`)}
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Vehicle Section -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          ${sectionHeader('VEHICLE', `${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}`)}
          <tr>
            <td style="padding: 16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${metaRow('Vehicle Type', data.vehicle.vehicleType)}
                  ${metaRow('Submitted', `${formatDate(data.submittedAt)} at ${formatTime(data.submittedAt.split('T')[1] || '')}`)}
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Appointment Section -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          ${sectionHeader('APPOINTMENT', data.packageName)}
          <tr>
            <td style="padding: 16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${metaRow('Preferred Date', formatDate(data.appointment.preferredDate))}
                  ${metaRow('Preferred Time', formatTime(data.appointment.preferredTime))}
                </tr>
                <tr>
                  <td style="padding-top: 20px;" colspan="2">
                    <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #999;">Price</p>
                    <p style="margin: 0; font-size: 26px; font-weight: 700; color: #a8873d;">$${data.price}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Service Location Section -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          ${sectionHeader('SERVICE LOCATION', '')}
          <tr>
            <td style="padding: 16px 0;">
              <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #999;">Address</p>
              <p style="margin: 0; font-size: 15px; color: #333;">${data.serviceLocation.address}</p>
              ${data.serviceLocation.unit ? `
              <p style="margin: 8px 0 0 4px; font-size: 13px; color: #888;">${data.serviceLocation.unit}</p>
              ` : ''}
            </td>
          </tr>
        </table>

        <!-- Add-Ons Section -->
        ${data.addOns && data.addOns.length > 0 ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          ${sectionHeader('ADD-ONS', '')}
          <tr>
            <td style="padding: 16px 0;">
              ${data.addOns.map((addOn) => `
              <p style="margin: 0 0 8px; font-size: 15px; color: #333;">
                &bull; ${addOn.name}
                <span style="color: #a8873d;">(+$${addOn.price})</span>
              </p>
              `).join('')}
            </td>
          </tr>
        </table>
        ` : ''}

        <!-- Notes Section -->
        ${data.notes ? `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
          ${sectionHeader('ADDITIONAL NOTES', '')}
          <tr>
            <td style="padding: 16px 0;">
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #444; white-space: pre-wrap;">${data.notes}</p>
            </td>
          </tr>
        </table>
        ` : ''}

        <!-- Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #e8e2d6;">
              <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">
                This appointment request was submitted through the Crystal Cabin Detailing website.
                <br>
                Please contact the customer directly to confirm the appointment.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `
NEW APPOINTMENT REQUEST - Crystal Cabin Detailing

CUSTOMER
Name: ${data.customer.fullName}
Email: ${data.customer.email}
Phone: ${data.customer.phone}

VEHICLE
${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}
Type: ${data.vehicle.vehicleType}

APPOINTMENT
Package: ${data.packageName}
Price: $${data.price}
Preferred Date: ${formatDate(data.appointment.preferredDate)}
Preferred Time: ${formatTime(data.appointment.preferredTime)}

SERVICE LOCATION
Address: ${data.serviceLocation.address}
${data.serviceLocation.unit ? `Details: ${data.serviceLocation.unit}\n` : ''}
${data.addOns && data.addOns.length > 0 ? `ADD-ONS
${data.addOns.map((addOn) => `- ${addOn.name} (+$${addOn.price})`).join('\n')}
` : ''}
${data.notes ? `ADDITIONAL NOTES\n${data.notes}\n` : ''}
Submitted: ${formatDate(data.submittedAt)} at ${formatTime(data.submittedAt.split('T')[1] || '')}

Please contact the customer directly to confirm the appointment.
  `;

  await transporter.sendMail({
    from: `"Crystal Cabin Detailing" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Appointment Request — Crystal Cabin Detailing`,
    text: textContent,
    html: htmlContent,
    attachments: logoBase64 ? [{
      filename: 'logo.png',
      content: logoBase64,
      encoding: 'base64',
      cid: 'logo@crystalcabin'
    }] : [],
  });
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email connection verification failed:', error);
    return false;
  }
}
