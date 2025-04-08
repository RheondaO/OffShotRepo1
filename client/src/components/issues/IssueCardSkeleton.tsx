import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IssueCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-11/12 mb-2" />
        <Skeleton className="h-4 w-10/12" />
      </CardContent>
      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-12" />
        </div>
      </CardFooter>
    </Card>
  );
}