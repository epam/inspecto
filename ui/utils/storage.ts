const storageKey = "ketcher:inspecto:";

export function storeObject(obj: Record<string, boolean>, key: string): void {
  localStorage.setItem(storageKey + key, JSON.stringify(obj));
}
export function storeString(str: string, key: string): void {
  localStorage.setItem(storageKey + key, str);
}
export function getString(key: string): string {
  return localStorage.getItem(storageKey + key) ?? "";
}
export function getObject(key: string): Record<string, boolean> {
  try {
    const obj = localStorage.getItem(storageKey + key);
    return obj !== null ? JSON.parse(obj) : {};
  } catch (e) {
    return {};
  }
}
