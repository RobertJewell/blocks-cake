import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils/cn";
import { AssetImage } from "../shared/assets/asset-image";
import { HydratedBlockProps } from "../shared/assets/asset-type-helpers";
import { simpleCardConfig } from "./simple-card-config";

export type SimpleCardProps = HydratedBlockProps<typeof simpleCardConfig>;

const reverse = false;

export const SimpleCard = ({
  heading,
  subheading,
  description,
  ctaText,
  ctaHref,
  image,
  maxWidth,
}: SimpleCardProps) => {
  return (
    <div className="my-4 overflow-hidden py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none",
            Boolean(image?.[0]) && "lg:grid-cols-2",
          )}
        >
          <div
            className={cn(
              "lg:pt-4",
              reverse ? "lg:mr-none lg:ml-auto" : "lg:ml-none lg:mr-auto",
              !Boolean(image?.[0]) && "mx-auto!",
            )}
          >
            <div className={cn("lg:max-w-lg")} style={{ maxWidth }}>
              {subheading && (
                <h2 className="font-semibold text-pink-600">{subheading}</h2>
              )}
              {heading && (
                <p className="mt-2 font-serif text-5xl text-pretty text-gray-700 sm:text-6xl">
                  {heading}
                </p>
              )}
              {description && (
                <p className="mt-6 leading-loose text-gray-600">
                  {description}
                </p>
              )}
              {ctaText && ctaHref && (
                <div className="mt-4">
                  <Button
                    className="bg-pink-600 px-4 text-white hover:bg-pink-700"
                    asChild
                  >
                    <a href={ctaHref}>{ctaText}</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
          {image?.[0] && (
            <div
              className={cn(
                "flex items-start justify-end",
                reverse ? "lg:order-first" : "",
              )}
            >
              <div className="aspect-square relative w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-400/10">
                <AssetImage
                  asset={image[0]}
                  className="h-full w-full absolute inset-0 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
