
import { db } from './db';
import { users, xpActivities, userActivities } from '@shared/schema';
import { eq } from 'drizzle-orm';

const TEST_USERS = [
  {
    username: "test_beginner",
    name: "Test Beginner",
    email: "beginner@test.com",
    password: "test123", // In production, this would be hashed
    xp: 50,
    level: 1,
    bio: "Just starting out!",
    interests: ["community", "learning"]
  },
  {
    username: "test_intermediate",
    name: "Test Intermediate",
    email: "intermediate@test.com", 
    password: "test123",
    xp: 500,
    level: 5,
    bio: "Making progress!",
    interests: ["coding", "teaching"]
  },
  {
    username: "test_advanced",
    name: "Test Advanced",
    email: "advanced@test.com",
    password: "test123",
    xp: 2500,
    level: 15,
    bio: "Experienced contributor",
    interests: ["mentoring", "problem-solving"]
  },
  {
    username: "test_expert",
    name: "Test Expert",
    email: "expert@test.com",
    password: "test123",
    xp: 7500,
    level: 25,
    bio: "Community expert",
    interests: ["leadership", "innovation"]
  },
  {
    username: "test_master",
    name: "Test Master",
    email: "master@test.com",
    password: "test123",
    xp: 15000,
    level: 30,
    bio: "Community master",
    interests: ["strategy", "community-building"]
  }
];

export async function seedTestUsers() {
  try {
    console.log('🌱 Seeding test users...');
    
    // Create test users
    for (const testUser of TEST_USERS) {
      const existingUser = await db.select().from(users).where(eq(users.email, testUser.email));
      
      if (existingUser.length === 0) {
        await db.insert(users).values({
          ...testUser,
          createdAt: new Date(),
          currentStreak: Math.floor(Math.random() * 10),
          longestStreak: Math.floor(Math.random() * 20),
          lastLoginAt: new Date()
        });
        console.log(`✅ Created test user: ${testUser.username}`);
      } else {
        console.log(`ℹ️ Test user ${testUser.username} already exists`);
      }
    }
    
    console.log('✅ Test users seeding completed');
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
  }
}
