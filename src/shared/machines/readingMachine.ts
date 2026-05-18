// src/shared/machines/readingMachine.ts
import { setup, assign } from 'xstate';
import { Story, Episode } from '../../entities/story/model/story';

interface ReadingContext {
  story: Story | null;
  currentEpisodeIndex: number;
}

type ReadingEvent =
  | { type: 'START'; story: Story; savedEpisodeIndex?: number }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'FINISH' }
  | { type: 'RESET' };

const getMaxIndex = (story: Story | null): number =>
  Math.max((story?.episodes.length || 1) - 1, 0);

const readingMachineConfig = setup({
  types: {
    context: {} as ReadingContext,
    events: {} as ReadingEvent,
  },

  actions: {
    assignStory: assign({
      story: ({ event }) =>
        (event as Extract<ReadingEvent, { type: 'START' }>).story,
      // Если есть сохранённый прогресс с сервера — начинаем с него
      currentEpisodeIndex: ({ event }) => {
        const e = event as Extract<ReadingEvent, { type: 'START' }>;
        return e.savedEpisodeIndex ?? 0;
      },
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
    canGoNext: ({ context }) =>
      context.currentEpisodeIndex < getMaxIndex(context.story),

    canGoPrev: ({ context }) =>
      context.currentEpisodeIndex > 0,

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
    idle: {
      on: {
        START: { target: 'reading', actions: 'assignStory' },
      },
    },

    reading: {
      on: {
        NEXT:   { guard: 'canGoNext',    actions: 'goToNext' },
        PREV:   { guard: 'canGoPrev',    actions: 'goToPrev' },
        FINISH: { guard: 'isLastEpisode', target: 'finished' },
        RESET:  { target: 'idle',        actions: 'reset' },
      },
    },

    finished: {
      on: {
        RESET: { target: 'idle',    actions: 'reset' },
        START: { target: 'reading', actions: 'assignStory' },
      },
    },
  },
});

// ─── Selectors ────────────────────────────────────────────────────────────────

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