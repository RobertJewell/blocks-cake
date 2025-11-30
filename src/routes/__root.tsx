/// <reference types="vite/client" />
import { DefaultCatchBoundary } from "@/components/default-catch-boundary";
import { NotFound } from "@/components/not-found";
import { ThemeProvider } from "@/components/theme";
import { useEditorStore } from "@/lib/cms/stores/editor-store";
import { cn } from "@/lib/utils";
import { seo } from "@/lib/utils/seo";
import appCss from "@/styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router";
import * as React from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  editorStore: typeof useEditorStore;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "visual cms",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <Outlet />
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith("/app");
  const mode = useEditorStore((s) => s.mode);

  return (
    <html
      className={cn(
        "bg-white",
        isAppRoute && mode !== "view" ? "overflow-hidden " : "",
      )}
    >
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {/*<TanStackRouterDevtools position="bottom-right" />*/}
        {/*<ReactQueryDevtools buttonPosition="bottom-left" />*/}
        <Scripts />
      </body>
    </html>
  );
}
