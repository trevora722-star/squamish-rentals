interface PageBannerProps {
  /** Public path to the banner image, e.g. /images/kawasaki-atv.webp */
  imageSrc: string;
  /** Small uppercase tagline above the headline (optional). */
  eyebrow?: string;
  /** Main headline rendered very large. */
  headline: string;
  /** Sub-headline rendered below the headline (optional). */
  subhead?: string;
  /**
   * Banner height. "md" = 55vh, "lg" = 65vh, "xl" = 78vh. Defaults to "lg".
   */
  height?: "md" | "lg" | "xl";
  /** Where to anchor the image inside the frame. Defaults to "center". */
  position?: "top" | "center" | "bottom";
  /** Override the dark overlay opacity (0–100). Defaults to 50. */
  overlayOpacity?: number;
}

/**
 * A full-width banner hero with a parallax-style background image and a large
 * headline overlaid. The page scrolls over the image because we use
 * `background-attachment: fixed`, which gives a parallax effect on desktop
 * and falls back to a static background on mobile (iOS doesn't support fixed
 * backgrounds — we accept the graceful fallback).
 */
export function PageBanner({
  imageSrc,
  eyebrow,
  headline,
  subhead,
  height = "lg",
  position = "center",
  overlayOpacity = 50,
}: PageBannerProps) {
  const heightClass =
    height === "xl"
      ? "min-h-[78vh]"
      : height === "md"
        ? "min-h-[55vh]"
        : "min-h-[65vh]";

  const positionClass =
    position === "top"
      ? "bg-top"
      : position === "bottom"
        ? "bg-bottom"
        : "bg-center";

  // We chain two background layers: a dark gradient overlay on top, the photo
  // beneath. The image uses `background-attachment: fixed` for the parallax
  // effect.
  const bgStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(7, 36, 33, ${overlayOpacity / 100}), rgba(15, 23, 42, ${(overlayOpacity + 10) / 100})), url('${imageSrc}')`,
  };

  return (
    <section
      aria-label={headline}
      className={`relative ${heightClass} ${positionClass} flex items-center bg-cover bg-fixed bg-no-repeat`}
      style={bgStyle}
    >
      <div className="container-x mx-auto max-w-5xl py-20 text-primary-foreground">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/85">
            {eyebrow}
          </p>
        )}
        <h1
          className="mt-4 text-primary-foreground font-display font-semibold leading-[1.02]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}
        >
          {headline}
        </h1>
        {subhead && (
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
            {subhead}
          </p>
        )}
      </div>
    </section>
  );
}
