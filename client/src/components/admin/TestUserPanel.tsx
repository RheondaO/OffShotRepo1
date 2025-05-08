
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TestUserPanel() {
  const { isAdmin, impersonateUser, stopImpersonating, isImpersonating } = useAuth();

  if (!isAdmin) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test User Panel</CardTitle>
        <CardDescription>Impersonate test users for testing purposes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isImpersonating && (
          <Button 
            variant="destructive" 
            onClick={() => stopImpersonating()}
            className="mb-4"
          >
            Stop Impersonating
          </Button>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={() => impersonateUser(1)}>Test Beginner</Button>
          <Button onClick={() => impersonateUser(2)}>Test Intermediate</Button>
          <Button onClick={() => impersonateUser(3)}>Test Advanced</Button>
          <Button onClick={() => impersonateUser(4)}>Test Expert</Button>
          <Button onClick={() => impersonateUser(5)}>Test Master</Button>
        </div>
      </CardContent>
    </Card>
  );
}
