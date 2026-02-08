import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/ui/utils/cn";

export const FeaturesThreeColumnSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={cn("w-full max-w-64 mx-auto max-h-48 h-48", className)}>
      {/* Added flex flex-col justify-center to center content vertically */}
      <div className="relative flex flex-col h-full w-full justify-center overflow-hidden rounded-xl p-4 gap-4">
        {/* Top Section: Simplified Intro */}
        <div className="flex flex-col items-center gap-2">
          {/* Subheading */}
          <Skeleton className="h-1.5 w-1/4 rounded-[2px]" />
          {/* Heading */}
          <Skeleton className="h-5 w-5/6 rounded-sm" />
        </div>

        {/* Bottom Section: Simplified Three Columns */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-2/3 rounded-[2px]" />
            <Skeleton className="h-8 w-full rounded-sm " />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-1/2 rounded-[2px]" />
            <Skeleton className="h-8 w-full rounded-sm " />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2 w-3/4 rounded-[2px]" />
            <Skeleton className="h-8 w-full rounded-sm " />
          </div>
        </div>
      </div>
    </div>
  );
};
