import { IconArrowRight } from "@tabler/icons-react";
import { HydratedBlockProps } from "../block-registry.types";
import { featuresThreeColumnConfig } from "./features-three-column-config";

export type FeaturesThreeColumnProps = HydratedBlockProps<
  typeof featuresThreeColumnConfig
>;

export const FeaturesThreeColumn: React.FC<FeaturesThreeColumnProps> = ({
  subheading,
  heading,
  description,
  features,
}) => (
  <div className="py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Intro copy */}
      <div className="mx-auto max-w-2xl lg:text-center">
        {subheading && (
          <h2 className="font-semibold text-pink-600">{subheading}</h2>
        )}
        <p className="mt-2 font-serif text-5xl text-gray-700 sm:text-6xl lg:text-7xl">
          {heading}
        </p>
        {description && (
          <p className="mt-6 text-lg/8 text-gray-600">{description}</p>
        )}
      </div>

      {/* Feature cards */}
      {features?.length > 0 && (
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map(({ heading, description, ctaHref, ctaText }) => (
              <div key={heading + description} className="flex flex-col">
                <dt className="flex items-center gap-x-3 font-semibold text-gray-700">
                  {heading}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-gray-600">
                  <p className="flex-auto">{description}</p>
                  {ctaHref && ctaText && (
                    <p className="mt-6">
                      <a
                        href={ctaHref}
                        className="text-accent-foreground flex gap-2 items-center hover:text-accent-foreground"
                      >
                        {ctaText}
                        <span aria-hidden="true">
                          <IconArrowRight className="size-4" />
                        </span>
                      </a>
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  </div>
);
