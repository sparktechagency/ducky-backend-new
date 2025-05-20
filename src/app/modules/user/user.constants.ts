export const USER_ROLE = {
  SUPER_ADMIN: 'super_admin',
  SUB_ADMIN: 'sub_admin',
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const gender = ['Male', 'Female', 'Others'] as const;
export const Role = Object.values(USER_ROLE);
 