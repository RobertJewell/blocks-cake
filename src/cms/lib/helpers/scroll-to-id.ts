export function scrollToId(
  id?: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "center" },
) {
  if (!id) return;

  requestAnimationFrame(() => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        inline: "center",
        ...options, // Allow overriding behavior and block alignment
      });
    }
  });
}
