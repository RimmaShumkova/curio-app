// src/shared/api/client.ts
//
// Все запросы к серверу.
// Используем @nativescript/core Http вместо fetch —
// fetch в NativeScript требует AbortController, которого нет в среде выполнения.
//
// 10.0.2.2 — это localhost с Android-эмулятора.
// Если тестируешь на реальном устройстве — замени на IP своего компьютера (например 192.168.1.x)

import { Http } from '@nativescript/core';

const BASE_URL = 'http://192.168.1.85:3000';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: object,
  googleId?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(googleId ? { 'x-google-id': googleId } : {}),
  };

  const response = await Http.request({
    url: `${BASE_URL}${path}`,
    method,
    headers,
    content: body ? JSON.stringify(body) : undefined,
  });

  const data = response.content?.toJSON();

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(data?.error || `Ошибка сервера (${response.statusCode})`);
  }

  return data as T;
}

// ═════════════════════════════════════════════════════════════════════════════
// Авторизация
// ═════════════════════════════════════════════════════════════════════════════

export async function loginWithGoogleApi(token: string) {
  return request<{ user: any }>('/auth/google', 'POST', { token });
}

// ═════════════════════════════════════════════════════════════════════════════
// Профиль ребёнка
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchChildApi(googleId: string) {
  return request<{ child: any }>('/child', 'GET', undefined, googleId);
}

export async function saveChildApi(
  googleId: string,
  profile: { name: string; gender: string }
) {
  return request<{ child: any }>('/child', 'POST', profile, googleId);
}

// ═════════════════════════════════════════════════════════════════════════════
// Прогресс чтения
// ═════════════════════════════════════════════════════════════════════════════

export async function fetchAllProgressApi(googleId: string) {
  return request<{ progress: any[] }>('/progress', 'GET', undefined, googleId);
}

export async function fetchStoryProgressApi(googleId: string, storyId: string) {
  return request<{ progress: any }>(`/progress/${storyId}`, 'GET', undefined, googleId);
}

export async function saveProgressApi(
  googleId: string,
  storyId: string,
  data: { episodeIndex: number; isCompleted: boolean }
) {
  return request<{ progress: any }>(`/progress/${storyId}`, 'POST', data, googleId);
}