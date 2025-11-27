import { useLocation, useNavigate } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { useEditorStore } from "../stores/editor-store";

export function useSiteShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  useHotkeys(
    "meta+e",
    () => {
      const currentPath = location.pathname;
      let targetPath = "";

      if (currentPath === "/") {
        targetPath = "/app/edit/index";
      } else {
        targetPath = `/app/edit${currentPath.startsWith("/") ? currentPath : "/" + currentPath}`;
      }
      navigate({ to: targetPath });
    },
    [location.pathname],
    { preventDefault: true },
  );
}

export function useEditorShortcuts({ onSave }: { onSave: () => void }) {
  const setMode = useEditorStore((s) => s.setMode);
  useHotkeys("meta+1", () => setMode("view"), [setMode], {
    preventDefault: true,
  });
  useHotkeys("meta+2", () => setMode("edit"), [setMode], {
    preventDefault: true,
  });
  useHotkeys("meta+3", () => setMode("add"), [setMode], {
    preventDefault: true,
  });
  useHotkeys("meta+s", onSave, {
    preventDefault: true,
  });
}
