import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash('Check123!@#', 10);

  await prisma.users.createMany({
    data: [
      {
        name: 'joe SUPERADMIN',
        email: 'aruljoe37@gmail.com',
        hashedPassWord: pw,
        role: 'SUPERADMIN',
      },
      {
        name: 'joe ADMIN',
        email: 'aruljoe38@gmail.com',
        hashedPassWord: pw,
        role: 'ADMIN',
      },
      {
        name: 'joe USER',
        email: 'aruljoe39@gmail.com',
        hashedPassWord: pw,
        role: 'USER',
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        owner: 'joe ADMIN',
        description: 'Added from seed script',
        name: 'Seed Proj',
      },
    ],
  });
}

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
