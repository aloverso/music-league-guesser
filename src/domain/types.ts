export type Song = {
  title: string;
  artist: string;
  comment: string;
};

export type Guess = {
  submitterName: string;
  timestamp: string;
  guesses: Record<string, string>
}