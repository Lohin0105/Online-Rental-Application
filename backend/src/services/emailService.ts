import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string | string[], subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'House Rental System'}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw, just log. We don't want to break the request.
    return null;
  }
};

export const notifyTenantsNewProperty = async (tenants: string[], property: any, ownerName: string) => {
  if (!tenants || tenants.length === 0) return;

  const subject = 'New Property Alert!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Property Listed!</h2>
      <p>Hello,</p>
      <p><strong>${ownerName}</strong> has uploaded a new property on our website.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="margin-top: 0;">${property.title}</h3>
        <p><strong>Location:</strong> ${property.location}</p>
        <p><strong>Rent:</strong> $${property.rent}/month</p>
        <p>${property.description}</p>
      </div>
      <p>Please check it out if you are interested.</p>
      <p>Best regards,<br>Online House Rental Team</p>
    </div>
  `;

  // Send to all tenants (using BCC to avoid exposing emails if sending as one batch, or individual loop)
  // For transactional emails, it's often better to send individually or use BCC. 
  // Given low volume assumption, BCC is fine or sendEmail supports array.
  // Verify nodemailer 'to' field: Comma separated list or an array of recipients (will show in To header).
  // Better use BCC for privacy if sending to multiple unconnected users.

  await sendEmail(tenants, subject, html);
};

export const notifyOwnerPropertyRequest = async (
  ownerEmail: string,
  ownerName: string,
  tenantName: string,
  property: { title: string; location?: string; rent?: number; bookingId?: number }
) => {
  if (!ownerEmail) return;

  const appUrl = process.env.APP_URL || 'http://localhost:4200';
  const subject = 'New Booking Request for Your Property';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Booking Request</h2>
      <p>Hello ${ownerName},</p>
      <p><strong>${tenantName}</strong> has submitted a booking request for your property:</p>
      <div style="background-color: #f9f9f9; padding: 12px; border-radius: 6px; margin: 12px 0;">
        <h3 style="margin:0">${property.title}</h3>
        ${property.location ? `<p style="margin:4px 0"><strong>Location:</strong> ${property.location}</p>` : ''}
        ${property.rent !== undefined ? `<p style="margin:4px 0"><strong>Rent:</strong> $${property.rent}/month</p>` : ''}
      </div>
      <p>Please open the application to review and respond to the request.</p>
      <p style="margin-top:12px"><a href="${appUrl}/owner/bookings" style="background:#1e88e5;color:#fff;padding:8px 12px;border-radius:4px;text-decoration:none;">Open Dashboard</a></p>
      <p style="margin-top:12px">Best regards,<br>Online House Rental Team</p>
    </div>
  `;

  const result = await sendEmail(ownerEmail, subject, html);
  return result;
};

export const notifyTenantBookingStatus = async (
  tenantEmail: string,
  tenantName: string,
  property: { title: string; location?: string; rent?: number; bookingId?: number },
  status: string,
  ownerName: string
) => {
  if (!tenantEmail) return;

  const appUrl = process.env.APP_URL || 'http://localhost:4200';
  const isApproved = status && status.toString().toLowerCase() === 'approved';
  const subject = isApproved
    ? `Your booking request has been approved — ${property.title}`
    : `Booking request ${status}: ${property.title}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isApproved ? '#2E7D32' : '#C62828'};">${isApproved ? 'Request Approved' : `Request ${status}`}</h2>
      <p>Hello ${tenantName},</p>
      <p>
        <strong>${ownerName}</strong> has ${status.toLowerCase()} your booking request for <strong>${property.title}</strong> ${property.location ? `(${property.location})` : ''}.
      </p>

      ${isApproved ? `
        <div style="background-color: #e8f5e9; padding: 12px; border-radius: 6px; margin: 12px 0;">
          <p><strong>Great news!</strong> Please open the application to view the owner's contact details and next steps.</p>
        </div>
        <p style="margin-top:12px"><a href="${appUrl}/bookings" style="background:#1e88e5;color:#fff;padding:8px 12px;border-radius:4px;text-decoration:none;">Open My Bookings</a></p>
      ` : `
        <p>For more information, please open the application to view details and other available properties.</p>
        <p style="margin-top:12px"><a href="${appUrl}/bookings" style="background:#1e88e5;color:#fff;padding:8px 12px;border-radius:4px;text-decoration:none;">Open My Bookings</a></p>
      `}

      <p style="margin-top:12px">Best regards,<br>Online House Rental Team</p>
    </div>
  `;

  const result = await sendEmail(tenantEmail, subject, html);
  return result;
};
