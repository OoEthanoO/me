import { robotics } from "@/data/robotics";

/**
 * Robotics sits below the project categories on /tech and borrows their
 * heading, but not their layout: the write-up runs beside a video rather than
 * above screenshots. The text carries the section, so it takes two thirds of
 * the width and the video takes the remaining third; both stack on narrow
 * screens. Photographs follow underneath, spanning the full width.
 */
export default function RoboticsSection() {
  const { title, paragraphs, video, images } = robotics;

  return (
    <div className="mb-16 md:mb-20">
      <h2 className="font-display border-b-2 border-[var(--burgundy)] pb-3 text-[clamp(1.3rem,2.6vw,1.75rem)] text-[var(--burgundy)]">
        {title}
      </h2>

      <div
        className={`mt-8 grid items-start gap-8 md:gap-10 ${
          video ? "lg:grid-cols-[2fr_1fr]" : ""
        }`}
      >
        <div className={`space-y-4 ${video ? "" : "max-w-3xl"}`}>
          {paragraphs.map((para) => (
            <p
              key={para.slice(0, 32)}
              className="text-[1.05rem] leading-relaxed text-[var(--ink)] md:text-[1.15rem]"
            >
              {para}
            </p>
          ))}
        </div>

        {video && (
          <div className="border border-[var(--tan)]/35 bg-white p-1.5">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={video.src}
              poster={video.poster}
              controls
              playsInline
              preload="metadata"
              className="w-full"
            />
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.src}
              className="border border-[var(--tan)]/35 bg-white p-1.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt={image.alt} className="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
