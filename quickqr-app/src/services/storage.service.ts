import type { QRData } from '../types';
import { MAX_HISTORY_FREE } from '../utils/constants';

const STORAGE_KEY = 'quickqr_history';

export function getHistory(): QRData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: QRData): QRData[] {
  const history = getHistory();
  const exists = history.findIndex(h => h.id === item.id);
  if (exists >= 0) history.splice(exists, 1);
  history.unshift(item);
  const trimmed = history.slice(0, MAX_HISTORY_FREE);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function removeFromHistory(id: string): QRData[] {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
