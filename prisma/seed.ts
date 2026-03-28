import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';

import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const roundsOfHashing = 10;


async function main() {

  const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
  const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);
  const passwordDrSmith = await bcrypt.hash('password-smith', roundsOfHashing);
  const passwordJane = await bcrypt.hash('password-jane', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {
      password: passwordSabin, role: 'PATIENT' },
    create: {
      email: 'sabin@adams.com',
      name: 'Sabin Adams',
      password: passwordSabin,
      role: 'PATIENT',
      profile: { create: {} },
      symptoms: {
      create: [
        {
          type: 'Anxiety',
          severity: 6,
          description: 'Increased heart rate.',
        },
        {
          type: 'Insomnia',
          severity: 4,
          description: 'Difficulty staying asleep.',
        }
      ],
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alex@ruheni.com' },
    update: {      
      password: passwordAlex, role: 'ADMIN' },
    create: {
      email: 'alex@ruheni.com',
      name: 'Alex Ruheni',
      password: passwordAlex,
      role: 'ADMIN',
      profile: { create: {} },
    },
  });

const user3 = await prisma.user.upsert({
    where: { email: 'dr.smith@hospital.com' },
    update: { password: passwordDrSmith },
    create: {
      email: 'dr.smith@hospital.com',
      name: 'Dr. Smith',
      password: passwordDrSmith,
      role: 'DOCTOR',
      profile: { create: {} },
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'jane.doe@example.com' },
    update: { password: passwordJane },
    create: {
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      password: passwordJane,
      role: 'PATIENT',
      profile: { create: {} },
      symptoms: {
      create: [
        {
          type: 'Anxiety',
          severity: 5,
          description: 'Increased heart rate.',
        },
        {
          type: 'Anxiety',
          severity: 4,
          description: 'Difficulty staying focused.',
        }
      ],
      },
    },
  });

 

    console.log({ user1, user2, user3, user4});
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

