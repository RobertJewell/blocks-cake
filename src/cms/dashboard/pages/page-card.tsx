import { pages, screenshots } from "@/cms/lib/core/db/schema";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/cms/ui/alert-dialog";
import { Badge } from "@/cms/ui/badge";
import { Button } from "@/cms/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/cms/ui/menu";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { InferSelectModel } from "drizzle-orm";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PageType = InferSelectModel<typeof pages>;
type ScreenshotType = InferSelectModel<typeof screenshots>;

interface PageCardProps {
  slug: PageType["slug"];
  title: PageType["title"];
  status: PageType["status"];
  screenshot?: ScreenshotType;
}

const r2BaseUrl =
  import.meta.env.VITE_CLOUDFLARE_R2_BASE_URL ||
  "https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev";

export function PageCard({ slug, title, status, screenshot }: PageCardProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const screenshotUrl = screenshot?.storagePath
    ? `${r2BaseUrl}/${screenshot.storagePath}`
    : null;
  const isLoadingScreenshot = screenshot?.status === "pending";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/pages/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message || "Failed to delete page");
      }

      toast.success(`Page "${title}" deleted successfully`);
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete page";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group font-editor relative">
      <Link to="/app/edit/$" params={{ _splat: slug }} className="flex">
        <div className="flex flex-col gap-3 overflow-hidden rounded-lg border border-border hover:border-foreground/50 transition-colors bg-background h-full w-full">
          {/* Screenshot Preview */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            {screenshotUrl ? (
              <img
                src={screenshotUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-200"
                onError={(e) => {
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

      {/* Menu Dropdown - TODO probably want to make a resuable verion of this as we're using it on the preview cards*/}
      <div className="absolute top-2 right-2">
        <Menu>
          <MenuTrigger
            render={() => (
              <Button
                variant="secondary"
                size="sm"
                className="size-8! p-0 bg-background hover:bg-background! border-border shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDots className="h-4 w-4" />
              </Button>
            )}
          ></MenuTrigger>

          <MenuPopup align="end" className="w-48">
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </MenuItem>
          </MenuPopup>
        </Menu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="font-editor">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be
              undone. All blocks, assets, and screenshots associated with this
              page will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose>
              <Button variant="outline">Cancel</Button>
            </AlertDialogClose>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
