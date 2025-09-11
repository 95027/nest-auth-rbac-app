import { AppDataSource } from 'src/data-source';
import { seedRoles } from './role.seeder';

async function main() {
  await AppDataSource.initialize();
  console.log('Database connected');

  await seedRoles();

  await AppDataSource.destroy();
  console.log('Seeder finished and DB connection closed');
}

main().catch((err) => {
  console.error('seeder error', err);
  process.exit(1);
});
