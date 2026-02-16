import { blurUpVariants } from "@/cms/blocks/shared/animations";
import { Asset } from "@/cms/blocks/shared/assets/asset-schema";
import { queueImageOptimisation } from "@/cms/lib/data-ops/assets/queue-image-optimisation";
import { useUploadFiles } from "@better-upload/client";
import { motion } from "motion/react";
import { AssetPreview } from "./image-preview";
import { UploadDropzoneProgress } from "./upload-dropzone-progress";

interface ImageDropzoneProps {
  value?: Array<Asset>;
  onChange?: (assets: Array<Asset>) => void;
  maxFiles?: number;
}

export function ImageDropzone({
  value = [],
  onChange,
  maxFiles = 1,
}: ImageDropzoneProps) {
  const { control } = useUploadFiles({
    api: "/api/assets/upload",
    route: "images",
    onUploadComplete: async (res) => {
      // Extract IDs
      // Since we updated the API to use the UUIDv7 as the key directly,
      // we don't need to parse strings anymore. The key IS the ID.
      const newAssets = res.files.map(
        (file) =>
          ({
            id: file.objectInfo.key,
            filename: file.raw.name,
            mimeType: file.type,
            altText: null,
            variants: {
              original: {
                key: file.objectInfo.key,
                width: 0,
                height: 0,
                size: file.size,
              },
            },
            blurhash: null,
            isOptimized: false,
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }) satisfies Asset,
      );

      // Update Form with IDs (Append to existing)
      onChange?.(newAssets);

      try {
        const keys = newAssets.map((asset) => asset.id);
        await queueImageOptimisation({ data: { keys } });
        console.log("All assets queued successfully");
      } catch (err) {
        console.error("Failed to queue optimizations:", err);
      }
    },
    onUploadFail: (err) => {
      console.error("Upload failed", err);
      // Optional: Add toast error here
    },
  });

  const hasImages = value && value.length > 0;
  const isFull = value.length >= maxFiles;

  return (
    <div className="space-y-4">
      {/* previews */}

      {hasImages && (
        <motion.div
          variants={blurUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {value.map((asset, index) => (
            <AssetPreview
              key={`${asset.id}-${index}`}
              assetId={asset.id}
              onRemove={() => {
                control.reset();
                const newValue = value.filter((_, i) => i !== index);
                onChange?.(newValue);
              }}
            />
          ))}
        </motion.div>
      )}

      {/* dropzone */}
      {!isFull && (
        <div className={hasImages ? "mt-4" : ""}>
          <UploadDropzoneProgress
            control={control}
            accept="image/*"
            description={{
              maxFiles: maxFiles - value.length, // Show remaining slots
              maxFileSize: "5MB",
              fileTypes: "JPEG, PNG, GIF",
            }}
          />
        </div>
      )}
    </div>
  );
}
