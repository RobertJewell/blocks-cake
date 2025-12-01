import { Asset } from "@/cms/blocks/shared/assets/asset-schema";
import { AssetImage } from "@/cms/blocks/shared/assets/image";
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

  console.log(asset);

  if (isLoading) {
    return (
      <div className="aspect-square bg-gray-50 animate-pulse rounded-md flex items-center justify-center border border-gray-100">
        <span className="text-[10px] text-gray-400 font-medium">
          Loading...
        </span>
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
    <div className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-200">
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
