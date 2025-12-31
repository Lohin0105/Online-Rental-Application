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
      { email: 'rajesh.owner@email.com', name: 'Rajesh Kumar', phone: '9876543210', role: 'owner' },
      { email: 'priya.owner@email.com', name: 'Priya Sharma', phone: '9876543211', role: 'owner' },
      { email: 'amit.owner@email.com', name: 'Amit Patel', phone: '9876543212', role: 'owner' },
      // Tenants
      { email: 'anjali.tenant@email.com', name: 'Anjali Gupta', phone: '9876543213', role: 'tenant' },
      { email: 'rahul.tenant@email.com', name: 'Rahul Singh', phone: '9876543214', role: 'tenant' },
      { email: 'sneha.tenant@email.com', name: 'Sneha Reddy', phone: '9876543215', role: 'tenant' },
      { email: 'vikram.tenant@email.com', name: 'Vikram Malhotra', phone: '9876543216', role: 'tenant' },
      { email: 'pooja.tenant@email.com', name: 'Pooja Verma', phone: '9876543217', role: 'tenant' },
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
      // Rajesh Kumar's properties (owner 1)
      {
        owner_id: owners[0]?.id,
        title: 'Luxury Apartment in Bandra West',
        description: 'Spacious 3BHK apartment in the heart of Bandra. Features sea view balconies, marble flooring, and modular kitchen. Close to Linking Road and Bandstand.',
        rent: 75000.00,
        location: 'Hill Road, Bandra West, Mumbai, Maharashtra 400050',
        amenities: JSON.stringify(['WiFi', 'Gym', 'Parking', 'Security', 'Power Backup', 'Air Conditioning']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']),
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 1800,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[0]?.id,
        title: 'Cozy Studio in Koramangala',
        description: 'Charming studio apartment near startup hub. Perfect for young professionals. Walking distance to 100ft Road restaurants and cafes. Includes high-speed internet.',
        rent: 25000.00,
        location: '4th Block, Koramangala, Bangalore, Karnataka 560034',
        amenities: JSON.stringify(['WiFi', 'Laundry', 'Air Conditioning', 'Geyser']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']),
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 500,
        property_type: 'studio',
        is_available: true
      },
      // Priya Sharma's properties (owner 2)
      {
        owner_id: owners[1]?.id,
        title: 'Spacious Villa in Jubilee Hills',
        description: 'Premium 4-bedroom independent villa with a private garden. Features servant quarters, 2 covered car parks, and terrace garden. Located in a prime residential area.',
        rent: 145000.00,
        location: 'Road No. 45, Jubilee Hills, Hyderabad, Telangana 500033',
        amenities: JSON.stringify(['Garden', 'Garage', 'Servant Quarter', 'Vastu Compliant', 'Central AC', 'Security']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800']),
        bedrooms: 4,
        bathrooms: 4,
        area_sqft: 3500,
        property_type: 'villa',
        is_available: true
      },
      {
        owner_id: owners[1]?.id,
        title: 'Sea Facing Flat in Besant Nagar',
        description: 'Stunning 3BHK flat with direct Elliot\'s Beach view. Airy and well-ventilated. Walking distance to the beach and temples. Quiet neighborhood.',
        rent: 45000.00,
        location: '2nd Avenue, Besant Nagar, Chennai, Tamil Nadu 600090',
        amenities: JSON.stringify(['Sea View', 'Lift', 'Security', 'Balcony', 'Power Backup']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800']),
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 1600,
        property_type: 'apartment',
        is_available: true
      },
      // Amit Patel's properties (owner 3)
      {
        owner_id: owners[2]?.id,
        title: 'Luxury Farmhouse in Chattarpur',
        description: 'Magnificent farmhouse on 1 acre land. Features private swimming pool, landscaped lawns, and party hall. Ideal for luxury living away from city noise.',
        rent: 250000.00,
        location: 'Chattarpur Farms, New Delhi, Delhi 110074',
        amenities: JSON.stringify(['Private Pool', 'Lawn', 'Security', 'Driver Room', 'Modular Kitchen', 'Farm View']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800']),
        bedrooms: 5,
        bathrooms: 5,
        area_sqft: 6000,
        property_type: 'house',
        is_available: true
      },
      {
        owner_id: owners[2]?.id,
        title: 'Modern Loft in Hauz Khas Village',
        description: 'Artist\'s delight! Contemporary loft overlooking the lake and deer park. Surrounded by art galleries, boutiques, and cafes. Unique interior design.',
        rent: 65000.00,
        location: 'Hauz Khas Village, New Delhi, Delhi 110016',
        amenities: JSON.stringify(['Lake View', 'Wooden Flooring', 'Terrace', 'Pet Friendly', 'Fully Furnished']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800']),
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 1200,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[0]?.id,
        title: 'Heritage Home in Fort Kochi',
        description: 'Restored colonial-style house with Portuguese architecture. Features high ceilings, veranda, and courtyard. Located in the heart of historical Fort Kochi.',
        rent: 32000.00,
        location: 'Princess Street, Fort Kochi, Kochi, Kerala 682001',
        amenities: JSON.stringify(['Courtyard', 'Veranda', 'Antique Furniture', 'WiFi', 'Garden']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800']),
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1400,
        property_type: 'house',
        is_available: false
      },
      {
        owner_id: owners[1]?.id,
        title: 'High-Rise Condo in Hi-Tech City',
        description: 'Premium flat in gated community. Club house access with swimming pool, gym, and tennis court. Close to IT parks and international schools.',
        rent: 55000.00,
        location: 'Hitec City, Hyderabad, Telangana 500081',
        amenities: JSON.stringify(['Club House', 'Swimming Pool', 'Gym', 'Tennis Court', 'Children Play Area', '24x7 Security']),
        photos: JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800']),
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 2100,
        property_type: 'apartment',
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
        message: 'Namaste! I am working at BKC and this Bandra flat is perfect for my commute. I have a steady income and can provide bank statements.',
        move_in_date: '2025-02-01',
        duration_months: 12,
        owner_notes: 'Documents verified. Welcome to Mumbai!'
      },
      {
        property_id: propertyList[1]?.id,
        tenant_id: tenants[1]?.id,
        status: 'Pending',
        message: 'Hi, I am a software engineer working in Koramangala. The studio is very close to my office. Looking for a long term stay.',
        move_in_date: '2025-01-15',
        duration_months: 11,
        owner_notes: null
      },
      {
        property_id: propertyList[2]?.id,
        tenant_id: tenants[2]?.id,
        status: 'Pending',
        message: 'We are moving to Hyderabad next month. Your villa in Jubilee Hills looks beautiful.',
        move_in_date: '2025-03-01',
        duration_months: 24,
        owner_notes: null
      },
      {
        property_id: propertyList[3]?.id,
        tenant_id: tenants[3]?.id,
        status: 'Rejected',
        message: 'Interested in the sea view flat for a short duration of 2 months.',
        move_in_date: '2025-01-01',
        duration_months: 2,
        owner_notes: 'Sorry, we only rent for minimum 11 months.'
      },
      {
        property_id: propertyList[4]?.id,
        tenant_id: tenants[4]?.id,
        status: 'Approved',
        message: 'The farmhouse is perfect for our joint family requirements. Ready to pay advance immediately.',
        move_in_date: '2025-01-20',
        duration_months: 12,
        owner_notes: 'Advance received. Agreement preparation in progress.'
      },
      {
        property_id: propertyList[0]?.id,
        tenant_id: tenants[2]?.id,
        status: 'Pending',
        message: 'Is the apartment still available? I am looking for a place near Bandstand.',
        move_in_date: '2025-02-15',
        duration_months: 11,
        owner_notes: null
      },
      {
        property_id: propertyList[5]?.id,
        tenant_id: tenants[0]?.id,
        status: 'Pending',
        message: 'Love the location in Hauz Khas! Is it available for immediate move-in?',
        move_in_date: '2025-02-01',
        duration_months: 11,
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
    console.log('   • rajesh.owner@email.com');
    console.log('   • priya.owner@email.com');
    console.log('   • amit.owner@email.com');
    console.log('   Tenants:');
    console.log('   • anjali.tenant@email.com');
    console.log('   • rahul.tenant@email.com');
    console.log('   • sneha.tenant@email.com');
    console.log('   • vikram.tenant@email.com');
    console.log('   • pooja.tenant@email.com');
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

