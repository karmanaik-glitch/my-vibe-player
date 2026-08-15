export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
};

export type Vibe = {
  id: string;
  label: string;
  src: string;
};

export type Database = {
  tracks: Track[];
  vibes: Vibe[];
};
