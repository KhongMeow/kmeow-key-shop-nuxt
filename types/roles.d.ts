import type { RolePermission } from "./role-permissions";

export interface Role {
  id: number;
  name: string;
  slug: string;
  rolePermissions: RolePermission[];
}