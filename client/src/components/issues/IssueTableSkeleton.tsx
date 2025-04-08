import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function IssueTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Issue</TableHead>
          <TableHead className="w-[15%]">Category</TableHead>
          <TableHead className="w-[15%]">Status</TableHead>
          <TableHead className="w-[15%]">Submitted</TableHead>
          <TableHead className="w-[15%] text-right">Votes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <Skeleton className="h-6 w-10" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}