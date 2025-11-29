import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const RichTextSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "p-2 max-w-xs justify-center mx-auto h-48 flex items-center",
        className,
      )}
    >
      <div className="flex w-full items flex-col gap-4 px-8 rounded-lg border border-transparent p-2">
        {/* Heading-like Skeleton */}
        <Skeleton className="h-4 mt-4 w-3/4 max-w-lg rounded-md " />

        {/* 5 Lines of Ragged Text */}
        <div className="flex max-w-3xl flex-col gap-2">
          <Skeleton className="h-2 w-full rounded" />
          <Skeleton className="h-2 w-[92%] rounded" />
          <Skeleton className="h-2 w-[98%] rounded" />
          <Skeleton className="h-2 w-[85%] rounded" />
          <Skeleton className="h-2 w-[90%] rounded" />
          <Skeleton className="h-2 w-[60%] rounded" />
        </div>
      </div>
    </div>
  );
};
