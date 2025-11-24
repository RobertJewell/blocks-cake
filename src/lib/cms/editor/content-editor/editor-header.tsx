import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
};

export function EditorHeader({ title, subtitle, onBack, actions }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 p-4 border-b bg-background/80 backdrop-blur-sm z-10 min-h-[73px]">
      <div className="flex items-center gap-2 overflow-hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="overflow-hidden">
          <h3 className="text-sm font-semibold capitalize leading-none truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground font-mono mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}
