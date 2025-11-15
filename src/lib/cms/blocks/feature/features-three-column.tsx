import * as React from "react";

export interface FeatureItem {
  /** Title of the feature card */
  name: string;
  /** Body text under the title */
  description: string;
  /** URL for the “Learn more” link */
  href: string;
}

export interface FeaturesThreeColumnProps {
  /** Small upper‐case label, e.g. “Deploy faster” */
  sectionLabel?: string;
  /** Main big heading, e.g. “Everything you need to deploy your app” */
  heading: string;
  /** Lead paragraph under the heading */
  description?: string;
  /** Array of cards to render */
  features: FeatureItem[];
}

export const FeaturesThreeColumn: React.FC<FeaturesThreeColumnProps> = ({
  sectionLabel,
  heading,
  description,
  features,
}) => (
  <div className="py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Intro copy */}
      <div className="mx-auto max-w-2xl lg:text-center">
        {sectionLabel && <h2 className="font-semibold text-pink-600">{sectionLabel}</h2>}
        <p className="mt-2 font-serif text-5xl text-gray-700 sm:text-6xl lg:text-7xl">
          {heading}
        </p>
        {description && <p className="mt-6 text-lg/8 text-gray-600">{description}</p>}
      </div>

      {/* Feature cards */}
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map(({ name, description, href }) => (
            <div key={name} className="flex flex-col">
              <dt className="flex items-center gap-x-3 font-semibold text-gray-700">
                {name}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-gray-600">
                <p className="flex-auto">{description}</p>
                <p className="mt-6">
                  <a href={href} className="text-pink-600 hover:text-pink-700">
                    Złóż zamówienie <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </div>
);
