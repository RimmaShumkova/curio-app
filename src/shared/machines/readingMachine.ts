// src/shared/machines/readingMachine.ts
import { setup, assign } from 'xstate';
import { Story, Episode } from '../../entities/story/model/story';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReadingContext {
  story: Story | null;
  currentEpisodeIndex: number;
}

type ReadingEvent =
  | { type: 'START'; story: Story }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'FINISH' }
  | { type: 'RESET' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getMaxIndex = (story: Story | null): number =>
  Math.max((story?.episodes.length || 1) - 1, 0);

// ─── Machine ─────────────────────────────────────────────────────────────────

const readingMachineConfig = setup({
  types: {
    context: {} as ReadingContext,
    events: {} as ReadingEvent,
  },

  actions: {
    assignStory: assign({
      story: ({ event }) => (event as Extract<ReadingEvent, { type: 'START' }>).story,
      currentEpisodeIndex: 0,
    }),

    goToNext: assign({
      currentEpisodeIndex: ({ context }) =>
        Math.min(context.currentEpisodeIndex + 1, getMaxIndex(context.story)),
    }),

    goToPrev: assign({
      currentEpisodeIndex: ({ context }) =>
        Math.max(context.currentEpisodeIndex - 1, 0),
    }),

    reset: assign({
      story: null,
      currentEpisodeIndex: 0,
    }),
  },

  guards: {
    /**
     * Переход NEXT разрешён, только если текущий эпизод не последний
     */
    canGoNext: ({ context }) =>
      context.currentEpisodeIndex < getMaxIndex(context.story),

    /**
     * Переход PREV разрешён, только если текущий эпизод не первый
     */
    canGoPrev: ({ context }) => context.currentEpisodeIndex > 0,

    /**
     * Можно завершить только находясь на последнем эпизоде
     */
    isLastEpisode: ({ context }) =>
      context.currentEpisodeIndex === getMaxIndex(context.story),
  },
});

export const readingMachine = readingMachineConfig.createMachine({
  id: 'reading',
  initial: 'idle',

  context: {
    story: null,
    currentEpisodeIndex: 0,
  },

  states: {
    /**
     * idle — ожидание начала чтения
     */
    idle: {
      on: {
        START: {
          target: 'reading',
          actions: 'assignStory',
        },
      },
    },

    /**
     * reading — активный процесс чтения
     * Навигация между эпизодами, завершение истории
     */
    reading: {
      on: {
        NEXT: {
          guard: 'canGoNext',
          actions: 'goToNext',
        },
        PREV: {
          guard: 'canGoPrev',
          actions: 'goToPrev',
        },
        FINISH: {
          guard: 'isLastEpisode',
          target: 'finished',
        },
        // Позволяем принудительно завершить (например, кнопка "Домой")
        RESET: {
          target: 'idle',
          actions: 'reset',
        },
      },
    },

    /**
     * finished — история прочитана до конца
     */
    finished: {
      on: {
        RESET: {
          target: 'idle',
          actions: 'reset',
        },
        // Перечитать ту же историю
        START: {
          target: 'reading',
          actions: 'assignStory',
        },
      },
    },
  },
});

// ─── Selectors (computed helpers для компонентов) ─────────────────────────────

export function selectCurrentEpisode(context: ReadingContext): Episode | null {
  if (!context.story) return null;
  return context.story.episodes[context.currentEpisodeIndex] ?? null;
}

export function selectTotalEpisodes(context: ReadingContext): number {
  return context.story?.episodes.length ?? 0;
}

export function selectIsLastEpisode(context: ReadingContext): boolean {
  return context.currentEpisodeIndex === getMaxIndex(context.story);
}

export function selectCanGoPrev(context: ReadingContext): boolean {
  return context.currentEpisodeIndex > 0;
}