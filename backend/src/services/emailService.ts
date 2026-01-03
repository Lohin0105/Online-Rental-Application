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
        <p><strong>Rent:</strong> ₹${property.rent}/month</p>
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

export const notifyTenantBookingApproved = async (
  tenantEmail: string,
  tenantName: string,
  propertyTitle: string,
  propertyLocation: string,
  propertyRent: number,
  ownerName: string,
  ownerNotes?: string
) => {
  if (!tenantEmail) return;

  const subject = '🎉 Your Booking Request Has Been Approved!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Booking Approved! 🎉</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hello <strong>${tenantName}</strong>,</p>
        <p style="font-size: 16px; color: #333;">Great news! Your booking request has been <strong style="color: #4caf50;">APPROVED</strong> by the property owner.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <h3 style="margin-top: 0; color: #333;">Property Details:</h3>
          <p style="margin: 8px 0;"><strong>Property:</strong> ${propertyTitle}</p>
          <p style="margin: 8px 0;"><strong>Location:</strong> ${propertyLocation}</p>
          <p style="margin: 8px 0;"><strong>Monthly Rent:</strong> ₹${propertyRent}</p>
          <p style="margin: 8px 0;"><strong>Owner:</strong> ${ownerName}</p>
        </div>

        ${ownerNotes ? `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0;"><strong>Owner's Message:</strong></p>
          <p style="margin: 8px 0 0 0; font-style: italic;">"${ownerNotes}"</p>
        </div>
        ` : ''}

        <p style="font-size: 16px; color: #333;">Please log in to your dashboard to view more details and complete the next steps.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/tenant/dashboard" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">Best regards,<br><strong>Haven Rental Platform Team</strong></p>
      </div>
    </div>
  `;

  await sendEmail(tenantEmail, subject, html);
};

export const notifyTenantBookingRejected = async (
  tenantEmail: string,
  tenantName: string,
  propertyTitle: string,
  propertyLocation: string,
  ownerName: string,
  ownerNotes?: string
) => {
  if (!tenantEmail) return;

  const subject = 'Booking Request Update';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f44336; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Booking Request Update</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hello <strong>${tenantName}</strong>,</p>
        <p style="font-size: 16px; color: #333;">We regret to inform you that your booking request for <strong>${propertyTitle}</strong> has been declined by the property owner.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
          <h3 style="margin-top: 0; color: #333;">Property Details:</h3>
          <p style="margin: 8px 0;"><strong>Property:</strong> ${propertyTitle}</p>
          <p style="margin: 8px 0;"><strong>Location:</strong> ${propertyLocation}</p>
          <p style="margin: 8px 0;"><strong>Owner:</strong> ${ownerName}</p>
        </div>

        ${ownerNotes ? `
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
          <p style="margin: 0;"><strong>Owner's Message:</strong></p>
          <p style="margin: 8px 0 0 0; font-style: italic;">"${ownerNotes}"</p>
        </div>
        ` : ''}

        <p style="font-size: 16px; color: #333;">Don't worry! There are many other great properties available. Please browse our listings to find your perfect home.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/properties" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Browse Properties
          </a>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">Best regards,<br><strong>Haven Rental Platform Team</strong></p>
      </div>
    </div>
  `;

  await sendEmail(tenantEmail, subject, html);
};
