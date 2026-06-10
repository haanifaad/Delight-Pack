import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'user@delightpack.com', role_level: 1, password_hash: passwordHash, profile_data: { name: 'L1 Client' } },
    { email: 'member@delightpack.com', role_level: 2, password_hash: passwordHash, profile_data: { name: 'L2 Sales' } },
    { email: 'staff@delightpack.com', role_level: 3, password_hash: passwordHash, profile_data: { name: 'L3 Staff' } },
    { email: 'admin@delightpack.com', role_level: 4, password_hash: passwordHash, profile_data: { name: 'L4 Admin' } },
    { email: 'dev@delightpack.com', role_level: 5, password_hash: passwordHash, profile_data: { name: 'L5 Developer' } },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Database seeded with test users for DP-Auth levels L1-L5.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
