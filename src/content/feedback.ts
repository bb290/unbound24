// The "Love it or hate it?" form on every lesson page. Each question's options match the
// select options in the Notion "Course feedback" database; "Other" opens a text box.

export type FeedbackQuestion = {
  id: "land" | "pace" | "better";
  // The Notion column; its free-text twin is `${column} (other)`.
  column: string;
  label: string;
  options: string[];
};

export const FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
  {
    id: "land",
    column: "How did it land?",
    label: "How did this lesson land?",
    options: ["Loved it", "Liked it", "It was okay", "Not for me"],
  },
  {
    id: "pace",
    column: "Pace",
    label: "How was the pace?",
    options: ["Too fast", "Just right", "Too slow"],
  },
  {
    id: "better",
    column: "What would make it better?",
    label: "What would make it better?",
    options: ["More examples from my trade", "A shorter video", "More step-by-step help", "It's great as is"],
  },
];

export const OTHER = "Other";
