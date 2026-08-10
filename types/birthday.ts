export type Birthday = {
  id: string;
  slug: string;
  name: string;
  birthday_date: string;
  birthday_time: string;
  timezone: string;
  title: string | null;
  message: string | null;
  theme: string | null;
  language: "en" | "ro";
  enable_confetti: boolean;
  enable_music: boolean;
  is_primary: boolean;
};
