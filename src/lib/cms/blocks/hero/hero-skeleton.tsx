import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="w-full max-w-72 mx-auto max-h-56 h-56">
      {/* Mini Container: h-64 (16rem), rounded-xl to look like a mini card */}
      <div className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-xl bg-muted/20 p-3">
        {/* Mini Heading */}
        <Skeleton className="mt-8 h-4 w-3/4 rounded-sm" />

        {/* Mini Subheading & CTA Area */}
        <div className="mt-3 flex w-full flex-col items-center gap-1.5">
          <div className="flex flex-col items-center gap-1 w-full">
            <Skeleton className="h-2 w-1/2 rounded-[2px]" />
            <Skeleton className="h-2 w-1/3 rounded-[2px]" />
          </div>

          {/* Mini Button */}
          <Skeleton className="mt-1 h-5 w-16 rounded-md" />
        </div>

        {/* Mini Images Area */}
        <div className="absolute bottom-0 w-full h-full pointer-events-none">
          {/* Left Image - Scaled down significantly */}
          <div className="absolute bottom-0 left-1/2 z-10 size-20 -translate-x-[120%] translate-y-[20%]">
            <Skeleton className="h-full w-full -rotate-6 rounded-lg " />
          </div>

          {/* Right Image - Scaled down significantly */}
          <div className="absolute bottom-0 left-1/2 size-20 translate-x-[20%] translate-y-[20%]">
            <Skeleton className="h-full w-full rotate-6 rounded-lg " />
          </div>
        </div>
      </div>
    </div>
  );
}
