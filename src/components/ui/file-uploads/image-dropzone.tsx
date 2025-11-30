import { blurUpVariants } from "@/lib/cms/blocks/shared/animations";
import { Asset } from "@/lib/cms/blocks/shared/assets/asset-schema";
import { useUploadFiles } from "@better-upload/client";
import { AnimatePresence, motion } from "motion/react";
import { AssetPreview } from "./image-preview";
import { UploadDropzoneProgress } from "./upload-dropzone-progress";

interface ImageDropzoneProps {
  value?: Array<Asset>;
  onChange?: (assets: Array<Asset>) => void;
  maxFiles?: number;
}

const CLOUDFLARE_R2_BASE_URL =
  "https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev";

export function ImageDropzone({
  value = [],
  onChange,
  maxFiles = 1,
}: ImageDropzoneProps) {
  const { control } = useUploadFiles({
    route: "images",
    onUploadComplete: (res) => {
      // 1. Extract IDs
      // Since we updated the API to use the UUIDv7 as the key directly,
      // we don't need to parse strings anymore. The key IS the ID.
      const newAssets: Array<Asset> = res.files.map((file) => ({
        id: file.objectInfo.key,
        url: `${CLOUDFLARE_R2_BASE_URL}/${file.objectInfo.key}`,
        alt: "",
        blurhash: null,
        width: 0,
        height: 0,
      }));

      // 2. Update Form with IDs (Append to existing)
      onChange?.(newAssets);
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
      <AnimatePresence>
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
      </AnimatePresence>

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
