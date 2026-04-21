/** Пароль из .env (Vite). Пустое значение — вход в админку отключён. */
export function getConfiguredAdminPassword(): string | undefined {
  const p = import.meta.env.VITE_ADMIN_PASSWORD;
  if (typeof p !== "string") return undefined;
  const t = p.trim();
  return t.length > 0 ? t : undefined;
}

export function tryAdminLogin(password: string): boolean {
  const expected = getConfiguredAdminPassword();
  if (!expected) return false;
  return password === expected;
}
