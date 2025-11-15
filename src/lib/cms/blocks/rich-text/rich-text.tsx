import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { createElement } from "react";

export const typographyMap: Record<string, string> = {
  h1: "scroll-m-20 [&:not(:first-child)]:mt-6 pb-4 text-5xl font-serif tracking-tight lg:text-6xl",
  h2: "scroll-m-20 [&:not(:first-child)]:mt-6 text-4xl font-serif tracking-tight ",
  h3: "scroll-m-20 [&:not(:first-child)]:mt-4 text-2xl font-semiboldtracking-tight",
  h4: "scroll-m-20 [&:not(:first-child)]:mt-4 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-2 [&:empty::before]:content-[''] [&:empty::before]:inline-block",
  blockquote: "mt-6 border-l-2 pl-6 italic text-muted-foreground",
  a: "!undeline",
  ul: "my-6 ml-6 list-disc [&>li]:mt-2",
  ol: "my-6 ml-6 list-decimal [&>li]:mt-2",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
};

function renderWithClass(tag: string, children: DOMNode[], extraClass?: string) {
  const className = typographyMap[tag] ?? "";
  const merged = extraClass ? `${className} ${extraClass}` : className;
  return createElement(
    tag === "lead" ? "p" : tag,
    { className: merged },
    domToReact(children),
  );
}

export function RichTextBlock({ content }: { content: string }) {
  return (
    <div className="mx-auto max-w-3xl p-4 py-12 text-gray-700">
      {parse(content, {
        replace: (domNode) => {
          if (domNode instanceof Element) {
            const { name, children } = domNode;

            if (name in typographyMap) {
              return renderWithClass(name, children as DOMNode[]);
            }
          }
        },
      })}
    </div>
  );
}
