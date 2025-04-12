import { hash } from 'bcrypt';
import { Priority, Status } from '../src/generated/prisma';
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

    // Create 5 projects for admin user
    const projectsData = [
      {
        title: 'Website Redesign',
        description: 'Complete overhaul of company website with modern UI/UX',
        status: Status.ACTIVE,
        priority: Priority.HIGH,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        title: 'Mobile App Development',
        description: 'Create a cross-platform mobile app for our services',
        status: Status.ACTIVE,
        priority: Priority.MEDIUM,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      },
      {
        title: 'Content Marketing Strategy',
        description: 'Develop a comprehensive content strategy for Q3 and Q4',
        status: Status.ON_HOLD,
        priority: Priority.MEDIUM,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
      {
        title: 'Customer Feedback System',
        description: 'Implement an automated customer feedback collection and analysis system',
        status: Status.ACTIVE,
        priority: Priority.LOW,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      {
        title: 'Staff Training Program',
        description: 'Develop and execute a training program for new team members',
        status: Status.COMPLETED,
        priority: Priority.HIGH,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    ];

    // Delete existing projects first to avoid duplicates during development
    await db.userProject.deleteMany({
      where: {
        userId: admin.id,
      },
    });

    // Create new projects
    for (const project of projectsData) {
      await db.userProject.create({
        data: {
          ...project,
          userId: admin.id,
        },
      });
    }

    console.log(`Created ${projectsData.length} projects for admin user`);
    
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