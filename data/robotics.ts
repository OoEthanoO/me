export interface RoboticsImage {
  src: string;
  alt: string;
}

export interface Robotics {
  /** Section heading on /tech, printed like the project category headings. */
  title: string;
  /** Write-up, one entry per paragraph. */
  paragraphs: string[];
  /**
   * Sits to the right of the write-up. Drop the file in /public and point
   * `src` at it; `poster` is the still shown before playback. While this is
   * undefined the write-up runs full width instead of leaving a gap.
   */
  video?: { src: string; poster?: string };
  /** Printed in a grid below the write-up and the video. */
  images: RoboticsImage[];
}

/**
 * Text as supplied for the site. The second paragraph opens on a date given in
 * Chinese in the source document (2026 年 6 月), translated here.
 */
export const robotics: Robotics = {
  title: "Robotics",
  paragraphs: [
    "I joined my high school’s robotics team in grade 9 as a programmer responsible for solving complex technical challenges, developing autonomous routines that consistently scored points in competition, contributing to our 1st Place Inspire Award in Dec 2025, and mentoring junior members in advanced programming techniques.",
    "In June 2026, my friends and I created a new robotics team because the school team was too restrictive for our goals, where administrative tasks took way too long and business decisions were rigid. It involved recruiting members, purchasing parts, creating budgets, finding sponsors, organizing workspaces, and establishing team hierarchies. It is meaningful to me because it is a collaboration that started partly because of me. There is no greater organization upholding the team and it depends entirely on us to keep the structure.",
  ],
  // Remuxed from the supplied .mov: the stream was already H.264/AAC, so this
  // is a container change rather than a re-encode. Chrome does not reliably
  // play QuickTime containers, which is the reason for the move.
  video: { src: "/robotics.mp4", poster: "/robotics-poster.jpg" },
  images: [
    {
      src: "/robotics-robot.jpg",
      alt: "The FTC robot on the practice field: Limelight vision camera above a REV Control Hub, with the intake and drivetrain exposed.",
    },
    {
      src: "/robotics-provincials-match.jpg",
      alt: "Rams Robotics 16488 in a qualification match at the FIRST Tech Challenge Ontario Provincial Championship.",
    },
    {
      src: "/robotics-awards.jpg",
      alt: "Provincials graphic: team photographs above the FIRST Tech Challenge Inspire Award for 16488 Rams Robotics.",
    },
  ],
};
