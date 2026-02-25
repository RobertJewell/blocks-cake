import { useSidebar } from "@/cms/ui/sidebar";

export type NavigationWrapperProps<P extends { isSidebarOpen?: boolean }> = {
  NavigationComponent: React.ComponentType<P>;
  props: Omit<P, "isSidebarOpen">;
};

export function NavigationWrapper<P extends { isSidebarOpen?: boolean }>({
  NavigationComponent,
  props,
}: NavigationWrapperProps<P>) {
  const { open } = useSidebar();

  return <NavigationComponent {...(props as P)} isSidebarOpen={open} />;
}
