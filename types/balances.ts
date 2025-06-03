import type { User } from "./users";

export interface Balance {
  id: string;
  slug: string;
  amount: number;
  user: User;
}