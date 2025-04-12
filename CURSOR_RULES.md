# Cursor Rules for Cursos Play and Learn

## Database Operations

### Prisma ORM Usage

1. **Always use Prisma ORM methods** instead of raw SQL queries whenever possible
2. **Select only required fields** when querying data for better performance:
   ```typescript
   // Good
   const users = await db.user.findMany({
     select: {
       id: true,
       name: true,
       email: true,
     },
   });

   // Avoid
   const users = await db.user.findMany();
   ```

3. **Use Prisma's relation queries** instead of performing multiple separate queries:
   ```typescript
   // Good
   const userWithProjects = await db.user.findUnique({
     where: { id },
     include: { projects: true },
   });

   // Avoid
   const user = await db.user.findUnique({ where: { id } });
   const projects = await db.project.findMany({ where: { userId: id } });
   ```

4. **Use transactions** when performing multiple related operations:
   ```typescript
   await prisma.$transaction(async (tx) => {
     // Operations here
   });
   ```

### Seeding

1. **Use `npm run seed`** when you want to seed the database:
   ```bash
   npm run seed
   ```

## API Routes

1. **Validate input data** using Zod or other validation libraries
2. **Return appropriate status codes** with meaningful error messages
3. **Use pagination, filtering, and sorting** for list endpoints
4. **Protect routes** with authentication and authorization checks

## Client-Side

1. **Use React hooks** for state management and side effects
2. **Debounce search inputs** to reduce API calls
3. **Memoize expensive calculations** with useMemo and useCallback
4. **Prefer router.replace over router.push** for URL updates that don't need to add to history

## Component Best Practices

1. **Create reusable components** for common UI patterns
2. **Use TypeScript interfaces** for component props
3. **Follow the single responsibility principle**
4. **Add appropriate loading and error states** 