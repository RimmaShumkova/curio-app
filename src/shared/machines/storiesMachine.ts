import { setup, fromPromise, assign } from "xstate";
import { storyModel, type Story } from "../../entities/story/model/story";

interface StoriesContext {
  stories: Story[];
  errorMessage: string | null;
}

// Актор для загрузки историй
const fetchStoriesActor = fromPromise(async () => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  return storyModel.getAll();
});

export const storiesMachine = setup({
  types: {
    context: {} as StoriesContext,
    events: {} as 
      | { type: "FETCH" }
      | { type: "RETRY" }
      | { type: "REFRESH" }
  },
  actors: {
    fetchStories: fetchStoriesActor
  },
  actions: {
    setStories: assign({
      stories: ({ event }) => (event as any).output,
      errorMessage: null
    }),
    setError: assign({
      errorMessage: ({ event }) => (event as any).error?.message || "Ошибка загрузки"
    }),
    clearError: assign({ errorMessage: null })
  }
}).createMachine({
  id: "stories",
  initial: "idle",
  context: {
    stories: [],
    errorMessage: null
  },
  states: {
    idle: {
      on: { FETCH: "loading" }
    },
    loading: {
      invoke: {
        src: "fetchStories",
        onDone: {
          target: "success",
          actions: "setStories"
        },
        onError: {
          target: "failure",
          actions: "setError"
        }
      }
    },
    success: {
      on: { 
        REFRESH: "loading",
        FETCH: "loading"
      }
    },
    failure: {
      on: { 
        RETRY: "loading",
        FETCH: "loading"
      }
    }
  }
});