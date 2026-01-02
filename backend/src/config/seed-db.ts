import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Modanker_04',
    database: process.env.DB_NAME || 'house_rental_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    console.log('🌱 Starting database seeding...\n');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ============ SEED USERS ============
    console.log('👥 Creating users...');
    
    const users = [
      // Owners
      { email: 'john.owner@email.com', name: 'John Smith', phone: '555-0101', role: 'owner' },
      { email: 'sarah.owner@email.com', name: 'Sarah Johnson', phone: '555-0102', role: 'owner' },
      { email: 'mike.owner@email.com', name: 'Mike Williams', phone: '555-0103', role: 'owner' },
      // Tenants
      { email: 'alice.tenant@email.com', name: 'Alice Brown', phone: '555-0201', role: 'tenant' },
      { email: 'bob.tenant@email.com', name: 'Bob Davis', phone: '555-0202', role: 'tenant' },
      { email: 'carol.tenant@email.com', name: 'Carol Wilson', phone: '555-0203', role: 'tenant' },
      { email: 'david.tenant@email.com', name: 'David Miller', phone: '555-0204', role: 'tenant' },
      { email: 'emma.tenant@email.com', name: 'Emma Taylor', phone: '555-0205', role: 'tenant' },
    ];

    for (const user of users) {
      await connection.query(
        `INSERT IGNORE INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`,
        [user.email, hashedPassword, user.name, user.phone, user.role]
      );
    }
    console.log(`   ✅ Created ${users.length} users`);

    // Get owner IDs for properties
    const [owners]: any = await connection.query(
      `SELECT id, name FROM users WHERE role = 'owner'`
    );

    // ============ SEED PROPERTIES ============
    console.log('🏠 Creating properties...');

    const properties = [
      // John Smith's properties (owner 1)
      {
        owner_id: owners[0]?.id,
        title: 'Modern Downtown Apartment',
        description: 'Beautiful modern apartment in the heart of downtown. Features floor-to-ceiling windows with stunning city views, hardwood floors, and a gourmet kitchen with stainless steel appliances. Walking distance to restaurants, shops, and public transit.',
        rent: 2500.00,
        location: '123 Main Street, Downtown, New York, NY 10001',
        amenities: JSON.stringify(['WiFi', 'Gym', 'Parking', 'Doorman', 'Laundry', 'Air Conditioning']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']),
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1200,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[0]?.id,
        title: 'Cozy Studio Near Central Park',
        description: 'Charming studio apartment just steps away from Central Park. Perfect for young professionals. Features updated kitchen, large windows, and built-in storage. Laundry in building.',
        rent: 1800.00,
        location: '456 Park Avenue, Upper East Side, New York, NY 10022',
        amenities: JSON.stringify(['WiFi', 'Laundry', 'Air Conditioning', 'Heating']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']),
        bedrooms: 0,
        bathrooms: 1,
        area_sqft: 500,
        property_type: 'studio',
        is_available: true
      },
      // Sarah Johnson's properties (owner 2)
      {
        owner_id: owners[1]?.id,
        title: 'Spacious Family House with Garden',
        description: 'Beautiful 4-bedroom family home with a large backyard garden. Features updated kitchen, finished basement, attached 2-car garage, and excellent school district. Perfect for families!',
        rent: 3500.00,
        location: '789 Oak Lane, Brooklyn, NY 11201',
        amenities: JSON.stringify(['Garden', 'Garage', 'Basement', 'Fireplace', 'Central Heating', 'Dishwasher']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800']),
        bedrooms: 4,
        bathrooms: 3,
        area_sqft: 2800,
        property_type: 'house',
        is_available: true
      },
      {
        owner_id: owners[1]?.id,
        title: 'Luxury Condo with Ocean View',
        description: 'Stunning luxury condo with panoramic ocean views. Features high-end finishes, chef\'s kitchen, spa-like bathrooms, and private balcony. Building amenities include pool, gym, and concierge.',
        rent: 4500.00,
        location: '321 Beach Boulevard, Miami Beach, FL 33139',
        amenities: JSON.stringify(['Pool', 'Gym', 'Concierge', 'Balcony', 'Ocean View', 'Valet Parking']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800']),
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 1800,
        property_type: 'condo',
        is_available: true
      },
      // Mike Williams' properties (owner 3)
      {
        owner_id: owners[2]?.id,
        title: 'Elegant Villa with Pool',
        description: 'Magnificent Mediterranean-style villa featuring a private pool, outdoor kitchen, and lush landscaping. Interior includes marble floors, vaulted ceilings, and a home theater. Gated community with 24/7 security.',
        rent: 8000.00,
        location: '555 Palm Drive, Beverly Hills, CA 90210',
        amenities: JSON.stringify(['Private Pool', 'Home Theater', 'Security', 'Wine Cellar', 'Smart Home', 'Tennis Court']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800']),
        bedrooms: 5,
        bathrooms: 4,
        area_sqft: 5000,
        property_type: 'villa',
        is_available: true
      },
      {
        owner_id: owners[2]?.id,
        title: 'Trendy Loft in Arts District',
        description: 'Industrial-chic loft in the heart of the Arts District. Features exposed brick, soaring ceilings, original hardwood floors, and oversized windows. Open floor plan perfect for entertaining.',
        rent: 2800.00,
        location: '888 Artist Way, Los Angeles, CA 90013',
        amenities: JSON.stringify(['High Ceilings', 'Exposed Brick', 'Rooftop Access', 'Pet Friendly', 'Bike Storage']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800']),
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 1100,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[0]?.id,
        title: 'Charming Brownstone Apartment',
        description: 'Classic brownstone charm with modern updates. Features original moldings, decorative fireplace, updated kitchen and bath. Tree-lined street in historic neighborhood.',
        rent: 2200.00,
        location: '42 Maple Street, Boston, MA 02116',
        amenities: JSON.stringify(['Fireplace', 'Garden Access', 'Laundry', 'Storage', 'Pet Friendly']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800']),
        bedrooms: 2,
        bathrooms: 1,
        area_sqft: 950,
        property_type: 'apartment',
        is_available: false
      },
      {
        owner_id: owners[1]?.id,
        title: 'Modern Suburban Home',
        description: 'Contemporary home in quiet suburban neighborhood. Open concept living, gourmet kitchen, master suite with walk-in closet. Large backyard with patio. Excellent schools nearby.',
        rent: 2900.00,
        location: '156 Willow Creek Dr, Austin, TX 78701',
        amenities: JSON.stringify(['Garage', 'Backyard', 'Central AC', 'Dishwasher', 'Washer/Dryer']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800']),
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 2000,
        property_type: 'house',
        is_available: true
      },
    ];

    for (const property of properties) {
      if (property.owner_id) {
        await connection.query(
          `INSERT INTO properties (owner_id, title, description, rent, location, amenities, photos, bedrooms, bathrooms, area_sqft, property_type, is_available) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [property.owner_id, property.title, property.description, property.rent, property.location, 
           property.amenities, property.photos, property.bedrooms, property.bathrooms, 
           property.area_sqft, property.property_type, property.is_available]
        );
      }
    }
    console.log(`   ✅ Created ${properties.length} properties`);

    // Get tenant and property IDs for bookings
    const [tenants]: any = await connection.query(
      `SELECT id, name FROM users WHERE role = 'tenant'`
    );
    const [propertyList]: any = await connection.query(
      `SELECT id, title FROM properties`
    );

    // ============ SEED BOOKINGS ============
    console.log('📋 Creating booking requests...');

    const bookings = [
      {
        property_id: propertyList[0]?.id,
        tenant_id: tenants[0]?.id,
        status: 'Approved',
        message: 'I am very interested in this apartment. I work nearby and have excellent references from my previous landlord.',
        move_in_date: '2025-02-01',
        duration_months: 12,
        owner_notes: 'Great tenant, references checked out. Welcome aboard!'
      },
      {
        property_id: propertyList[1]?.id,
        tenant_id: tenants[1]?.id,
        status: 'Pending',
        message: 'This studio looks perfect for my needs. I am a quiet professional looking for a long-term rental.',
        move_in_date: '2025-01-15',
        duration_months: 6,
        owner_notes: null
      },
      {
        property_id: propertyList[2]?.id,
        tenant_id: tenants[2]?.id,
        status: 'Pending',
        message: 'We are a family of 4 looking for a nice home in a good school district. This property seems ideal!',
        move_in_date: '2025-03-01',
        duration_months: 24,
        owner_notes: null
      },
      {
        property_id: propertyList[3]?.id,
        tenant_id: tenants[3]?.id,
        status: 'Rejected',
        message: 'Interested in the ocean view condo for a 6-month lease.',
        move_in_date: '2025-01-01',
        duration_months: 6,
        owner_notes: 'Sorry, we require a minimum 12-month lease.'
      },
      {
        property_id: propertyList[4]?.id,
        tenant_id: tenants[4]?.id,
        status: 'Approved',
        message: 'This villa is exactly what we have been looking for. Ready to move in immediately with first and last month deposit.',
        move_in_date: '2025-01-20',
        duration_months: 12,
        owner_notes: 'Deposit received. Keys will be ready on move-in date.'
      },
      {
        property_id: propertyList[0]?.id,
        tenant_id: tenants[2]?.id,
        status: 'Pending',
        message: 'I am relocating for work and this location is perfect. Can we schedule a viewing?',
        move_in_date: '2025-02-15',
        duration_months: 12,
        owner_notes: null
      },
      {
        property_id: propertyList[5]?.id,
        tenant_id: tenants[0]?.id,
        status: 'Pending',
        message: 'Love the industrial style! Is the loft pet-friendly? I have a small dog.',
        move_in_date: '2025-02-01',
        duration_months: 12,
        owner_notes: null
      },
    ];

    for (const booking of bookings) {
      if (booking.property_id && booking.tenant_id) {
        await connection.query(
          `INSERT INTO bookings (property_id, tenant_id, status, message, move_in_date, duration_months, owner_notes, response_time) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [booking.property_id, booking.tenant_id, booking.status, booking.message, 
           booking.move_in_date, booking.duration_months, booking.owner_notes,
           booking.status !== 'Pending' ? new Date() : null]
        );
      }
    }
    console.log(`   ✅ Created ${bookings.length} bookings`);

    // ============ SUMMARY ============
    console.log('\n========================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('========================================\n');
    
    console.log('📊 Data Summary:');
    console.log('   • 3 Property Owners');
    console.log('   • 5 Tenants');
    console.log('   • 8 Properties');
    console.log('   • 7 Booking Requests\n');
    
    console.log('🔐 Login Credentials (password: password123):');
    console.log('   Owners:');
    console.log('   • john.owner@email.com');
    console.log('   • sarah.owner@email.com');
    console.log('   • mike.owner@email.com');
    console.log('   Tenants:');
    console.log('   • alice.tenant@email.com');
    console.log('   • bob.tenant@email.com');
    console.log('   • carol.tenant@email.com');
    console.log('   • david.tenant@email.com');
    console.log('   • emma.tenant@email.com');
    console.log('   Admin:');
    console.log('   • admin@houserental.com (password: admin123)\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase();

