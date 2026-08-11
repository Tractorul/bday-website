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
  show_message_on_birthday_only: boolean;

  is_primary: boolean;
};