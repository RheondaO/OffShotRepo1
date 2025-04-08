import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      <div className="absolute -right-12 -top-12 opacity-10 transition-opacity group-hover:opacity-20">
        <Skeleton className="h-40 w-40 rounded-full" />
      </div>
    </div>
  );
}