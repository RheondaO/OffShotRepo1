import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Check, Award, Heart, Star, Clock, ArrowUp, Calendar, BookOpen, 
  MessageSquare, Trophy, Play, Users, Mail, Tag as TagIcon, 
  LogIn, UserPlus, CheckSquare, FileText, Share2, Reply, 
  Image, Clipboard, Scissors, CheckCircle, Activity
} from "lucide-react";
import { Issue, Tag, Vote, UserActivity, UserNft, XpActivity } from "@shared/schema";
import { 
  getActivityName, getActivityColor, getActivityIcon, 
  formatXp, groupActivitiesByDate, getSortedDates
} from "@/lib/activity-utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's issues
  const { data: userIssues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ["/api/users", user?.id, "issues"],
    enabled: !!user,
  });
  
  // Fetch issues assigned to the user
  const { data: assignedIssues, isLoading: assignedIssuesLoading } = useQuery<Issue[]>({
    queryKey: ["/api/users", user?.id, "assigned-issues"],
    enabled: !!user,
  });

  // Fetch user's votes
  const { data: userVotes, isLoading: votesLoading } = useQuery<Vote[]>({
    queryKey: ["/api/users", user?.id, "votes"],
    enabled: !!user,
  });

  // Fetch user's NFTs
  const { data: userNfts, isLoading: nftsLoading } = useQuery<UserNft[]>({
    queryKey: ["/api/users", user?.id, "nfts"],
    enabled: !!user,
  });

  // Fetch user's activity history
  const { data: userActivities, isLoading: activitiesLoading } = useQuery<UserActivity[]>({
    queryKey: ["/api/users", user?.id, "activities"],
    enabled: !!user,
  });

  // Function to calculate XP for next level
  const getXpForNextLevel = (currentLevel: number) => {
    return currentLevel * 100; // Simple formula, can be adjusted
  };

  // Function to calculate progress percentage to next level
  const getProgressToNextLevel = () => {
    if (!user) return 0;
    
    const xpForCurrentLevel = (user.level - 1) * 100;
    const xpForNextLevel = user.level * 100;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = user.xp - xpForCurrentLevel;
    
    return Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));
  };

  // Function to get recent activity items
  const getRecentActivities = () => {
    if (!userActivities || activitiesLoading) return [];
    
    // Sort by most recent first
    return [...userActivities].sort((a, b) => 
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    ).slice(0, 5); // Get the 5 most recent activities
  };
  
  // Helper function to safely format dates
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-10 text-center">
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-3xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-[hsl(var(--foreground)/70)]">@{user.username}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-[hsl(var(--space-blue)/20)]">
                    Level {user.level}
                  </Badge>
                  <Badge variant="outline" className="bg-[hsl(var(--space-pink)/20)]">
                    {userIssues?.length || 0} Issues
                  </Badge>
                  <Badge variant="outline" className="bg-[hsl(var(--space-gold)/20)]">
                    {userVotes?.length || 0} Votes
                  </Badge>
                  <Badge variant="outline" className="bg-[hsl(var(--space-green)/20)]">
                    {userNfts?.length || 0} NFTs
                  </Badge>
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>XP: {user.xp}</span>
                    <span>{getXpForNextLevel(user.level)} XP for Level {user.level + 1}</span>
                  </div>
                  <Progress value={getProgressToNextLevel()} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="issues">My Issues</TabsTrigger>
          <TabsTrigger value="assigned-issues">Assigned Issues</TabsTrigger>
          <TabsTrigger value="activity">Activity History</TabsTrigger>
          <TabsTrigger value="nfts">NFT Collection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Stats</CardTitle>
                <CardDescription>Your activity on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[hsl(var(--space-blue))]" />
                      <span>Level</span>
                    </div>
                    <span className="font-medium">{user.level}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-[hsl(var(--space-gold))]" />
                      <span>Total XP</span>
                    </div>
                    <span className="font-medium">{user.xp}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[hsl(var(--space-green))]" />
                      <span>Issues Created</span>
                    </div>
                    <span className="font-medium">{userIssues?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-[hsl(var(--space-pink))]" />
                      <span>Votes Cast</span>
                    </div>
                    <span className="font-medium">{userVotes?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-[hsl(var(--space-purple))]" />
                      <span>Comments</span>
                    </div>
                    <span className="font-medium">0</span> {/* Add once implemented */}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[hsl(var(--space-orange))]" />
                      <span>Assigned Issues</span>
                    </div>
                    <span className="font-medium">{assignedIssues?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <p>Loading activity history...</p>
                ) : getRecentActivities().length > 0 ? (
                  <div className="space-y-4">
                    {getRecentActivities().map((activity, index) => {
                      // Get the appropriate icon component based on activity type
                      const IconComponent = (() => {
                        const iconName = getActivityIcon(activity.activityId);
                        switch(iconName) {
                          case 'trophy': return Trophy;
                          case 'play': return Play;
                          case 'users': return Users;
                          case 'mail': return Mail;
                          case 'tag': return TagIcon;
                          case 'log-in': return LogIn;
                          case 'user-plus': return UserPlus;
                          case 'check-square': return CheckSquare;
                          case 'award': return Award;
                          case 'heart': return Heart;
                          case 'message-square': return MessageSquare;
                          case 'file-text': return FileText;
                          case 'share': return Share2;
                          case 'reply': return Reply;
                          case 'image': return Image;
                          case 'clipboard': return Clipboard;
                          case 'scissors': return Scissors;
                          case 'check-circle': return CheckCircle;
                          default: return Activity;
                        }
                      })();
                      
                      const color = getActivityColor(activity.activityId);
                      const bgColorClass = `bg-[hsl(var(--space-${color})/20)]`;
                      const textColorClass = `text-[hsl(var(--space-${color}))]`;
                      
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`mt-0.5 ${bgColorClass} p-1.5 rounded-full`}>
                            <IconComponent className={`h-4 w-4 ${textColorClass}`} />
                          </div>
                          <div>
                            <p className="font-medium">{getActivityName(activity.activityId)}</p>
                            <p className="text-sm text-[hsl(var(--foreground)/70)]">
                              Earned {formatXp(activity.xpEarned)} on {formatDate(activity.performedAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-sm text-[hsl(var(--foreground)/70)] py-2">
                    No recent activity recorded.
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>XP Breakdown</CardTitle>
                <CardDescription>Where your XP comes from</CardDescription>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <p>Loading XP data...</p>
                ) : userActivities && userActivities.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Group activities by type and sum XP */}
                      {Object.entries(
                        userActivities.reduce((acc, curr) => {
                          acc[curr.activityId] = (acc[curr.activityId] || 0) + curr.xpEarned;
                          return acc;
                        }, {} as { [key: number]: number })
                      ).map(([activityIdStr, xpEarned], index) => {
                        const activityId = parseInt(activityIdStr);
                        const color = getActivityColor(activityId);
                        const bgColorClass = `bg-[hsl(var(--space-${color})/20)]`;
                        const textColorClass = `text-[hsl(var(--space-${color}))]`;

                        // Get the appropriate icon component based on activity type
                        const IconComponent = (() => {
                          const iconName = getActivityIcon(activityId);
                          switch(iconName) {
                            case 'trophy': return Trophy;
                            case 'play': return Play;
                            case 'users': return Users;
                            case 'mail': return Mail;
                            case 'tag': return TagIcon;
                            case 'log-in': return LogIn;
                            case 'user-plus': return UserPlus;
                            case 'check-square': return CheckSquare;
                            case 'award': return Award;
                            case 'heart': return Heart;
                            case 'message-square': return MessageSquare;
                            case 'file-text': return FileText;
                            case 'share': return Share2;
                            case 'reply': return Reply;
                            case 'image': return Image;
                            case 'clipboard': return Clipboard;
                            case 'scissors': return Scissors;
                            case 'check-circle': return CheckCircle;
                            default: return Activity;
                          }
                        })();
                        
                        return (
                          <Card key={index}>
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <p className="text-sm text-[hsl(var(--foreground)/70)]">
                                  {getActivityName(activityId)}
                                </p>
                                <p className="font-medium">{formatXp(xpEarned)}</p>
                              </div>
                              <div className={`${bgColorClass} p-2 rounded-full`}>
                                <IconComponent className={`h-5 w-5 ${textColorClass}`} />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-[hsl(var(--foreground)/70)] py-2">
                    No XP history available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
              <CardDescription>Milestones you've reached on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Achievement badges - will be expanded with real data */}
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="bg-[hsl(var(--space-green)/20)] p-3 rounded-full mb-2">
                      <Award className="h-6 w-6 text-[hsl(var(--space-green))]" />
                    </div>
                    <h3 className="font-medium">First Issue</h3>
                    <p className="text-sm text-[hsl(var(--foreground)/70)]">Created your first community issue</p>
                    {(userIssues?.length || 0) > 0 && (
                      <div className="mt-2 flex items-center text-[hsl(var(--space-green))]">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="bg-[hsl(var(--space-blue)/20)] p-3 rounded-full mb-2">
                      <Award className="h-6 w-6 text-[hsl(var(--space-blue))]" />
                    </div>
                    <h3 className="font-medium">Voter</h3>
                    <p className="text-sm text-[hsl(var(--foreground)/70)]">Cast your first vote on an issue</p>
                    {(userVotes?.length || 0) > 0 && (
                      <div className="mt-2 flex items-center text-[hsl(var(--space-green))]">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="bg-[hsl(var(--space-pink)/20)] p-3 rounded-full mb-2">
                      <Award className="h-6 w-6 text-[hsl(var(--space-pink))]" />
                    </div>
                    <h3 className="font-medium">Collector</h3>
                    <p className="text-sm text-[hsl(var(--foreground)/70)]">Acquired your first NFT</p>
                    {(userNfts?.length || 0) > 0 && (
                      <div className="mt-2 flex items-center text-[hsl(var(--space-green))]">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="bg-[hsl(var(--space-gold)/20)] p-3 rounded-full mb-2">
                      <Award className="h-6 w-6 text-[hsl(var(--space-gold))]" />
                    </div>
                    <h3 className="font-medium">Level 5</h3>
                    <p className="text-sm text-[hsl(var(--foreground)/70)]">Reached level 5 on the platform</p>
                    {(user?.level || 0) >= 5 && (
                      <div className="mt-2 flex items-center text-[hsl(var(--space-green))]">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Unlocked</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Add more achievement badges as needed */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>My Issues</CardTitle>
              <CardDescription>Issues you've created in the community</CardDescription>
            </CardHeader>
            <CardContent>
              {issuesLoading ? (
                <p>Loading issues...</p>
              ) : userIssues && userIssues.length > 0 ? (
                <div className="space-y-4">
                  {userIssues.map((issue) => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <h3 className="font-medium">{issue.title}</h3>
                            <p className="text-sm text-[hsl(var(--foreground)/70)] line-clamp-2">
                              {issue.description}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 md:mt-0">
                            <Badge variant="outline">{issue.status}</Badge>
                            <span className="text-xs text-[hsl(var(--foreground)/70)]">
                              <Calendar className="h-3 w-3 inline-block mr-1" />
                              {formatDate(issue.createdAt)}
                            </span>
                            <span className="text-xs flex items-center">
                              <Heart className="h-3 w-3 text-[hsl(var(--space-pink))] mr-1" />
                              {issue.votes || 0} votes
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-[hsl(var(--foreground)/70)] py-6">
                  You haven't created any issues yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assigned-issues">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Issues</CardTitle>
              <CardDescription>Issues that have been assigned to you to work on</CardDescription>
            </CardHeader>
            <CardContent>
              {assignedIssuesLoading ? (
                <p>Loading assigned issues...</p>
              ) : assignedIssues && assignedIssues.length > 0 ? (
                <div className="space-y-4">
                  {assignedIssues.map((issue) => (
                    <Card key={issue.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <h3 className="font-medium">{issue.title}</h3>
                            <p className="text-sm text-[hsl(var(--foreground)/70)] line-clamp-2">
                              {issue.description}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 md:mt-0">
                            <Badge variant="outline" className={
                              issue.priority === 'low' ? 'bg-[hsl(var(--space-green)/20)]' :
                              issue.priority === 'medium' ? 'bg-[hsl(var(--space-blue)/20)]' :
                              issue.priority === 'high' ? 'bg-[hsl(var(--space-orange)/20)]' :
                              'bg-[hsl(var(--space-red)/20)]'
                            }>
                              {issue.priority}
                            </Badge>
                            <Badge variant="outline">{issue.status}</Badge>
                            <span className="text-xs text-[hsl(var(--foreground)/70)]">
                              <Calendar className="h-3 w-3 inline-block mr-1" />
                              Due: {formatDate(issue.expectedCompletionAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-[hsl(var(--foreground)/70)] py-6">
                  You don't have any issues assigned to you.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>A record of your actions and earned XP</CardDescription>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <p>Loading activity history...</p>
              ) : userActivities && userActivities.length > 0 ? (
                <div className="space-y-6">
                  {/* Group activities by date */}
                  {Object.entries(groupActivitiesByDate(userActivities)).map(([date, activities], groupIndex) => (
                    <div key={groupIndex} className="mb-8">
                      <h3 className="text-sm font-medium mb-4 text-[hsl(var(--foreground)/70)]">{date}</h3>
                      
                      {activities
                        .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
                        .map((activity, index) => {
                          // Get the appropriate icon component based on activity type
                          const IconComponent = (() => {
                            const iconName = getActivityIcon(activity.activityId);
                            switch(iconName) {
                              case 'trophy': return Trophy;
                              case 'play': return Play;
                              case 'users': return Users;
                              case 'mail': return Mail;
                              case 'tag': return TagIcon;
                              case 'log-in': return LogIn;
                              case 'user-plus': return UserPlus;
                              case 'check-square': return CheckSquare;
                              case 'award': return Award;
                              case 'heart': return Heart;
                              case 'message-square': return MessageSquare;
                              case 'file-text': return FileText;
                              case 'share': return Share2;
                              case 'reply': return Reply;
                              case 'image': return Image;
                              case 'clipboard': return Clipboard;
                              case 'scissors': return Scissors;
                              case 'check-circle': return CheckCircle;
                              default: return Activity;
                            }
                          })();
                          
                          const color = getActivityColor(activity.activityId);
                          const bgColorClass = `bg-[hsl(var(--space-${color})/20)]`;
                          const textColorClass = `text-[hsl(var(--space-${color}))]`;
                          
                          return (
                            <div key={index} className="relative pl-8 pb-6">
                              {index !== activities.length - 1 && (
                                <div className="absolute left-3 top-3 bottom-0 w-px bg-[hsl(var(--border))]"></div>
                              )}
                              <div className={`absolute left-0 top-0 ${bgColorClass} p-1.5 rounded-full`}>
                                <IconComponent className={`h-4 w-4 ${textColorClass}`} />
                              </div>
                              <div>
                                <p className="font-medium">{getActivityName(activity.activityId)}</p>
                                <p className="text-sm text-[hsl(var(--foreground)/70)]">
                                  Earned {formatXp(activity.xpEarned)}
                                </p>
                                <p className="text-xs text-[hsl(var(--foreground)/60)]">
                                  {new Date(activity.performedAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-[hsl(var(--foreground)/70)] py-6">
                  No activity history available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nfts">
          <Card>
            <CardHeader>
              <CardTitle>NFT Collection</CardTitle>
              <CardDescription>Digital assets you've acquired</CardDescription>
            </CardHeader>
            <CardContent>
              {nftsLoading ? (
                <p>Loading NFTs...</p>
              ) : userNfts && userNfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userNfts.map((userNft) => (
                    <Card key={userNft.id}>
                      <CardContent className="p-4">
                        <div className="aspect-square bg-[hsl(var(--secondary)/50)] rounded-md mb-3 flex items-center justify-center">
                          {/* Add NFT image when available */}
                          <Award className="h-12 w-12 text-[hsl(var(--space-gold))]" />
                        </div>
                        <h3 className="font-medium">NFT #{userNft.nftId}</h3>
                        <p className="text-xs text-[hsl(var(--foreground)/70)]">
                          Token ID: {userNft.tokenId}
                        </p>
                        <p className="text-xs text-[hsl(var(--foreground)/70)]">
                          Acquired: {formatDate(userNft.acquiredAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-[hsl(var(--foreground)/70)] py-6">
                  You haven't acquired any NFTs yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}