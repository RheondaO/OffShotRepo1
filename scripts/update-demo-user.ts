import { seedDemoUser } from '../server/seed-demo-user';
import { testDatabaseConnection } from '../server/db';

// Main function to run the seed
async function main() {
  console.log('Starting to update demo user...');
  
  try {
    // Test the database connection first
    await testDatabaseConnection();
    
    // Run the seeding process
    await seedDemoUser();
    
    console.log('Demo user update process completed successfully!');
  } catch (error) {
    console.error('Error during demo user update:', error);
    process.exit(1);
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error in main execution:', error);
    process.exit(1);
  });