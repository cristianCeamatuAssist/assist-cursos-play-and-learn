import { hash } from 'bcrypt';
import { db } from '../src/lib/db';

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('Admin123!', 10);
    
    const admin = await db.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('Seeded admin user:', admin.email);

    // Add more seed data here as needed
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  }); 