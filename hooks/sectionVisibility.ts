let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        } else {
          el.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.15 }
  );
  return observer;
}

export function observeSection(el: HTMLElement | null) {
  if (!el) return () => {};
  const io = getObserver();
  io.observe(el);
  return () => io.unobserve(el);
}
