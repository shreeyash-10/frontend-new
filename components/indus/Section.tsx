import { CSSProperties, forwardRef, ReactNode } from "react";
import { observeSection } from "@/hooks/sectionVisibility";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  background?: "default" | "alt" | "surface";
  padding?: "none" | "sm" | "lg";
  style?: CSSProperties;
};

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, children, className, background = "default", padding = "lg", style }, ref) => {
    const paddingClass =
      padding === "none" ? "py-0" : padding === "sm" ? "py-8 md:py-10" : "py-12 md:py-14 lg:py-16";

    return (
      <section
        ref={(node) => {
          if (typeof ref === "function") ref(node as any);
          else if (ref) (ref as any).current = node;
          observeSection(node as HTMLElement | null);
        }}
        id={id}
        className={`relative w-full ${className || ""}`}
        style={style}
      >
        <div className={`mx-auto flex w-full max-w-[1200px] flex-col gap-6 md:gap-8 px-4 sm:px-6 md:px-8 ${paddingClass}`}>
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = "Section";

export default Section;
