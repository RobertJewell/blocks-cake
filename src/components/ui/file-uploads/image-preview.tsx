import { AssetImage } from "@/cms/blocks/shared/assets/asset-image";
import { Asset } from "@/cms/blocks/shared/assets/asset-schema";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "../button";

interface AssetPreviewProps {
  assetId: string;
  onRemove: () => void;
}

export function AssetPreview({ assetId, onRemove }: AssetPreviewProps) {
  // Fetch asset details by ID
  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      const res = await fetch(`/api/assets/${assetId}`);
      if (!res.ok) throw new Error("Failed to load asset");
      return res.json() as Promise<Asset>;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="aspect-square bg-muted  rounded-md flex items-center justify-center border border-gray-100">
        <span className="text-[10px] text-gray-400 font-medium">
          Loading...
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 text-foreground animate-pulse p-1 rounded transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  // Handle broken IDs or deleted assets
  if (!asset) {
    return (
      <div className="aspect-square bg-red-50 rounded-md flex items-center justify-center border border-red-100 relative group">
        <span className="text-[10px] text-red-400">Not Found</span>
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative group aspect-square bg-muted rounded-md overflow-hidden border border-border">
      <AssetImage
        asset={asset}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white truncate font-medium">
          {asset.filename}
        </p>
      </div>

      <Button
        size={"icon"}
        type="button"
        onClick={onRemove}
        className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-1 right-1 dark"
      >
        <X size={14} />
      </Button>
    </div>
  );
}
