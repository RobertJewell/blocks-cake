import React from "react";
import { Asset, ImageVariantSize } from "./asset-schema";

interface AssetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asset: Asset;
  preferredSize?: ImageVariantSize;
  className?: string;
}

export const AssetImage: React.FC<AssetImageProps> = ({
  asset,
  preferredSize = "original",
  alt,
  className,
  style,
  ...props
}) => {
  if (!asset.variants) return null;
  // if (!process.env.CLOUDFLARE_R2_URL) return null;
  const variant = asset.variants[preferredSize] ?? asset.variants.original;

  if (!variant) return null;
  const src = `${"https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev"}/${variant.key}`;

  return (
    <img
      src={src}
      alt={alt || asset.altText || ""}
      // width={variant.width}
      // height={variant.height}
      className={className}
      style={{
        // prevent layout shift before image loads
        // aspectRatio: `${variant.width} / ${variant.height}`,
        ...style,
      }}
      {...props}
    />
  );
};
