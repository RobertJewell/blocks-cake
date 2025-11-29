import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const HeroSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-full max-w-xs mx-auto max-h-48 h-48", className)}>
      <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-xl  p-3">
        {/* Mini Heading */}
        <Skeleton className="mt-8 h-4 w-3/4 rounded-sm" />
        {/* Mini Subheading & CTA Area */}
        <div className="mt-1 flex w-full flex-col items-center gap-1">
          <Skeleton className="h-1.5 w-1/3 rounded-[2px]" />
          <Skeleton className="mt-1 h-4 w-16 rounded-md" />
        </div>

        {/* Mini Images Area */}
        <div className="absolute bottom-0 w-full h-full pointer-events-none">
          <div className="absolute bottom-0 left-1/2 z-10 size-20 -translate-x-[120%] translate-y-[20%]">
            <Skeleton className="h-full w-full -rotate-6 rounded-lg " />
          </div>

          <div className="absolute bottom-0 left-1/2 size-20 translate-x-[20%] translate-y-[20%]">
            <Skeleton className="h-full w-full rotate-6 rounded-lg " />
          </div>
        </div>
      </div>
    </div>
  );
};
