
import { seedTestUsers } from '../server/seed-test-users';
import { testDatabaseConnection } from '../server/db';

async function main() {
  console.log('Starting to seed test data...');
  
  try {
    await testDatabaseConnection();
    await seedTestUsers();
    console.log('Test data seeding completed successfully!');
  } catch (error) {
    console.error('Error during test data seeding:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error in main execution:', error);
    process.exit(1);
  });
