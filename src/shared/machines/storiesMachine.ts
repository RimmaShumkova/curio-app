// src/shared/machines/storiesMachine.ts
//
// appSettings (используемый в db) — синхронное API.
// Поэтому загрузку делаем синхронно через entry + always,
// без fromPromise (который добавляет лишнюю асинхронность).

import { setup, assign } from 'xstate';
import { Story } from '../../entities/story/model/story';
import { db } from '../lib/database';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StoriesContext {
  stories: Story[];
  readStoryIds: string[];
  error: string | null;
}

type StoriesEvent =
  | { type: 'LOAD' }
  | { type: 'RELOAD' }
  | { type: 'MARK_READ'; storyId: string }
  | { type: 'UNLOCK'; storyId: string };

// ─── Machine ─────────────────────────────────────────────────────────────────

const storiesMachineConfig = setup({
  types: {
    context: {} as StoriesContext,
    events: {} as StoriesEvent,
  },

  actions: {
    /**
     * Синхронно читаем из db и кладём в context.
     * Вызывается как entry-действие состояния loading.
     */
    loadFromDb: assign({
      stories: () => {
        db.initStories();
        return db.getAllStories();
      },
      readStoryIds: () => db.getReadStories(),
      error: null,
    }),

    markStoryRead: assign({
      readStoryIds: ({ context, event }) => {
        const id = (event as Extract<StoriesEvent, { type: 'MARK_READ' }>).storyId;
        db.markAsRead(id);
        return context.readStoryIds.includes(id)
          ? context.readStoryIds
          : [...context.readStoryIds, id];
      },
    }),

    unlockStory: assign({
      stories: ({ context, event }) => {
        const id = (event as Extract<StoriesEvent, { type: 'UNLOCK' }>).storyId;
        db.unlockStory(id);
        return context.stories.map((s) =>
          s.id === id ? { ...s, isLocked: false } : s
        );
      },
    }),
  },
});

export const storiesMachine = storiesMachineConfig.createMachine({
  id: 'stories',
  initial: 'idle',

  context: {
    stories: [],
    readStoryIds: [],
    error: null,
  },

  states: {
    /**
     * idle — ждём LOAD
     */
    idle: {
      on: {
        LOAD: 'loading',
      },
    },

    /**
     * loading — синхронно загружаем через entry, сразу переходим в loaded
     */
    loading: {
      entry: 'loadFromDb',
      always: 'loaded',
    },

    /**
     * loaded — истории в context, доступны операции
     */
    loaded: {
      on: {
        RELOAD: 'loading',
        MARK_READ: { actions: 'markStoryRead' },
        UNLOCK:    { actions: 'unlockStory' },
      },
    },
  },
});