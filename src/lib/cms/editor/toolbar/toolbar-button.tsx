import { motion } from "motion/react";
import { Button } from "~/components/ui/button";

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
      <Button size="sm" variant="ghost" className="rounded-full !px-3" onClick={onClick}>
        {children}
      </Button>
    </motion.div>
  );
}
