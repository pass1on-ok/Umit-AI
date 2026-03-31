import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

console.log('Database URL check:', process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const roundsOfHashing = 10;


async function main() {
  const patientSabinEmail = process.env.PATIENT_SABIN_EMAIL || 'sabin@adams.com';
  const patientSabinPass = process.env.PATIENT_SABIN_PASSWORD || 'password-sabin';

  const adminEmail = process.env.ADMIN_EMAIL || 'alex@ruheni.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'password-alex';

  const doctorEmail = process.env.DOCTOR_EMAIL || 'dr.smith@hospital.com';
  const doctorPass = process.env.DOCTOR_PASSWORD || 'password-smith';

  const patientJaneEmail = process.env.PATIENT_JANE_EMAIL || 'jane.doe@example.com';
  const patientJanePass = process.env.PATIENT_JANE_PASSWORD || 'password-jane';

  const passwordSabin = await bcrypt.hash(patientSabinPass, roundsOfHashing);
  const passwordAlex = await bcrypt.hash(adminPass, roundsOfHashing);
  const passwordDrSmith = await bcrypt.hash(doctorPass, roundsOfHashing);
  const passwordJane = await bcrypt.hash(patientJanePass, roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {
      password: passwordSabin, role: 'PATIENT'
    },
    create: {
      email: patientSabinEmail,
      name: 'Sabin Adams',
      password: passwordSabin,
      role: 'PATIENT',
      profile: { create: {} },
      symptoms: {
        create: [
          {
            description: 'Feeling generally uneasy and restless today.',
            values: {
              create: [
                { type: 'Anxiety', severity: 6 },
                { type: 'Insomnia', severity: 4 },
                { type: 'Pain', severity: 2 },
              ],
            },
          },
          {
            description: 'Follow-up log for the evening.',
            values: {
              create: [
                { type: 'Anxiety', severity: 3 },
                { type: 'Fatigue', severity: 8 },
              ],
            },
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordAlex, role: 'ADMIN'
    },
    create: {
      email: 'alex@ruheni.com',
      name: 'Alex Ruheni',
      password: passwordAlex,
      role: 'ADMIN',
      profile: { create: {} },
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: doctorEmail },
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
    where: { email: patientJaneEmail },
    update: { password: passwordJane },
    create: {
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      password: passwordJane,
      role: 'PATIENT',
      profile: { create: {} },
    },
  });



  console.log({ user1, user2, user3, user4 });
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

