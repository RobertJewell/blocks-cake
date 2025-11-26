import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useEditShortcut() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+E (Mac) or Ctrl+E (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "e") {
        event.preventDefault(); // Prevent default browser behavior (like search in some browsers)

        const currentPath = location.pathname;
        let targetPath = "";

        if (currentPath === "/") {
          // Explicitly handle index route
          targetPath = "/app/edit/index";
        } else {
          // Prepend /app/edit to the current path
          // Ensure we don't double slashes if the path doesn't start with one (though pathname usually does)
          targetPath = `/app/edit${currentPath.startsWith("/") ? currentPath : "/" + currentPath}`;
        }

        navigate({ to: targetPath });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location.pathname]);
}
