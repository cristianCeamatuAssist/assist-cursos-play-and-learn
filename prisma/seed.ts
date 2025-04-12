import { hash } from 'bcrypt';
import { Priority, Role, Status } from '../src/generated/prisma';
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
        role: Role.ADMIN,
      },
    });

    console.log('Seeded admin user:', admin.email);

    // Create regular users with projects
    const usersData = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await hash('Password123!', 10),
        role: Role.USER,
        projectsCount: 5,
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: await hash('Password123!', 10),
        role: Role.USER,
        projectsCount: 3,
      },
      {
        email: 'robert.johnson@example.com',
        name: 'Robert Johnson',
        password: await hash('Password123!', 10),
        role: Role.USER,
        projectsCount: 6,
      },
      {
        email: 'sarah.williams@example.com',
        name: 'Sarah Williams',
        password: await hash('Password123!', 10),
        role: Role.USER,
        projectsCount: 4,
      },
      {
        email: 'michael.brown@example.com',
        name: 'Michael Brown',
        password: await hash('Password123!', 10),
        role: Role.USER,
        projectsCount: 3,
      },
    ];

    // Delete existing users (except admin) and their projects
    await db.userProject.deleteMany({
      where: {
        user: {
          email: {
            not: 'admin@example.com',
          },
        },
      },
    });

    await db.user.deleteMany({
      where: {
        email: {
          not: 'admin@example.com',
        },
      },
    });

    // Project titles and descriptions for seeding
    const projectTemplates = [
      {
        title: 'Website Redesign',
        description: 'Complete overhaul of company website with modern UI/UX',
      },
      {
        title: 'Mobile App Development',
        description: 'Create a cross-platform mobile app for our services',
      },
      {
        title: 'Content Marketing Strategy',
        description: 'Develop a comprehensive content strategy for Q3 and Q4',
      },
      {
        title: 'Customer Feedback System',
        description: 'Implement an automated customer feedback collection and analysis system',
      },
      {
        title: 'Staff Training Program',
        description: 'Develop and execute a training program for new team members',
      },
      {
        title: 'Product Launch Campaign',
        description: 'Plan and execute marketing campaign for new product launch',
      },
      {
        title: 'Social Media Revamp',
        description: 'Update and optimize all social media channels',
      },
      {
        title: 'Email Marketing Automation',
        description: 'Set up automated email sequences for lead nurturing',
      },
      {
        title: 'Data Analytics Implementation',
        description: 'Implement comprehensive data tracking and analytics',
      },
      {
        title: 'Customer Loyalty Program',
        description: 'Design and launch a program to increase customer retention',
      },
      {
        title: 'Security Audit',
        description: 'Conduct thorough security assessment of all systems',
      },
      {
        title: 'Process Optimization',
        description: 'Analyze and improve internal workflows for efficiency',
      },
    ];

    // Statuses and priorities for random assignment
    const statuses = [Status.ACTIVE, Status.COMPLETED, Status.ON_HOLD, Status.CANCELLED];
    const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];

    // Create users and their projects
    for (const userData of usersData) {
      // Create the user
      const user = await db.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: userData.password,
          role: userData.role,
        },
      });

      console.log(`Created user: ${user.email}`);

      // Create projects for the user
      const projectCount = userData.projectsCount;
      
      for (let i = 0; i < projectCount; i++) {
        // Select a random project template, status, and priority
        const templateIndex = Math.floor(Math.random() * projectTemplates.length);
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const priorityIndex = Math.floor(Math.random() * priorities.length);
        
        // Generate random dates
        const now = new Date();
        const randomStartOffset = Math.floor(Math.random() * 90) - 45; // -45 to +45 days
        const startDate = new Date(now.getTime() + randomStartOffset * 24 * 60 * 60 * 1000);
        
        // Only set an end date sometimes
        const hasEndDate = Math.random() > 0.3; // 70% chance of having an end date
        let endDate = null;
        
        if (hasEndDate) {
          const randomDuration = Math.floor(Math.random() * 60) + 15; // 15 to 75 days
          endDate = new Date(startDate.getTime() + randomDuration * 24 * 60 * 60 * 1000);
        }
        
        // Create the project
        const project = await db.userProject.create({
          data: {
            title: `${projectTemplates[templateIndex].title} ${i + 1}`,
            description: projectTemplates[templateIndex].description,
            status: statuses[statusIndex],
            priority: priorities[priorityIndex],
            startDate,
            endDate,
            userId: user.id,
          },
        });
        
        console.log(`Created project: ${project.title} for user: ${user.email}`);
      }
    }

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

    // Delete existing projects for admin user
    await db.userProject.deleteMany({
      where: {
        userId: admin.id,
      },
    });

    // Create new projects for admin
    for (const project of projectsData) {
      await db.userProject.create({
        data: {
          ...project,
          userId: admin.id,
        },
      });
    }

    console.log(`Created ${projectsData.length} projects for admin user`);
    console.log('Seed completed successfully');
    
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