import { setup, assign } from "xstate";
import type { Story, Episode } from "../../entities/story/model/story";

interface ReadingContext {
  story: Story | null;
  currentEpisodeIndex: number;
  totalEpisodes: number;
}

export const readingMachine = setup({
  types: {
    context: {} as ReadingContext,
    events: {} as 
      | { type: "OPEN_STORY"; story: Story }
      | { type: "NEXT_EPISODE" }
      | { type: "PREV_EPISODE" }
      | { type: "FINISH" }
      | { type: "RESTART" }
      | { type: "CLOSE" }
  },
  actions: {
    setStory: assign({
      story: ({ event }) => (event as any).story,
      currentEpisodeIndex: 0,
      totalEpisodes: ({ event }) => (event as any).story.episodes.length
    }),
    nextEpisode: assign({
      currentEpisodeIndex: ({ context }) => 
        Math.min(context.currentEpisodeIndex + 1, context.totalEpisodes - 1)
    }),
    prevEpisode: assign({
      currentEpisodeIndex: ({ context }) => 
        Math.max(context.currentEpisodeIndex - 1, 0)
    }),
    resetReading: assign({
      currentEpisodeIndex: 0
    }),
    clearStory: assign({
      story: null,
      currentEpisodeIndex: 0,
      totalEpisodes: 0
    })
  },
  guards: {
    hasNextEpisode: ({ context }) => context.currentEpisodeIndex < context.totalEpisodes - 1,
    hasPrevEpisode: ({ context }) => context.currentEpisodeIndex > 0,
    hasStory: ({ context }) => context.story !== null
  }
}).createMachine({
  id: "reading",
  initial: "idle",
  context: {
    story: null,
    currentEpisodeIndex: 0,
    totalEpisodes: 0
  },
  states: {
    idle: {
      on: { OPEN_STORY: "reading" }
    },
    reading: {
      on: {
        NEXT_EPISODE: {
          actions: "nextEpisode",
          guard: "hasNextEpisode"
        },
        PREV_EPISODE: {
          actions: "prevEpisode",
          guard: "hasPrevEpisode"
        },
        FINISH: "finished",
        RESTART: {
          actions: "resetReading"
        },
        CLOSE: {
          target: "idle",
          actions: "clearStory"
        }
      }
    },
    finished: {
      on: {
        RESTART: {
          target: "reading",
          actions: "resetReading"
        },
        CLOSE: {
          target: "idle",
          actions: "clearStory"
        }
      }
    }
  }
});