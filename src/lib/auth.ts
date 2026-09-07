// Hardcoded admin credentials
export const ADMIN_EMAIL = "admin@hospital.com";
export const ADMIN_PASSWORD = "admin123";

export function isAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}
