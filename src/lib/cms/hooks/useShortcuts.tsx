import { useLocation, useNavigate } from "@tanstack/react-router";
import { useHotkeys } from "react-hotkeys-hook";
import { useEditorStore } from "../stores/editor-store";

export function useSiteShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  useHotkeys(
    "alt+e",
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
  const navigate = useNavigate();
  const location = useLocation();
  const setMode = useEditorStore((s) => s.setMode);

  // Mode switching
  useHotkeys("alt+1", () => setMode("view"), [setMode], {
    preventDefault: true,
  });
  useHotkeys("alt+2", () => setMode("edit"), [setMode], {
    preventDefault: true,
  });
  useHotkeys("alt+3", () => setMode("add"), [setMode], {
    preventDefault: true,
  });

  // Save
  useHotkeys("alt+s", onSave, {
    preventDefault: true,
  });

  // Exit Editor (Go to View/Public Route)
  useHotkeys(
    "shift+alt+e",
    () => {
      const currentPath = location.pathname;
      if (currentPath === "/app/edit/index") {
        navigate({ to: "/" });
        return;
      }
      // Remove the /app/edit prefix
      const targetPath = currentPath.replace("/app/edit", "");
      navigate({ to: targetPath || "/" });
    },
    [location.pathname],
    { preventDefault: true },
  );
}
