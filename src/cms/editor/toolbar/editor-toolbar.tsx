import { blurUpVariants } from "@/cms/blocks/shared/animations";
import { useIsMobile } from "@/cms/hooks/use-is-mobile";
import { useSavePage } from "@/cms/hooks/useSavePage";
import { useEditorShortcuts } from "@/cms/hooks/useShortcuts";
import { useEditorStore, ViewMode } from "@/cms/stores/editor-store";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/ui/utils/cn";
import { Route } from "@/routes/app/(authenticated)/edit/$";
import { Eye, Pencil, Plus, Save } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useHotkeys } from "react-hotkeys-hook";
import { ToolbarButton } from "./toolbar-button";

export function EditorToolbar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const page = useEditorStore((s) => s.page);
  const initialPage = useEditorStore((s) => s.initialPage);
  const setInitialPage = useEditorStore((s) => s.setInitialPage);
  const editedBlocks = useEditorStore((s) => s.editedBlocks);
  const resetEditedBlocks = useEditorStore((s) => s.resetEditedBlocks);

  const { _splat } = Route.useParams();
  const savePageMutation = useSavePage();

  const isMobile = useIsMobile();
  const isMobileEditPanelOpen = mode === "edit" && isMobile;

  useHotkeys("meta+e", () => setMode("edit"), [setMode]);
  useHotkeys("meta+a", () => setMode("add"), [setMode], {
    preventDefault: true,
  });

  //block order
  const currentOrder = page?.blocks.map((b) => b.id).join("|") ?? "";
  const initialOrder = initialPage?.blocks.map((b) => b.id).join("|") ?? "";
  const hasReordered = initialOrder && currentOrder !== initialOrder;

  const showSave = editedBlocks.size > 0 || hasReordered;

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
    { value: "view", icon: Eye, label: "View Mode", shortcut: KbdView },
    { value: "edit", icon: Pencil, label: "Edit Mode", shortcut: KbdEdit },
    { value: "add", icon: Plus, label: "Add Mode", shortcut: KbdAdd },
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
            "bg-background/70 backdrop-blur-xs fixed bottom-2 md:bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center  overflow-hidden rounded-full border p-1.5 shadow-sm",
          )}
          // set explictily to stop weird warping on resize
          style={{ height: 46, borderRadius: 23 }}
        >
          {/* Mode Toggle Group */}
          <motion.div
            layoutId={"edit"}
            layout="position"
            className="relative z-10"
          >
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(val: ViewMode) => {
                if (val) setMode(val);
              }}
              className="gap-2"
            >
              {items.map((item) => {
                const isSelected = mode === item.value;
                const Icon = item.icon;

                return (
                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem
                        key={item.value}
                        value={item.value}
                        aria-label={item.label}
                        className={cn(
                          "relative flex h-8 w-8 bg-transparent! items-center justify-center bg-none rounded-full p-0 transition-colors duration-200 hover:bg-transparent hover:text-foreground",
                          isSelected
                            ? "text-background"
                            : "text-muted-foreground",
                        )}
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

                        <div className="relative z-10">
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              isSelected && "text-background",
                            )}
                          />
                        </div>
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent className="px-1.5">
                      <item.shortcut />
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </ToggleGroup>
          </motion.div>

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
                className="ml-1  border-l"
              >
                <ToolbarButton id="save" onClick={handleSave}>
                  <Save className="size-4" />
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
