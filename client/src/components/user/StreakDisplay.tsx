import React from "react";
import { useStreak } from "@/hooks/use-streak";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function StreakDisplay() {
  const { streakInfo, isLoadingStreak, updateStreak, isUpdatingStreak } = useStreak();

  // Calculate last login time
  const lastLoginText = streakInfo.lastLoginAt
    ? formatDistanceToNow(new Date(streakInfo.lastLoginAt), { addSuffix: true })
    : "Never";

  if (isLoadingStreak) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg"><Skeleton className="h-6 w-3/4" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Daily Streak
        </CardTitle>
        <CardDescription>
          Log in daily to maintain your streak and earn XP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="mb-1 flex gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              Current
            </Badge>
            <span className="text-2xl font-bold">{streakInfo.currentStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="mb-1 flex gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              Best
            </Badge>
            <span className="text-2xl font-bold">{streakInfo.longestStreak}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last login: {lastLoginText}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => updateStreak()}
          disabled={isUpdatingStreak}
        >
          {isUpdatingStreak ? "Updating..." : "Update Streak"}
        </Button>
      </CardFooter>
    </Card>
  );
}