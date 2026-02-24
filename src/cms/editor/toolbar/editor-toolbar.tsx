import { blurUpVariants } from "@/cms/blocks/shared/animations";
import { useIsMobile } from "@/cms/lib/hooks/use-is-mobile";
import { usePageDiffWithIds } from "@/cms/lib/hooks/usePageDiff";
import { useSavePage } from "@/cms/lib/hooks/useSavePage";
import { useEditorShortcuts } from "@/cms/lib/hooks/useShortcuts";
import { useEditorStore, ViewMode } from "@/cms/lib/stores/editor-store";
import { cn } from "@/cms/lib/utils";
import { Kbd, KbdGroup } from "@/cms/ui/kbd";
import { Separator } from "@/cms/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/cms/ui/toggle-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/cms/ui/tooltip";
import { Route } from "@/routes/app/(authenticated)/edit/$";
import {
  IconDeviceFloppy,
  IconEye,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useHotkeys } from "react-hotkeys-hook";
import { ToolbarButton } from "./toolbar-button";

export function EditorToolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const page = useEditorStore((s) => s.page);
  const initialPage = useEditorStore((s) => s.initialPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const resetEditedBlocks = useEditorStore((s) => s.resetEditedBlocks);

  const { _splat } = Route.useParams();
  const savePageMutation = useSavePage();

  const isMobile = useIsMobile();
  const isMobileEditPanelOpen = mode === "edit" && isMobile;

  const { hasChanges: showSave } = usePageDiffWithIds(page, initialPage);

  useHotkeys("meta+e", () => setMode("edit"), [setMode]);
  useHotkeys("meta+a", () => setMode("add"), [setMode], {
    preventDefault: true,
  });

  const handleSave = () => {
    page &&
      showSave &&
      savePageMutation.mutate(
        { slug: _splat!, data: page, status: "published" },
        {
          onSuccess: () => {
            resetEditedBlocks();
            setMode("view");
            setInitialPage(page);
          },
        },
      );
  };

  useEditorShortcuts({ onSave: handleSave });

  const items = [
    { value: "view", icon: IconEye, label: "View", shortcut: KbdView },
    { value: "edit", icon: IconPencil, label: "Edit", shortcut: KbdEdit },
    { value: "add", icon: IconPlus, label: "Add", shortcut: KbdAdd },
  ];

  return (
    <AnimatePresence>
      {!isMobileEditPanelOpen && (
        <motion.div
          key="editor-toolbar"
          layout
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={blurUpVariants}
          custom={{ y: 30 }}
          className={cn(
            "bg-background/70 backdrop-blur-xs fixed bottom-0 md:bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center  overflow-hidden rounded-full border p-1.5 shadow-sm",
          )}
          // set explictily to stop weird warping on resize
          style={{ height: 46, borderRadius: 23 }}
        >
          <TooltipProvider>
            {/* Mode Toggle Group */}
            <motion.div
              layoutId={"edit"}
              layout="position"
              className="relative z-10"
            >
              <ToggleGroup
                value={[mode]}
                onValueChange={(val: ViewMode[]) => {
                  // Always maintain at least one mode selected
                  if (val.length > 0) {
                    setMode(val[0]);
                  }
                }}
                className="gap-0.5"
              >
                {items.map((item) => {
                  const isSelected = mode === item.value;
                  const Icon = item.icon;

                  return (
                    <Tooltip key={item.value}>
                      <TooltipTrigger
                        render={
                          <ToggleGroupItem
                            value={item.value}
                            aria-label={item.label}
                            disabled={isSelected}
                            className={cn(
                              "relative flex h-8 w-8 bg-transparent! items-center justify-center bg-none rounded-full p-0 transition-colors duration-200 hover:bg-transparent hover:text-foreground",
                              isSelected
                                ? "text-background cursor-default"
                                : "text-muted-foreground",
                            )}
                          />
                        }
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="active-mode-bg"
                            className="absolute inset-0 rounded-full bg-muted-foreground"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 800,
                              damping: 50,
                            }}
                          />
                        )}

                        <div
                          className={cn(
                            "relative flex gap-2 items-center p-3 z-10 transition-colors",
                            isSelected && "text-background!",
                          )}
                        >
                          <Icon className={cn("h-4 w-4")} />
                          {/*<span>{item.label}</span>*/}
                        </div>
                      </TooltipTrigger>
                      <TooltipPopup className="">
                        <item.shortcut />
                      </TooltipPopup>
                    </Tooltip>
                  );
                })}
              </ToggleGroup>
            </motion.div>
          </TooltipProvider>

          {/* Save Button (Conditional) */}
          <AnimatePresence mode="popLayout" initial={false}>
            {showSave && page && (
              <motion.div
                key="save"
                layout="position"
                variants={blurUpVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                custom={{ x: 10, duration: 0.2 }}
                className="ml-2 flex gap-1.5"
              >
                <Separator orientation="vertical" />
                <ToolbarButton id="save" onClick={handleSave}>
                  <IconDeviceFloppy className="size-4" />
                  {savePageMutation.isPending ? "Saving…" : "Save"}
                </ToolbarButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KbdView() {
  return (
    <KbdGroup className="relative">
      <Kbd className="text-muted-foreground! bg-muted!">⌥</Kbd>
      <Kbd className="text-muted-foreground! bg-muted!">1</Kbd>
    </KbdGroup>
  );
}
function KbdEdit() {
  return (
    <KbdGroup>
      <Kbd className="text-muted-foreground! bg-muted!">⌥</Kbd>
      <Kbd className="text-muted-foreground! bg-muted!">2</Kbd>
    </KbdGroup>
  );
}
function KbdAdd() {
  return (
    <KbdGroup>
      <Kbd className="text-muted-foreground! bg-muted!">⌥</Kbd>
      <Kbd className="text-muted-foreground! bg-muted!">3</Kbd>
    </KbdGroup>
  );
}
