import type { Permission } from "./permissions";
import type { Role } from "./roles";

export interface RolePermission {
  id: number;
  slug: string;
  role: Role;
  permission: Permission;
}