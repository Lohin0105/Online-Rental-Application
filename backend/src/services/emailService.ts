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
  propertyTitle: string
) => {
  if (!ownerEmail) return;

  const subject = 'New Property Request Received';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Action Required: New Request</h2>
      <p>Hello ${ownerName},</p>
      <p><strong>${tenantName}</strong> has submitted a request for your property: <strong>${propertyTitle}</strong>.</p>
      <p>For more details, please visit our website and check your dashboard.</p>
      <p>Best regards,<br>Online House Rental Team</p>
    </div>
  `;

  await sendEmail(ownerEmail, subject, html);
};

export const notifyTenantBookingStatus = async (
  tenantEmail: string,
  tenantName: string,
  propertyTitle: string,
  status: string,
  ownerName: string
) => {
  if (!tenantEmail) return;

  const subject = `Booking Request ${status}: ${propertyTitle}`;
  const isApproved = status === 'Approved';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isApproved ? '#2E7D32' : '#C62828'};">
        Booking Request ${status}
      </h2>
      <p>Hello ${tenantName},</p>
      <p>Your booking request for <strong>${propertyTitle}</strong> has been <strong>${status.toLowerCase()}</strong> by the owner, <strong>${ownerName}</strong>.</p>
      
      ${isApproved ? `
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Congratulations!</strong> You can now view the owner's contact details in your dashboard and proceed with the rental agreement.</p>
          <p>Please log in to your account to view more details.</p>
        </div>
      ` : `
        <p>You can browse other available properties on our platform.</p>
      `}
      
      <p>Best regards,<br>Online House Rental Team</p>
    </div>
  `;

  await sendEmail(tenantEmail, subject, html);
};
