import { Skeleton } from "@/components/ui/skeleton";

export function RichTextSkeleton() {
  return (
    <div className="p-2 h-56 flex items-center">
      <div className="flex w-full items flex-col gap-4 rounded-lg border border-transparent p-2">
        {/* Heading-like Skeleton */}
        <Skeleton className="h-5 w-3/4 max-w-lg rounded-md " />

        {/* 5 Lines of Ragged Text */}
        <div className="flex max-w-3xl flex-col gap-3">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-[92%] rounded" />
          <Skeleton className="h-3 w-[98%] rounded" />
          <Skeleton className="h-3 w-[85%] rounded" />
          <Skeleton className="h-3 w-[60%] rounded" />
        </div>
      </div>
    </div>
  );
}
