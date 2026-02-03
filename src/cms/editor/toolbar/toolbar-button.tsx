import { Button } from "@/cms/ui/button";
import { motion } from "motion/react";

export function ToolbarButton({
  id,
  children,
  onClick,
}: {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.div layoutId={id} layout="position">
      <Button
        variant="ghost"
        className="rounded-full hover:bg-transparent text-muted-foreground hover:text-foreground  px-3!"
        onClick={onClick}
      >
        {children}
      </Button>
    </motion.div>
  );
}
