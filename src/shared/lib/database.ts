// src/shared/lib/database.ts
//
// Сервис базы данных для "Читаем с Кьюрио".
// Построен поверх appSettings через storage.ts — не требует дополнительных пакетов.
// Хранит: пользователя, профиль ребёнка, все истории, прочитанные истории.

import { storage } from './storage';
import { Story, mockStories } from '../../entities/story/model/story';
import { User } from '../../entities/user/model/user';
import { ChildProfile } from '../../entities/child/model/child';

// ─── Ключи хранилища ──────────────────────────────────────────────────────────

const KEYS = {
  USER: 'db:user',
  CHILD: 'db:child',
  STORIES: 'db:stories',
  READ_STORIES: 'db:readStories',
  STORIES_INITIALIZED: 'db:storiesInit',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ─── Database Service ─────────────────────────────────────────────────────────

export const db = {

  // ── Пользователь ────────────────────────────────────────────────────────────

  /** Сохранить данные пользователя */
  saveUser(user: User): void {
    storage.set(KEYS.USER, JSON.stringify(user));
  },

  /** Получить текущего пользователя или null */
  getUser(): User | null {
    return parseJson<User | null>(storage.get(KEYS.USER), null);
  },

  /** Удалить данные пользователя */
  clearUser(): void {
    storage.remove(KEYS.USER);
  },

  /** Проверить, залогинен ли пользователь */
  hasUser(): boolean {
    return !!storage.get(KEYS.USER);
  },

  // ── Профиль ребёнка ──────────────────────────────────────────────────────────

  /** Сохранить профиль ребёнка */
  saveChild(profile: ChildProfile): void {
    storage.set(KEYS.CHILD, JSON.stringify(profile));
  },

  /** Получить профиль ребёнка или null */
  getChild(): ChildProfile | null {
    return parseJson<ChildProfile | null>(storage.get(KEYS.CHILD), null);
  },

  /** Удалить профиль ребёнка */
  clearChild(): void {
    storage.remove(KEYS.CHILD);
  },

  /** Проверить, есть ли профиль */
  hasChild(): boolean {
    return !!storage.get(KEYS.CHILD);
  },

  // ── Истории ──────────────────────────────────────────────────────────────────

  /**
   * Инициализировать хранилище историй при первом запуске.
   * Записывает mockStories, если БД ещё пустая.
   */
  initStories(): void {
    if (!storage.get(KEYS.STORIES_INITIALIZED)) {
      storage.set(KEYS.STORIES, JSON.stringify(mockStories));
      storage.set(KEYS.STORIES_INITIALIZED, 'true');
    }
  },

  /** Получить все истории */
  getAllStories(): Story[] {
    this.initStories();
    return parseJson<Story[]>(storage.get(KEYS.STORIES), mockStories);
  },

  /** Найти историю по id */
  getStoryById(id: string): Story | undefined {
    return this.getAllStories().find((s) => s.id === id);
  },

  /** Разблокировать историю (сохраняет в БД) */
  unlockStory(id: string): void {
    const stories = this.getAllStories();
    const story = stories.find((s) => s.id === id);
    if (story && story.isLocked) {
      story.isLocked = false;
      storage.set(KEYS.STORIES, JSON.stringify(stories));
    }
  },

  /**
   * Полностью обновить список историй.
   * Используй, если нужно добавить новые истории с сервера.
   */
  saveAllStories(stories: Story[]): void {
    storage.set(KEYS.STORIES, JSON.stringify(stories));
    storage.set(KEYS.STORIES_INITIALIZED, 'true');
  },

  /** Сбросить истории к моковым данным */
  resetStories(): void {
    storage.set(KEYS.STORIES, JSON.stringify(mockStories));
    storage.set(KEYS.STORIES_INITIALIZED, 'true');
  },

  // ── Прочитанные истории ───────────────────────────────────────────────────────

  /** Получить массив id прочитанных историй */
  getReadStories(): string[] {
    return parseJson<string[]>(storage.get(KEYS.READ_STORIES), []);
  },

  /** Отметить историю как прочитанную */
  markAsRead(storyId: string): void {
    const read = this.getReadStories();
    if (!read.includes(storyId)) {
      read.push(storyId);
      storage.set(KEYS.READ_STORIES, JSON.stringify(read));
    }
  },

  /** Проверить, прочитана ли история */
  isRead(storyId: string): boolean {
    return this.getReadStories().includes(storyId);
  },

  /** Снять отметку "прочитано" с истории */
  unmarkAsRead(storyId: string): void {
    const read = this.getReadStories().filter((id) => id !== storyId);
    storage.set(KEYS.READ_STORIES, JSON.stringify(read));
  },

  /** Очистить все прочитанные истории */
  clearReadStories(): void {
    storage.remove(KEYS.READ_STORIES);
  },

  // ── Утилиты ──────────────────────────────────────────────────────────────────

  /**
   * Полная очистка всей БД.
   * Используй при выходе из аккаунта или сбросе приложения.
   */
  clearAll(): void {
    storage.remove(KEYS.USER);
    storage.remove(KEYS.CHILD);
    storage.remove(KEYS.STORIES);
    storage.remove(KEYS.READ_STORIES);
    storage.remove(KEYS.STORIES_INITIALIZED);
  },
};
