import { pages, screenshots } from "@/cms/lib/core/db/schema";
import { Badge } from "@/cms/ui/badge";
import { Link } from "@tanstack/react-router";
import { InferSelectModel } from "drizzle-orm";
import { Loader2 } from "lucide-react";

type PageType = InferSelectModel<typeof pages>;
type ScreenshotType = InferSelectModel<typeof screenshots>;

interface PageCardProps {
  slug: PageType["slug"];
  title: PageType["title"];
  status: PageType["status"];
  screenshot?: ScreenshotType;
  r2BaseUrl: string;
}

export function PageCard({
  slug,
  title,
  status,
  screenshot,
  r2BaseUrl,
}: PageCardProps) {
  const screenshotUrl = screenshot?.storagePath
    ? `${r2BaseUrl}/${screenshot.storagePath}`
    : null;
  const isLoadingScreenshot = screenshot?.status === "pending";

  return (
    <Link to="/app/edit/$" params={{ _splat: slug }} className="group">
      <div className="flex flex-col gap-3 overflow-hidden rounded-lg border border-border hover:border-foreground/50 transition-colors bg-background h-full">
        {/* Screenshot Preview */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {screenshotUrl ? (
            <img
              src={screenshotUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-200"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              {isLoadingScreenshot ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  <div>No screenshot yet</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1 group-hover:underline">
              {title}
            </h3>
            <Badge
              variant={status === "published" ? "success" : "warning"}
              className="shrink-0"
            >
              {status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{slug}</p>
        </div>
      </div>
    </Link>
  );
}
