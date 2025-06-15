import type { Balance } from "./balances";
import type { Role } from "./roles";

export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  role: Role;
  balance: Balance;
}