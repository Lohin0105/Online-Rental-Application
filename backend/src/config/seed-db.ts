import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sreevastha',
    database: process.env.DB_NAME || 'house_rental_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  try {
    console.log('🗑️  Clearing existing data...\n');
    
    // Clear all existing data (in correct order due to foreign keys)
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE bookings');
    await connection.query('TRUNCATE TABLE property_ratings');
    await connection.query('TRUNCATE TABLE user_ratings');
    await connection.query('TRUNCATE TABLE properties');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ All existing data cleared!\n');
    console.log('🌱 Starting fresh database seeding with Indian data...\n');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // ============ SEED USERS ============
    console.log('👥 Creating users...');
    
    // Create admin first
    await connection.query(
      `INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`,
      ['admin@houserental.com', adminPassword, 'System Admin', '+91 98765 43210', 'admin']
    );

    const users = [
      // Owners
      { email: 'srivathsathotamsetty@gmail.com', name: 'Srivathsa Owner', phone: '+91 98111 22333', role: 'owner' },
      { email: 'rajesh.sharma@email.com', name: 'Rajesh Sharma', phone: '+91 98111 22334', role: 'owner' },
      { email: 'priya.patel@email.com', name: 'Priya Patel', phone: '+91 99222 33444', role: 'owner' },
      { email: 'vikram.malhotra@email.com', name: 'Vikram Malhotra', phone: '+91 97333 44555', role: 'owner' },
      { email: 'anita.reddy@email.com', name: 'Anita Reddy', phone: '+91 96444 55666', role: 'owner' },
      // Tenants
      { email: 'sreevastha7@gmail.com', name: 'Sreevastha Tenant', phone: '+91 95555 66776', role: 'tenant' },
      { email: 'amit.kumar@email.com', name: 'Amit Kumar', phone: '+91 95555 66777', role: 'tenant' },
      { email: 'sneha.gupta@email.com', name: 'Sneha Gupta', phone: '+91 94666 77888', role: 'tenant' },
      { email: 'rohit.singh@email.com', name: 'Rohit Singh', phone: '+91 93777 88999', role: 'tenant' },
      { email: 'kavita.nair@email.com', name: 'Kavita Nair', phone: '+91 92888 99000', role: 'tenant' },
      { email: 'arjun.mehta@email.com', name: 'Arjun Mehta', phone: '+91 91999 00111', role: 'tenant' },
      { email: 'deepika.iyer@email.com', name: 'Deepika Iyer', phone: '+91 90000 11222', role: 'tenant' },
    ];

    for (const user of users) {
      await connection.query(
        `INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`,
        [user.email, hashedPassword, user.name, user.phone, user.role]
      );
    }
    console.log(`   ✅ Created ${users.length + 1} users (including admin)`);

    // Get owner IDs for properties
    const [owners]: any = await connection.query(
      `SELECT id, name FROM users WHERE role = 'owner' ORDER BY id`
    );

    // ============ SEED PROPERTIES ============
    console.log('🏠 Creating properties...');

    const properties = [
      // Rajesh Sharma's properties (Mumbai)
      {
        owner_id: owners[0]?.id,
        title: 'Luxury Sea View Apartment in Bandra',
        description: 'Stunning 3BHK apartment with panoramic Arabian Sea views in the heart of Bandra West. Features Italian marble flooring, modular kitchen with chimney, and a large balcony perfect for Mumbai sunsets. Walking distance to Bandstand and linking road shopping.',
        rent: 125000,
        location: 'Bandra West, Mumbai, Maharashtra 400050',
        amenities: JSON.stringify(['WiFi', 'Gym', 'Swimming Pool', 'Power Backup', '24/7 Security', 'Covered Parking', 'Club House']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ]),
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 1800,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[0]?.id,
        title: 'Modern Studio in Powai',
        description: 'Compact and stylish studio apartment near Hiranandani Gardens. Fully furnished with AC, washing machine, and modern kitchenette. Ideal for working professionals. Close to IT parks and excellent restaurants.',
        rent: 32000,
        location: 'Powai, Mumbai, Maharashtra 400076',
        amenities: JSON.stringify(['WiFi', 'AC', 'Furnished', 'Gym', 'Security', 'Parking']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ]),
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 450,
        property_type: 'studio',
        is_available: true
      },
      // Priya Patel's properties (Bangalore)
      {
        owner_id: owners[1]?.id,
        title: 'Spacious Villa in Whitefield',
        description: 'Beautiful 4BHK independent villa with private garden in a gated community. Features wooden flooring, home theater room, modular kitchen with appliances, and servant quarters. Perfect for families looking for space and privacy.',
        rent: 95000,
        location: 'Whitefield, Bangalore, Karnataka 560066',
        amenities: JSON.stringify(['Garden', 'Home Theater', 'Modular Kitchen', 'Servant Room', 'Club House', 'Children Play Area', 'Power Backup']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
        ]),
        bedrooms: 4,
        bathrooms: 4,
        area_sqft: 3200,
        property_type: 'villa',
        is_available: true
      },
      {
        owner_id: owners[1]?.id,
        title: 'Premium 2BHK in Indiranagar',
        description: 'Beautifully designed 2BHK in the vibrant Indiranagar neighborhood. Walking distance to 100 Feet Road with its cafes, pubs, and boutiques. Features contemporary interiors, split ACs in all rooms, and a modern kitchen.',
        rent: 55000,
        location: 'Indiranagar, Bangalore, Karnataka 560038',
        amenities: JSON.stringify(['AC', 'Gym', 'Covered Parking', 'Power Backup', 'Security', 'Lift']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
        ]),
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1200,
        property_type: 'apartment',
        is_available: true
      },
      // Vikram Malhotra's properties (Delhi NCR)
      {
        owner_id: owners[2]?.id,
        title: 'Luxurious Penthouse in Golf Course Road',
        description: 'Ultra-luxury duplex penthouse in Gurgaon\'s most premium locality. Features private terrace with jacuzzi, Italian kitchen, smart home automation, and breathtaking golf course views. Premium finishes throughout with VRV AC system.',
        rent: 250000,
        location: 'Golf Course Road, Gurgaon, Haryana 122002',
        amenities: JSON.stringify(['Terrace', 'Jacuzzi', 'Smart Home', 'VRV AC', 'Private Lift', 'Concierge', 'Valet Parking']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
        ]),
        bedrooms: 4,
        bathrooms: 5,
        area_sqft: 5500,
        property_type: 'condo',
        is_available: true
      },
      {
        owner_id: owners[2]?.id,
        title: 'Modern 3BHK in Noida Sector 150',
        description: 'Brand new 3BHK apartment in a premium high-rise with Yamuna Expressway connectivity. Features floor-to-ceiling windows, modular kitchen, and access to world-class amenities including rooftop infinity pool.',
        rent: 45000,
        location: 'Sector 150, Noida, Uttar Pradesh 201310',
        amenities: JSON.stringify(['Infinity Pool', 'Gym', 'Tennis Court', 'Jogging Track', 'Kids Zone', 'Power Backup', 'EV Charging']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
        ]),
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 1650,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[2]?.id,
        title: 'Cozy 1BHK in Dwarka',
        description: 'Well-maintained 1BHK apartment near Dwarka Sector 21 Metro. Perfect for bachelors or young couples. Includes semi-furnished with wardrobes, geysers, and modular kitchen. Good connectivity to IGI Airport.',
        rent: 18000,
        location: 'Dwarka Sector 21, New Delhi 110077',
        amenities: JSON.stringify(['Metro Nearby', 'Parking', 'Power Backup', 'Security', 'RO Water']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
        ]),
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 650,
        property_type: 'apartment',
        is_available: true
      },
      // Anita Reddy's properties (Hyderabad & Chennai)
      {
        owner_id: owners[3]?.id,
        title: 'Premium Villa in Jubilee Hills',
        description: 'Exclusive 5BHK villa in Hyderabad\'s most prestigious locality. Features Italian marble, home automation, private swimming pool, landscaped garden, and separate servant quarters. Celebrity neighborhood with ultimate privacy.',
        rent: 175000,
        location: 'Jubilee Hills, Hyderabad, Telangana 500033',
        amenities: JSON.stringify(['Private Pool', 'Garden', 'Home Automation', 'Generator', 'CCTV', 'Intercom', 'Party Lawn']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
        ]),
        bedrooms: 5,
        bathrooms: 6,
        area_sqft: 4500,
        property_type: 'villa',
        is_available: true
      },
      {
        owner_id: owners[3]?.id,
        title: 'Sea-Facing Flat in ECR Chennai',
        description: 'Beautiful 2BHK apartment on East Coast Road with stunning Bay of Bengal views. Wake up to the sound of waves! Features open kitchen, large balcony, and access to private beach. Weekend getaway or permanent residence.',
        rent: 42000,
        location: 'ECR, Chennai, Tamil Nadu 600119',
        amenities: JSON.stringify(['Beach Access', 'Sea View', 'Balcony', 'Parking', 'Security', 'Generator']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ]),
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1100,
        property_type: 'apartment',
        is_available: true
      },
      {
        owner_id: owners[3]?.id,
        title: 'IT Hub Apartment in HITEC City',
        description: 'Ideal 2BHK for IT professionals in HITEC City. 5-minute walk to major tech parks including Microsoft and Google offices. Fully furnished with modern amenities. Excellent food court and mall connectivity.',
        rent: 35000,
        location: 'HITEC City, Hyderabad, Telangana 500081',
        amenities: JSON.stringify(['Fully Furnished', 'WiFi', 'Gym', 'Swimming Pool', 'Food Court', 'ATM', 'Pharmacy']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ]),
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1050,
        property_type: 'apartment',
        is_available: true
      },
      // Additional properties for variety
      {
        owner_id: owners[0]?.id,
        title: 'Heritage Bungalow in South Mumbai',
        description: 'Rare heritage property in prestigious Malabar Hill. Colonial-era bungalow with high ceilings, teak wood flooring, and sprawling verandas. Includes a beautiful garden with century-old trees. Perfect for those who appreciate history and elegance.',
        rent: 350000,
        location: 'Malabar Hill, Mumbai, Maharashtra 400006',
        amenities: JSON.stringify(['Garden', 'Heritage Property', 'Sea View', 'Parking', 'Staff Quarters', 'Study Room']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
        ]),
        bedrooms: 5,
        bathrooms: 4,
        area_sqft: 6000,
        property_type: 'house',
        is_available: false
      },
      {
        owner_id: owners[1]?.id,
        title: 'Trendy Loft in Koramangala',
        description: 'Unique duplex loft apartment in Bangalore\'s startup hub. Industrial-chic design with exposed brick, high ceilings, and mezzanine bedroom. Perfect for creative professionals. Walking distance to cafes, pubs, and co-working spaces.',
        rent: 48000,
        location: 'Koramangala 5th Block, Bangalore, Karnataka 560095',
        amenities: JSON.stringify(['Duplex', 'High Ceiling', 'Rooftop Access', 'Pet Friendly', 'Bike Parking', 'Cafe Nearby']),
        photos: JSON.stringify([
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
        ]),
        bedrooms: 1,
        bathrooms: 2,
        area_sqft: 900,
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
      `SELECT id, name FROM users WHERE role = 'tenant' ORDER BY id`
    );
    const [propertyList]: any = await connection.query(
      `SELECT id, title FROM properties ORDER BY id`
    );

    // ============ SEED BOOKINGS ============
    console.log('📋 Creating booking requests...');

    const bookings = [
      {
        property_id: propertyList[0]?.id,
        tenant_id: tenants[0]?.id,
        status: 'Approved',
        message: 'I am relocating to Mumbai for work at a multinational company. This Bandra apartment looks perfect for my family. We have excellent rental history.',
        move_in_date: '2025-02-01',
        duration_months: 12,
        owner_notes: 'Verified employment. Welcome to the building!'
      },
      {
        property_id: propertyList[1]?.id,
        tenant_id: tenants[1]?.id,
        status: 'Pending',
        message: 'I am an IT professional working in Powai. This studio is ideal for my needs. Can we schedule a visit this weekend?',
        move_in_date: '2025-01-20',
        duration_months: 11,
        owner_notes: null
      },
      {
        property_id: propertyList[2]?.id,
        tenant_id: tenants[2]?.id,
        status: 'Pending',
        message: 'We are a family of 5 looking for a spacious villa in Whitefield. My company is based nearby. This property looks perfect!',
        move_in_date: '2025-03-01',
        duration_months: 24,
        owner_notes: null
      },
      {
        property_id: propertyList[3]?.id,
        tenant_id: tenants[3]?.id,
        status: 'Approved',
        message: 'Love Indiranagar! I work at a startup on 100 Feet Road. This 2BHK is exactly what I have been searching for.',
        move_in_date: '2025-01-15',
        duration_months: 12,
        owner_notes: 'Great tenant, startup founder. Deposit received.'
      },
      {
        property_id: propertyList[4]?.id,
        tenant_id: tenants[4]?.id,
        status: 'Rejected',
        message: 'Interested in the Golf Course Road penthouse for 6 months.',
        move_in_date: '2025-02-01',
        duration_months: 6,
        owner_notes: 'Sorry, minimum lease period is 12 months for this premium property.'
      },
      {
        property_id: propertyList[5]?.id,
        tenant_id: tenants[5]?.id,
        status: 'Pending',
        message: 'I am moving to Noida for my new job at an IT company. This apartment has all the amenities I need. Please consider my application.',
        move_in_date: '2025-02-15',
        duration_months: 12,
        owner_notes: null
      },
      {
        property_id: propertyList[7]?.id,
        tenant_id: tenants[0]?.id,
        status: 'Pending',
        message: 'The Jubilee Hills villa is stunning! We are looking for a premium property for our family. Ready to pay 3 months advance.',
        move_in_date: '2025-03-01',
        duration_months: 24,
        owner_notes: null
      },
      {
        property_id: propertyList[9]?.id,
        tenant_id: tenants[1]?.id,
        status: 'Approved',
        message: 'I work at Microsoft in HITEC City. This apartment is perfect - just 5 minutes from my office!',
        move_in_date: '2025-01-10',
        duration_months: 12,
        owner_notes: 'Microsoft employee verified. Keys handed over.'
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
    console.log('   • 1 Admin');
    console.log('   • 5 Property Owners (including srivathsathotamsetty@gmail.com)');
    console.log('   • 7 Tenants (including sreevastha7@gmail.com)');
    console.log('   • 12 Properties across Mumbai, Bangalore, Delhi NCR, Hyderabad & Chennai');
    console.log('   • 8 Booking Requests\n');
    
    console.log('💰 Rent Range: ₹18,000 - ₹3,50,000 per month\n');
    
    console.log('🔐 Login Credentials:');
    console.log('   ┌─────────────────────────────────────────────────────┐');
    console.log('   │ ADMIN                                               │');
    console.log('   │   admin@houserental.com         (password: admin123)│');
    console.log('   ├─────────────────────────────────────────────────────┤');
    console.log('   │ OWNERS (password: password123)                      │');
    console.log('   │   srivathsathotamsetty@gmail.com (Primary Owner)    │');
    console.log('   │   rajesh.sharma@email.com       (Mumbai)            │');
    console.log('   │   priya.patel@email.com         (Bangalore)         │');
    console.log('   │   vikram.malhotra@email.com     (Delhi NCR)         │');
    console.log('   │   anita.reddy@email.com         (Hyderabad/Chennai) │');
    console.log('   ├─────────────────────────────────────────────────────┤');
    console.log('   │ TENANTS (password: password123)                     │');
    console.log('   │   sreevastha7@gmail.com         (Primary Tenant)    │');
    console.log('   │   amit.kumar@email.com                              │');
    console.log('   │   sneha.gupta@email.com                             │');
    console.log('   │   rohit.singh@email.com                             │');
    console.log('   │   kavita.nair@email.com                             │');
    console.log('   │   arjun.mehta@email.com                             │');
    console.log('   │   deepika.iyer@email.com                            │');
    console.log('   └─────────────────────────────────────────────────────┘\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase();
