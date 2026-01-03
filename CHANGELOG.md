# Changelog

All notable changes to the Haven Rental Platform will be documented in this file.

## [2.1.0] - January 2026

### Added
- **Rating System**
  - 5-star rating component with smooth animations
  - Property rating functionality for tenants
  - Owner/user rating functionality
  - Average ratings displayed on property cards
  - Rating count badges
  - Half-star support
  - Rating section in tenant dashboard for approved bookings

- **Email Notification System**
  - Booking approval email notifications to tenants
  - Booking rejection email notifications to tenants
  - Beautiful HTML email templates with gradients
  - Email service integration with Brevo (SMTP)
  - Owner notes included in approval/rejection emails
  - Action links in emails (dashboard, browse properties)

- **Admin Dashboard Enhancements**
  - Modern dark theme with gradient backgrounds
  - Glassmorphism effects on cards
  - Animated stat cards with hover effects
  - Real-time data polling (30-second intervals)
  - Enhanced booking requests grid view
  - Improved tab navigation with Material Design
  - Better visual hierarchy and spacing

- **Currency Localization**
  - All prices converted from USD ($) to INR (₹)
  - Indian number formatting (Intl.NumberFormat)
  - Consistent currency display across all components
  - Updated financial overview component
  - Updated admin dashboard currency displays

- **Database Updates**
  - Added primary owner account: `srivathsathotamsetty@gmail.com`
  - Added primary tenant account: `sreevastha7@gmail.com`
  - Updated default password to `password123` for seeded users
  - Updated database initialization scripts

### Changed
- **Removed Demo Accounts**
  - Removed all demo account bypasses from controllers
  - Removed `authController.demo.ts`
  - Removed `adminController.demo.ts`
  - All operations now use real database
  - Updated booking controller to remove demo data
  - Updated property controller to remove demo properties
  - Updated analytics controller to use real database queries

- **Backend Improvements**
  - Enhanced `bookingController.ts` to send emails on status changes
  - Added `owner_id` to booking queries for rating functionality
  - Updated `emailService.ts` with new notification functions
  - Improved error handling in email service
  - Updated database queries to include owner information

- **Frontend Improvements**
  - Updated `Booking` interface to include `owner_id`
  - Enhanced tenant dashboard with rating section
  - Improved star rating component animations
  - Added rating service integration
  - Updated admin dashboard UI/UX
  - Fixed TypeScript compilation errors

### Fixed
- TypeScript compilation error: `booking.owner_id` optional handling
- Missing email notifications on booking approval/rejection
- Currency display inconsistencies
- Admin dashboard UI/UX issues
- Database connection password fallback

### Documentation
- Added `EMAIL_NOTIFICATIONS.md` with complete email system documentation
- Updated `README.md` with new features and login credentials
- Added changelog file
- Updated API endpoints documentation

## [2.0.0] - January 2026

### Initial Release
- Property listing and management
- Booking system
- User authentication and authorization
- Role-based dashboards
- AI-powered features (chatbot, price calculator)
- Advanced search and filtering

---

## Version History

- **v2.1.0** - Rating system, email notifications, admin dashboard redesign
- **v2.0.0** - Initial stable release

