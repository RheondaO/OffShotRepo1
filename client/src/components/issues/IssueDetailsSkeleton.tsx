import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function IssueDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-32 mb-6" />
        
        <Card className="border border-[hsl(var(--space-purple)/20)]">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            
            <Skeleton className="h-9 w-4/5 mb-2" />
            <Skeleton className="h-9 w-3/5 mb-4" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-4" />
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-1">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="space-y-3 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              
              <Skeleton className="h-5 w-36" />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-12">
          <Skeleton className="h-7 w-48 mb-6" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}