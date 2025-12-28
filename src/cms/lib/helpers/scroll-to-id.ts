export function scrollToId(
  id?: string,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" },
) {
  if (!id) return;

  requestAnimationFrame(() => {
    // Remember to use your prefix logic if you added it in the previous step
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        inline: "nearest",
        ...options, // Allow overriding behavior and block alignment
      });
    }
  });
}
