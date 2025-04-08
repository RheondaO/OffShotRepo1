import { db } from './db';
import { 
  xpActivities, 
  userActivities, 
  users, 
  nfts, 
  userNfts, 
  issues, 
  votes 
} from '@shared/schema';
import { eq } from 'drizzle-orm';

// This function adds demo activity history to the demo user
export async function seedDemoUser() {
  try {
    console.log('🌱 Seeding demo user activity history...');
    
    // Get or create demo user
    let demoUser = await getDemoUser();
    
    if (!demoUser) {
      console.log('❌ Demo user not found. Please ensure the demo user exists in the database.');
      return;
    }
    
    // Add various activities to the demo user
    await addUserActivities(demoUser.id);
    
    // Add NFTs to the demo user
    await addUserNFTs(demoUser.id);
    
    // Add votes to the demo user
    await addUserVotes(demoUser.id);
    
    // Update the user's XP and level based on activities
    await updateUserXpLevel(demoUser.id);
    
    console.log(`✅ Demo user (ID: ${demoUser.id}) successfully updated with activity history.`);
  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
  }
}

// Get or create demo user 
async function getDemoUser() {
  // Find the demo user by email/username
  const existingUsers = await db.select().from(users).where(eq(users.email, 'demo@example.com'));
  
  if (existingUsers.length > 0) {
    return existingUsers[0];
  }
  
  // If not found, you may want to create one here, but for now we'll just return null
  return null;
}

// Add user activities
async function addUserActivities(userId: number) {
  // First, clean up any existing activities for this user to avoid duplicates
  await db.delete(userActivities).where(eq(userActivities.userId, userId));
  
  // Get all activities
  const allActivities = await db.select().from(xpActivities);
  if (allActivities.length === 0) {
    console.log('❗ No activities found in the database.');
    return;
  }
  
  // We'll use hardcoded IDs for simplicity - no need to create a mapping
  console.log(`Found ${allActivities.length} activities in the database.`);
  
  // Define some activities for the demo user
  const demoActivities = [
    // Signup activity (25 XP)
    {
      activityId: 1, // Using hardcoded IDs as fallback
      xpEarned: 25,
      performedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    // Various activities with different timestamps
    {
      activityId: 2,
      xpEarned: 5,
      performedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
    },
    {
      activityId: 4,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    },
    {
      activityId: 4,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000), // 24 days ago
    },
    {
      activityId: 3,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    },
    {
      activityId: 2,
      xpEarned: 5,
      performedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    },
    {
      activityId: 8,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      activityId: 6,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
    {
      activityId: 6,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    },
    {
      activityId: 6,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 9 days ago + 30 min
    },
    {
      activityId: 1,
      xpEarned: 25,
      performedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      activityId: 5,
      xpEarned: 5,
      performedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      activityId: 1,
      xpEarned: 15,
      performedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      activityId: 4,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      activityId: 3,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      activityId: 6,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      activityId: 3,
      xpEarned: 2,
      performedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    // Add more recent activity
    {
      activityId: 4,
      xpEarned: 1,
      performedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    }
  ];
  
  // Insert activities one by one to ensure they're all processed
  for (const activity of demoActivities) {
    await db.insert(userActivities).values({
      userId,
      activityId: activity.activityId,
      xpEarned: activity.xpEarned,
      performedAt: activity.performedAt,
    });
  }
  
  console.log(`Added ${demoActivities.length} activities to demo user.`);
}

// Add NFTs to the user
async function addUserNFTs(userId: number) {
  // First, clean up any existing NFTs for this user to avoid duplicates
  await db.delete(userNfts).where(eq(userNfts.userId, userId));
  
  // Get all NFTs
  const allNFTs = await db.select().from(nfts);
  if (allNFTs.length === 0) {
    console.log('❗ No NFTs found in the database.');
    return;
  }
  
  // Select 2 random NFTs to give to the user
  const nftsSample = allNFTs.slice(0, Math.min(2, allNFTs.length));
  
  // Add NFTs to the user
  for (let i = 0; i < nftsSample.length; i++) {
    const nft = nftsSample[i];
    await db.insert(userNfts).values({
      userId,
      nftId: nft.id,
      tokenId: `demo-${nft.id}-${Date.now()}`,
      acquiredAt: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000), // 1-2 weeks ago
    });
  }
  
  console.log(`Added ${nftsSample.length} NFTs to demo user.`);
}

// Add votes to the user
async function addUserVotes(userId: number) {
  // First, clean up any existing votes for this user to avoid duplicates
  await db.delete(votes).where(eq(votes.userId, userId));
  
  // Get all issues
  const allIssues = await db.select().from(issues);
  if (allIssues.length === 0) {
    console.log('❗ No issues found in the database.');
    return;
  }
  
  // Select up to 3 random issues to vote on
  const issuesSample = allIssues.slice(0, Math.min(3, allIssues.length));
  
  // Add votes to the issues
  for (let i = 0; i < issuesSample.length; i++) {
    const issue = issuesSample[i];
    await db.insert(votes).values({
      userId,
      issueId: issue.id,
      createdAt: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000), // 3-9 days ago
    });
  }
  
  console.log(`Added ${issuesSample.length} votes to demo user.`);
}

// Update the user's XP and level based on activities
async function updateUserXpLevel(userId: number) {
  // Calculate total XP based on activities
  const activities = await db
    .select()
    .from(userActivities)
    .where(eq(userActivities.userId, userId));
  
  const totalXp = activities.reduce((sum, activity) => sum + activity.xpEarned, 0);
  
  // Calculate level (very simple formula - adjust as needed)
  const level = Math.max(1, Math.floor(Math.sqrt(totalXp / 25)));
  
  // Update user
  await db
    .update(users)
    .set({ xp: totalXp, level })
    .where(eq(users.id, userId));
  
  console.log(`Updated demo user to XP: ${totalXp}, Level: ${level}`);
}