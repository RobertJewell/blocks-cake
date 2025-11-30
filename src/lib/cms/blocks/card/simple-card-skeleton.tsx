import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const SimpleCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full max-w-64 mx-auto max-h-48 h-48", className)}>
      <div className="relative flex h-full w-full  items-center overflow-hidden rounded-xl p-3 gap-4">
        {/* Mini Text Side */}
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {/* Subheading */}
          <Skeleton className="h-2 w-1/3 rounded-[2px]" />
          {/* Heading */}
          <Skeleton className="h-4 w-full rounded-sm" />

          {/* Description */}
          <div className="mt-1 space-y-1">
            <Skeleton className="h-1.5 w-full rounded-[2px]" />
            <Skeleton className="h-1.5 w-5/6 rounded-[2px]" />
            <Skeleton className="h-1.5 w-4/6 rounded-[2px]" />
          </div>

          {/* Button */}
          <Skeleton className="mt-2 h-5 w-16 rounded-md" />
        </div>

        {/* Mini Image Side */}
        <div className="h-28 w-1/2 shrink-0">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
