const SESSION_KEY = "cveti_admin_auth" as const;

export function isAdminAuthed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAdminAuthed(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminAuthed(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
